
# FaaSFlow Design Document
## Summary: User Interaction Workflow in FaaSFlow

FaaSFlow implements an efficient serverless workflow system by leveraging a Worker Side Pattern (WorkerSP). The system is composed of three main components, each playing a crucial role in managing the execution of serverless functions within workflows:

1. **Workflow Graph Scheduler**: Located on the master node, the graph scheduler processes user-uploaded workflows and divides them into sub-graphs. This division is strategic, considering the resources available on each worker node, such as CPU, memory, and network bandwidth, and the data exchange requirements between function pairs within the workflow. This approach ensures optimal resource utilization and efficient execution.

2. **Per-Worker Workflow Engine**: Each worker node hosts its workflow engine, responsible for managing the states of functions assigned to it. The states of functions include ready, executing, completed, or failed, which are essential for determining the execution order and handling dependencies. Local function tasks are triggered based on these states, ensuring that functions are executed in the correct sequence and only when their dependencies are satisfied.

3. **Adaptive Storage Library (FaaStore)**: FaaStore dynamically manages the memory resources within containers, allocating additional memory as needed and choosing the most suitable data storage option (in-memory or remote) for function communication. This decision is based on the function's location and its data dependencies, aiming to minimize data transfer overhead and enhance performance.

When a user interacts with FaaSFlow, they define their workflow using constructs like `foreach`, `switch`, and others, specifying the execution logic and data dependencies. The system then orchestrates the workflow execution across multiple worker nodes, efficiently managing resources and function states to ensure smooth and scalable workflow processing【221†source】.
anage, and destroy containers that serve as the execution environment for functions.

## 1. Workflow Graph Scheduler (Master Node)

### Purpose
To resolve user-uploaded workflows and partition them into sub-graphs for efficient execution.

#### Supported Logic Steps
- **Task (Function)**: Single function invocations are represented as DAG nodes.
- **Sequence**: Contains serial task steps with edge weights in the DAG calculated based on 99%-ile latency of data transmission between nodes.
- **Parallel**: Executes multiple tasks in parallel, with each branch converted by the DAG Parser.
- **Switch**: Invokes different tasks based on conditional expressions, similar to parallel steps.
- **Foreach**: Executes task steps for each input element in parallel, treating all instances as one node in the DAG.


## Master Node Operation in FaaSFlow

In the FaaSFlow system, the master node plays a pivotal role in orchestrating the execution of serverless workflows. It is responsible for parsing user-defined workflows, partitioning these workflows into subgraphs, and efficiently distributing the execution tasks among worker nodes. Below is a detailed explanation of the master node's functionality, accompanied by relevant code snippets:

### Workflow Definition and Parsing
Users define their serverless workflows using a YAML configuration, which specifies the execution logic and dependencies among functions. The master node uses a Workflow Parser to interpret these configurations and constructs a Directed Acyclic Graph (DAG) representing the workflow.

```python
# Workflow Parser example
def parse_workflow(workflow_yaml):
    with open(workflow_yaml, 'r') as file:
        workflow_config = yaml.safe_load(file)
    # Construct the DAG based on workflow_config
    workflow_dag = construct_dag(workflow_config)
    return workflow_dag
```

### Workflow Graph Scheduler
The Workflow Graph Scheduler on the master node analyzes the DAG to determine the best partitioning strategy. This involves assessing the resources available on each worker node and the data transfer requirements between function pairs to minimize data movement and optimize execution.

```python
# Workflow Graph Scheduler example
def partition_workflow(workflow_dag):
    # Analyze workflow DAG and worker node resources
    for node in workflow_dag.nodes:
        suitable_worker = find_suitable_worker(node)
        assign_node_to_worker(node, suitable_worker)
    # Partition the workflow DAG into subgraphs for each worker
    subgraphs = create_subgraphs_for_workers(workflow_dag)
    return subgraphs
```

### Distributing Workflows to Worker Nodes
After partitioning the workflow, the master node distributes the subgraphs to the corresponding worker nodes. Each worker node then executes its assigned subgraph using its local workflow engine.

