import {AbstractBinding} from "./AbstractBinding";
import {Warehouse} from "../Warehouse";

export class FactoryBinding<Type> extends AbstractBinding<Type>{

    constructor(private warehouse:Warehouse, private factory: (warehouse:Warehouse) => Type) {
        super();
    }

    resolve(): Type {
        return this.factory(this.warehouse);
    }

}