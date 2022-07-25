import {Warehouse} from "../Warehouse";
import {BindingBuilder} from "./BindingBuilder";
import {AddBindingCallback} from "../types/AddBindingCallback";

export class BindingContext {

    constructor(
        private readonly warehouse:Warehouse,
        private addBindingCallback: AddBindingCallback) {
    }

    needs<Type>(type: (new (...params: any[]) => Type)): BindingBuilder {
        return new BindingBuilder(this.warehouse, this.addBindingCallback, type.name);
    }

    needsInterface<Type>(contract: string): BindingBuilder {
        return new BindingBuilder(this.warehouse, this.addBindingCallback, contract);
    }
}