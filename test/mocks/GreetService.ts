import {GreetServiceInterface} from "./GreetServiceInterface";
import {GreetServiceInterface2} from "./GreetServiceInterface2";
import {GreetServiceInterface3} from "./GreetServiceInterface3";

export class GreetService implements GreetServiceInterface, GreetServiceInterface2, GreetServiceInterface3 {

    constructor(protected readonly greeting: string) {}

    greet(name: string):string {
        return `${this.greeting} ${name}`;
    }
}