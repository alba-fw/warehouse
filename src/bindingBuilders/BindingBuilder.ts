import {Warehouse} from "../Warehouse";
import {FactoryBinding} from "../bindings/FactoryBinding";
import {AddBindingCallback} from "../types/AddBindingCallback";
import {ClassConstructor} from "../types/ClassConstructor";
import {InstanceBinding} from "../bindings/InstanceBinding";
import {FactorySingleton} from "../bindings/FactorySingleton";

export class BindingBuilder
{

    static singletons: { [key: string]: FactorySingleton<any> } = {};

    constructor(
        private readonly warehouse:Warehouse,
        private readonly addBindingCallback: AddBindingCallback,
        protected readonly key: string) {
    }

    give<Type>(factory: (warehouse: Warehouse) => Type): void {
        if (BindingBuilder.singletons[this.key] === undefined) {
            BindingBuilder.singletons[this.key] = new FactorySingleton(this.warehouse, factory);
        }
        this.addBindingCallback(this.key, BindingBuilder.singletons[this.key]);
    }

    giveClass<Type>(type: ClassConstructor<Type>): void {
        this.give((warehouse) => warehouse.get(type));
    }

    giveLazy<Type>(factory: (warehouse: Warehouse) => Type): void {
        this.addBindingCallback(this.key, new FactoryBinding(this.warehouse, factory));
    }

    giveClassLazy<Type>(type: ClassConstructor<Type>): void {
        this.giveLazy((warehouse) => warehouse.getNew(type));
    }

    giveInstance<Type>(instance: Type): void {
        this.addBindingCallback(this.key, new InstanceBinding(instance));
    }

}