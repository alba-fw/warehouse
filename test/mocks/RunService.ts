import {HelloService} from "./HelloService";
import {Runnable} from "../../src";
import {GreetService} from "./GreetService";

export class RunService {

    public readonly heyService: GreetService;

    constructor() {
        this.heyService = new GreetService('Hey');
    }

    methodWithoutDeps(): string {
        return 'Hi Jeff';
    }

    @Runnable()
    methodWithDeps(helloService: HelloService): string {
        return helloService.greet('Jeff');
    }

    @Runnable()
    methodWithDepsUsingThis(helloService: HelloService): string {
        return `${helloService.greet('Jeff')} | ${this.heyService.greet('Jeff')}`;
    }

    methodWithDepsNotDecorated(helloService: HelloService): string {
        return helloService.greet('Jeff');
    }
}