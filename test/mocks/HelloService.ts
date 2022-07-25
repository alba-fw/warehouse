import {GreetService} from "./GreetService";

export class HelloService extends GreetService{

    constructor() {
        super('Hello');
    }
}