```python
# Distributing subgraphs to worker nodes example
def distribute_subgraphs_to_workers(subgraphs):
    for worker, subgraph in subgraphs.items():
        # Serialize the subgraph for transmission
        serialized_subgraph = serialize_subgraph(subgraph)
        # Send the subgraph to the worker node
        send_subgraph_to_worker(worker, serialized_subgraph)
```

### Execution State Synchronization
The master node synchronizes the global state of the workflow execution across all worker nodes, ensuring that inter-node dependencies are respected and that the workflow progresses towards completion.

```python
# Execution state synchronization example
def synchronize_execution_state(global_state):
    for worker in workers:
        worker_state = fetch_state_from_worker(worker)
        update_global_state(global_state, worker_state)
    if check_workflow_completion(global_state):
        finalize_workflow_execution(global_state)
```

The master node's effective management and coordination capabilities are key to leveraging the scalability and flexibility of serverless computing in FaaSFlow, optimizing resource usage and execution efficiency in a distributed environment.


## 2. Per-Worker Workflow Engine(Worker Node)

### Purpose
Manages function execution states and triggers local tasks, reducing reliance on the master node for task distribution and state synchronization.


### Worker Node Function Execution in FaaSFlow

In the FaaSFlow system, worker nodes execute functions following a decentralized workflow pattern, known as Worker Side Pattern (WorkerSP). This approach reduces scheduling overhead and data movement by allowing worker nodes to manage function execution based on the state of their predecessor functions. Here's an overview of how worker nodes execute functions, including related code snippets from the `workersp.py` file:

#### Function Information Retrieval
Each worker node retrieves function information from a database, caching the result to minimize database calls. The `get_function_info` function is responsible for this task, fetching details like the function's IP address, which determines whether the function will be executed locally or on a remote node.

```python
def get_function_info(self, function_name: str) -> Any:
    if function_name not in self.function_info:
        self.function_info[function_name] = repo.get_function_info(function_name, self.info_db)
    return self.function_info[function_name]
```

#### Function Triggering
When a function's predecessor finishes execution, the worker node may trigger the function. The decision to run the function depends on whether all its parents have finished execution. The `trigger_function` method handles this logic, differentiating between local and remote function execution.

```python
def trigger_function(self, state: WorkflowState, function_name: str, no_parent_execution=False) -> None:
    func_info = self.get_function_info(function_name)
    if func_info['ip'] == self.host_addr:  # Local execution
        self.trigger_function_local(state, function_name, no_parent_execution)
    else:  # Remote execution
        self.trigger_function_remote(state, function_name, func_info['ip'], no_parent_execution)
```

#### Local Function Execution
For functions running locally, the worker node checks if all parent functions have been executed. If so, it proceeds to execute the function and then triggers any subsequent functions. The local execution process involves acquiring a lock to ensure thread safety, updating the execution state, and then releasing the lock.

```python
def trigger_function_local(self, state: WorkflowState, function_name: str, no_parent_execution=False) -> None:
    ...
    if runnable:
        state.executed[function_name] = True
        self.run_function(state, function_name)
    ...
```

#### Remote Function Execution
For functions designated to run on a remote worker node, the triggering worker node constructs a request and sends it to the remote node's API endpoint. The remote node then follows a similar process to local execution.

```python
def trigger_function_remote(self, state: WorkflowState, function_name: str, remote_addr: str, no_parent_execution=False) -> None:
    ...
    response = requests.post(remote_url, json=data)
    response.close()
```

#### Execution State Management
Worker nodes maintain the execution state of functions, tracking which functions have been executed and which are pending. This state management is crucial for determining the order of function execution and ensuring data dependencies are met.

```python
def check_runnable(self, state: WorkflowState, function_name: str) -> bool:
    return state.parent_executed[function_name] == info['parent_cnt'] and not state.executed[function_name]
```

This decentralized execution model allows FaaSFlow to efficiently manage serverless workflows, reducing the overhead associated with centralized scheduling and enabling more scalable and responsive serverless applications.


## 3. Container Management

### Purpose
To dynamically create, manage, and destroy containers that serve as the execution environment for functions.


### Container Management in FaaSFlow

