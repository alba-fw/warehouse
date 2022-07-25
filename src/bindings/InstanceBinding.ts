import {AbstractBinding} from "./AbstractBinding";

export class InstanceBinding<Type> extends AbstractBinding<Type> {

    constructor(private instance: Type) {
        super();
    }

    resolve(): Type {
        return this.instance;
    }

}