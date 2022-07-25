import {I18nHelloService} from "./I18nHelloService";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class WithBindDependency {

    constructor(public helloService: I18nHelloService) {
    }

    greet(name: string): string {
        return this.helloService.greet(name);
    }

}