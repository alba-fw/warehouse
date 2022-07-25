import {GreetService} from "./GreetService";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class ContextService2 {

    constructor(public greetService: GreetService) {
    }

    greet(name: string): string {
        return this.greetService.greet(name);
    }
}