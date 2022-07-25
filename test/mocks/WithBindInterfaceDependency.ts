import {Injectable} from "../../src/decorators/Injectable";
import {GreetServiceInterface} from "./GreetServiceInterface";
import {Interface} from "../../src/decorators/Interface";

@Injectable
export class WithBindInterfaceDependency {

    constructor(@Interface('GreetServiceInterface') public greetService: GreetServiceInterface) {
    }

    greet(name: string): string {
        return this.greetService.greet(name);
    }

}