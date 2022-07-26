import {HelloService} from "./HelloService";
import {Runnable} from "../../src/decorators/Runable";

export class RunService {

    methodWithoutDeps(): string {
        return 'Hi Jeff';
    }

    @Runnable()
    methodWithDeps(helloService: HelloService): string {
        return helloService.greet('Jeff');
    }

    methodWithDepsNotDecorated(helloService: HelloService): string {
        return helloService.greet('Jeff');
    }
}