In the FaaSFlow system, container management is a critical component that handles the lifecycle of containers used to execute serverless functions. Containers provide an isolated environment for function execution, ensuring that each function has the necessary dependencies and runtime without interfering with other functions. Here's an overview of container management in FaaSFlow, including relevant code snippets:

### Container Lifecycle
Container management involves creating containers for new function executions, monitoring their execution, and cleaning up containers once the function execution is complete. This ensures efficient resource utilization and scalability.

#### Creating Containers
When a function is triggered, the system checks if there is an existing container that can be reused. If not, a new container is created based on the function's requirements.

```python
# Example of container creation
def create_container(function_config):
    image_name = function_config['image']
    container = docker_client.containers.run(image_name, detach=True)
    return container
```

#### Monitoring Execution
Containers are monitored to ensure they are running correctly and to collect execution metrics such as execution time and resource usage.

```python
# Example of container monitoring
def monitor_container(container_id):
    container = docker_client.containers.get(container_id)
    stats = container.stats(stream=False)
    return stats
```

#### Cleaning Up Containers
After a function execution completes, the container is either stopped and removed or kept alive for potential reuse, depending on the system's configuration and optimization strategies.

```python
# Example of container cleanup
def cleanup_container(container_id):
    container = docker_client.containers.get(container_id)
    container.stop()
    container.remove()
```

### Resource Allocation and Optimization
Container management also involves allocating resources to containers and optimizing their usage to handle varying workloads efficiently.

#### Resource Allocation
Containers are allocated resources such as CPU and memory based on the function's requirements and the overall system's resource availability.

```python
# Example of resource allocation for a container
def allocate_resources(container_id, cpu_quota, memory_limit):
    container = docker_client.containers.get(container_id)
    container.update(cpu_quota=cpu_quota, mem_limit=memory_limit)
```

#### Optimization
The system employs strategies such as container reuse, scaling, and load balancing to optimize resource usage and improve the system's responsiveness and scalability.

```python
# Example of container reuse strategy
def reuse_container(function_name):
    # Check for existing containers that can be reused for the function
    containers = docker_client.containers.list(filters={'label': function_name})
    if containers:
        return containers[0]  # Reuse an existing container
    else:
        return create_container(function_config)  # Create a new container
```

Container management is integral to the FaaSFlow system, ensuring that serverless functions are executed efficiently, with optimal resource usage and scalability.


## 4. Adaptive Storage Library (FaaStore)

### Purpose
Dynamically allocates memory resources and chooses the optimal data storage solution, reducing data movement overhead.


### FaaStore in FaaSFlow

FaaStore, an adaptive storage library within FaaSFlow, plays a crucial role in optimizing data storage and access for serverless functions. It intelligently manages data storage based on the function's context within the workflow, leveraging a hybrid storage approach to minimize data movement overhead. Below is a detailed explanation of FaaStore's functionality, accompanied by relevant code snippets:

#### Dependence-Driven Hybrid Storage
FaaStore dynamically selects the optimal storage solution for function data, considering the function's location and dependencies within the workflow. It employs a hybrid approach, using in-memory storage for data related to functions within the same sub-graph to take advantage of data locality. For other cases, it defaults to remote storage as per user configurations, ensuring efficient data management.

```python
# Hybrid storage decision-making in FaaStore
def choose_storage(function_key):
    if is_local(function_key):
        return in_memory_storage
    else:
        return remote_storage
```

#### Easy-to-Use Low-Level API
FaaStore simplifies data storage operations for developers by abstracting the complexity of storage selection. It provides a unified API for storage operations, allowing function code to interact seamlessly with data storage. FaaStore assesses the workflow configuration and function dependencies to determine the most suitable storage option, optimizing data access and storage.

```python
# FaaStore API usage example
def handle_function_input_output(function_key, input_data):
    # Fetching data for the function
    data = FaaStore.fetch(function_key, input_data)
    
    # Function logic...
    
    # Saving function output
    output = process_data(data)
    FaaStore.save(function_key, output)
```

FaaStore's adaptive storage mechanism significantly enhances the efficiency of serverless workflows in FaaSFlow by minimizing data movement overheads and ensuring timely data availability for functions. Its integration within the workflow allows for seamless data handling, reducing latency and improving the execution performance of serverless functions.


