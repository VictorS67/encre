import mitt, { Emitter, EventType } from "mitt";

/* eslint-disable  @typescript-eslint/no-explicit-any */
class App<Handlers> {
  events: Emitter<Record<EventType, unknown>>;

  handlers: Handlers;

  services: Array<any>;

  unlistenServices: Array<any>;

  constructor() {
    this.handlers = {} as Handlers;
    this.events = mitt();
    this.services = [];
    this.unlistenServices = [];
  }

  method<Name extends string & keyof Handlers>(
    name: Name,
    func: Handlers[Name],
  ) {
    if (this.handlers[name] != null) {
      throw new Error(
        `Conflicting method name, names must be globally unique: ${name}`,
      );
    }
    this.handlers[name] = func;
  }

  service(func: any) {
    this.services.push(func);
  }

  combine(...apps: App<unknown>[]) {
    for (const app of apps) {
      Object.entries(app.handlers as Record<string, unknown>).forEach(
        ([name, func]) => {
          this.method(name as string & keyof Handlers, func as any);
        },
      );

      app.services.forEach((service) => {
        this.service(service);
      });

      for (const [name, listeners] of app.events.all.entries()) {
        for (const listener of listeners) {
          this.events.on(name as "*", listener);
        }
      }
    }
  }

  startServices() {
    if (this.unlistenServices.length > 0) {
      const error = new Error(
        "App: startServices called while services are already running",
      );
      console.log(`[Exception] ${error}`);
    }

    this.unlistenServices = this.services.map((service) => service());
  }

  stopServices() {
    this.unlistenServices.forEach((unlisten) => {
      if (unlisten) {
        unlisten();
      }
    });
    this.unlistenServices = [];
  }
}

export function createApp<T>() {
  return new App<T>();
}
