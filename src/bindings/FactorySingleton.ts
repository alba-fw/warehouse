import {AbstractBinding} from "./AbstractBinding";
import {Warehouse} from "../Warehouse";

export class FactorySingleton<Type> extends AbstractBinding<Type> {

    protected instance: Type;

    constructor(private readonly warehouse:Warehouse, private readonly factory: (warehouse:Warehouse) => Type) {
        super();
        this.instance = this.factory(this.warehouse);
    }

    resolve(): Type {
        return this.instance;
    }

}