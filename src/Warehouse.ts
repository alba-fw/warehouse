import "reflect-metadata";
import {NativeTypes} from "./util/NativeTypes.enum";
import {AbstractBinding} from "./bindings/AbstractBinding";
import {ClassConstructor} from "./types/ClassConstructor";
import {BindingContext} from "./bindingBuilders/BindingContext";
import {AddBindingCallback} from "./types/AddBindingCallback";
import {BindingDictionary} from "./types/BindingDictionary";
import {ContextBindingDictionary} from "./types/ContextBindingDictionary";

export class Warehouse {

    private singletons: { [key: string]: any } = {};
    private globalBindings: BindingDictionary = {};
    private contextualBindings: ContextBindingDictionary = {};

    private makeFromBinding<Type>(bindingKey: string, contextualCaller?: string): Type|undefined {

        let binding:AbstractBinding<any>|undefined;

        // contextual binding
        if (contextualCaller !== undefined) {
            binding = this.contextualBindings[contextualCaller]?.[bindingKey] ?? undefined;
            if (binding !== undefined) {
                return binding.resolve();
            }
        }

        // global type binding
        binding = this.globalBindings[bindingKey];
        if (binding !== undefined) {
            return binding.resolve();
        }

    }

    /**
     * Build an instance of the required type (interface or class), considering the bindings and automatic resolution.
     *
     * @param type
     * @param parentType
     */
    private make<Type>(type: ClassConstructor<Type>, parentType?: ClassConstructor<Type>):Type {

        // first, check if we have a configured binding for the object
        const result:Type|undefined = parentType === undefined ? this.makeFromBinding(type.name) : this.makeFromBinding(type.name, parentType.name);
        if (result !== undefined) {
            return result;
        }

        // if there is no dependencies, just build the object without parameters
        if (type.length === 0) {
            return this.build(type);
        }

        // there are dependencies, so find the dependencies types
        const dependenciesTypes:any[] = Reflect.getMetadata('design:paramtypes', type);
        if (dependenciesTypes === undefined) {

            // the type is a native nodejs type
            if (parentType !== undefined && type.name in NativeTypes) {
                throw `Type \`${type.name}\` is not automatically resolvable. Maybe you need to setup a bind for \`${parentType.name}\`?`;
            }

            // the type doesn't have the @Injectable decorator (so we don't have enough info to resolve it)
            if (parentType === undefined) {
                throw `No metadata found for type \`${type.name}\`. Did you forgot to add the @Injectable decorator or to enable "emitDecoratorMetadata"?`;
            }

            throw `\`${type.name}\` is not automatically resolvable. Maybe you need to setup a bind for \`${parentType.name}\` or add the @Injectable decorator to \`${type.name}\`?`;

        }

        // resolve the dependencies...
        let dependencies:any = [];

        // go through the dependencies trying to resolve each one of them
        for (const dependencyType of dependenciesTypes) {

            // reflect api already detects circular dependencies, returning undefined when a circular dependency is found
            if (dependencyType === undefined) {
                throw `Circular dependency found when resolving \`${type.name}\``;
            }

            // recursively resolve the dependencies
            if (typeof dependencyType === 'string') {
                dependencies.push(this.getInterface(dependencyType));
            } else {
                dependencies.push(this.make(dependencyType, type));
            }
        }

        // build the object
        return this.build(type, ...dependencies);
    }

    /**
     * Build an instance of a class with the provided parameters.
     *
     * @param type
     * @param params
     */
    build<Type, ConstructorParams extends any[]>(type: (new (...params: ConstructorParams) => Type), ...params: ConstructorParams): Type {
        return new type(...params);
    }

    /**
     * Returns an instance of the required class, considering the bindings and automatic resolution.
     * This method always return a new object each time it's called.
     *
     * @param type
     */
    getNew<Type>(type: ClassConstructor<Type>):Type {
        return this.make(type);
    }

    /**
     * Returns an instance of the required class, considering the bindings and automatic resolution.
     * This method always return the same object for the same class (singleton)
     *
     * @param type
     */
    get<Type>(type: ClassConstructor<Type>):Type {
        if (this.singletons[type.name] === undefined) {
            this.singletons[type.name] = this.make(type);
        }
        return this.singletons[type.name];
    }

    getNewInterface<Type>(contract: string): Type {
        const result: Type | undefined = this.makeFromBinding(contract);
        if (result !== undefined) {
            return result;
        }
        throw `Interface \`${contract}\` is not resolvable. Have you forgot to set a binding for \`${contract}\`?`;
    }

    getInterface<Type>(contract: string): Type {
        if (this.singletons[contract] === undefined) {
            this.singletons[contract] = this.getNewInterface(contract);
        }
        return this.singletons[contract];
    }

    run<Type>(object: Object, method: (...params: any[]) => Type): Type {

        // no dependencies on the method, just execute it
        if (method.length === 0) {
            return method();
        }

        // otherwise, we resolve the dependencies
        const dependenciesTypes:any[] = Reflect.getMetadata('design:paramtypes', object, method.name);
        if (dependenciesTypes === undefined) {
            throw `No metadata found for method \`${method.name}\`. Did you forgot to add the @Runnable() decorator to it or to enable "emitDecoratorMetadata"?`;
        }

        // resolve the dependencies...
        let dependencies:any = [];
        for (const dependencyType of dependenciesTypes) {

            // resolve each dependency
            if (typeof dependencyType === 'string') {
                dependencies.push(this.getInterface(dependencyType));
            } else {
                dependencies.push(this.make(dependencyType));
            }

        }

        return method(...dependencies);
    }

    whenAny(): BindingContext {
        // we decided to pass a callback to the BindingContext here for some reasons:
        // 1. Passing the entire dictionary don't seems to be a good idea, since we'd be exposing the
        // it to other classes.
        // 2. Creating a public method to replace this callback would expose this method on the public interface of
        // the main warehouse object, and that's not what we want to do.
        const addGlobalBindingCallback: AddBindingCallback = (key: string, binding: AbstractBinding<any>) => {
            this.globalBindings[key] = binding;
        }
        return new BindingContext(this, addGlobalBindingCallback);
    }

    when<Type>(...callers: ClassConstructor<Type>[]): BindingContext {

        const addBindingCallback:AddBindingCallback = (key:string, binding: AbstractBinding<any>) => {
            for (const caller of callers.map(item => item.name)) {
                this.contextualBindings[caller] = {
                    [key]: binding,
                };
            }
        };
        return new BindingContext(this, addBindingCallback);
    }

}