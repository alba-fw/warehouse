import {Injectable} from "../../src/decorators/Injectable";
import {Interface} from "../../src/decorators/Interface";
import {NotBindInterface} from "./NotBindInterface";

@Injectable
export class WithNotBindInterfaceDependency {

    constructor(@Interface('NotBindInterface') public greetService: NotBindInterface) {
    }

}