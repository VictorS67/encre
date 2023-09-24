import { Class } from '../gettersetter.constant.js';

const encapDecoratorFactory = (encapType: Class) => {
  return (target: any, propertyKey: string | symbol) => {
    const privateKeyName = String(propertyKey);
    const publicKeyName: string =
      privateKeyName.charAt(0) === '_'
        ? privateKeyName.slice(1)
        : privateKeyName;

    const attributes: PropertyDescriptor = {
      enumerable: true,
      configurable: true,
    };

    if (encapType === Class.GETTER) {
      const getter = (): any => {
        const localVal: any = target[privateKeyName];
        return localVal;
      };

      attributes.get = getter;
    }

    if (encapType === Class.SETTER) {
      const setter = (newVal: any): void => {
        target[privateKeyName] = newVal;
      };

      attributes.set = setter;
    }

    Object.defineProperty(target, publicKeyName, attributes);
  };
};

const Getter = encapDecoratorFactory(Class.GETTER);
const Setter = encapDecoratorFactory(Class.SETTER);

export { Getter, Setter };
