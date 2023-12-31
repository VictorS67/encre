import { BaseRetriever, BaseRetrieverInput} from "../baseretriever";
import { Context} from "../../docs/context";
import { expect, test, jest } from '@jest/globals';
import { stringify } from 'yaml';


export class TestRetriever extends BaseRetriever{

    _namespace = ["TestRetriever"];

    constructor(fields?: BaseRetrieverInput) {
        super(fields);
        
    }

    async _getRelevantContexts(
        _query: string,
        _callbacks?: any
      ): Promise<Context[]> {
        // Implement the logic to retrieve relevant contexts
        // based on the query and callbacks (if needed)
        const relevantContexts: Context[] = [];
        const context1Metadata: Record<"Context 1", "page1"> = {
            "Context 1": "page1",
          };
          
        const context1 = new Context({
            pageContent: "Context 1",
            metadata: context1Metadata,
        });
        const context2Metadata: Record<"Context 2", "page1"> = {
            "Context 2": "page1",
          };
          
        const context2 = new Context({
            pageContent: "Context 2",
            metadata: context2Metadata,
        });
        // Example code: Populate relevantContexts with some dummy data
        relevantContexts.push(context1);
        relevantContexts.push(context2);
    
        return relevantContexts;
      }
    
}

test('retriever calling get relevant context called when invoke called', async () => {
    const testRetriever = new TestRetriever({
        callbacks: undefined,
        tags: ["tag1", "tag2"],
        metadata: { key: "value" },
        verbose: true,
    });

    const query = "example query";
    const result = await testRetriever.invoke(query);
    const context1Metadata: Record<"Context 1", "page1"> = {
        "Context 1": "page1",
      };
      
    const context1 = new Context({
        pageContent: "Context 1",
        metadata: context1Metadata,
    });
    const context2Metadata: Record<"Context 2", "page1"> = {
        "Context 2": "page1",
      };
      
    const context2 = new Context({
        pageContent: "Context 2",
        metadata: context2Metadata,
    });
    expect(result).toEqual([
        context1, context2,]);

});



test('retriever calling get relevant context called when get Relevant Context called', async () => {
    const testRetriever = new TestRetriever({
        callbacks: undefined,
        tags: ["tag1", "tag2"],
        metadata: { key: "value" },
        verbose: true,
    });

    const query = "example query";
    const result = await testRetriever.getRelevantContexts(query);
    const context1Metadata: Record<"Context 1", "page1"> = {
        "Context 1": "page1",
      };
      
    const context1 = new Context({
        pageContent: "Context 1",
        metadata: context1Metadata,
    });
    const context2Metadata: Record<"Context 2", "page1"> = {
        "Context 2": "page1",
      };
      
    const context2 = new Context({
        pageContent: "Context 2",
        metadata: context2Metadata,
    });
    expect(result).toEqual([
        context1, context2,]);

});
