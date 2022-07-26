import {Warehouse} from "../src";
import {HelloService} from "./mocks/HelloService";
import {I18n} from "./mocks/I18n";
import {Languages} from "./mocks/Languages.enum";
import {I18nHelloService} from "./mocks/I18nHelloService";
import {GreetService} from "./mocks/GreetService";

describe("Test Warehouse build method", () => {

    let warehouse:Warehouse;

    beforeAll(() => {
        warehouse = new Warehouse();
    });

    it("automatically instantiate a class with no dependencies", () => {
        const helloService = warehouse.build(HelloService);
        expect(helloService).toBeInstanceOf(HelloService);
        expect(helloService.greet('Jeff')).toBe('Hello Jeff');
    });

    it("automatically instantiate a class providing all dependencies", () => {

        // no sub-dependencies
        const greetService = warehouse.build(GreetService, 'Hi');
        expect(greetService).toBeInstanceOf(GreetService);
        expect(greetService.greet('Jeff')).toBe('Hi Jeff');

        // manually providing sub-dependencies
        const i18nHelloService = warehouse.build(I18nHelloService, warehouse.build(I18n), Languages.pt);
        expect(i18nHelloService).toBeInstanceOf(I18nHelloService);
        expect(i18nHelloService.greet('Jeff')).toBe('Olá Jeff');

    });


});