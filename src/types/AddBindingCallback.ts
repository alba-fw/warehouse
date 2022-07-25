import {AbstractBinding} from "../bindings/AbstractBinding";

export type AddBindingCallback = (key:string, binding: AbstractBinding<any>) => void;