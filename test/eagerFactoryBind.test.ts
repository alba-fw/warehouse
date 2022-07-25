import {Warehouse} from "../src/Warehouse";
import {I18nHelloService} from "./mocks/I18nHelloService";
import {I18n} from "./mocks/I18n";
import {Languages} from "./mocks/Languages.enum";
import {WithBindDependency} from "./mocks/WithBindDependency";
import {GreetService} from "./mocks/GreetService";
import {GreetServiceInterface} from "./mocks/GreetServiceInterface";
import {HelloService} from "./mocks/HelloService";
import {GreetServiceInterface2} from "./mocks/GreetServiceInterface2";
import {GreetServiceInterface3} from "./mocks/GreetServiceInterface3";
import {factoryCommon} from "./util/factoryCommon";

describe("Test eager resolving of dependencies", () => {

    let warehouse:Warehouse = new Warehouse();

    beforeAll(() => {

        // set up the bindings
        warehouse.whenAny().needs(I18nHelloService).give((wh) => wh.build(I18nHelloService, wh.build(I18n), Languages.pt));
        warehouse.whenAny().needsInterface('GreetServiceInterface').give((warehouse) => warehouse.build(GreetService, 'Hey'));
        warehouse.whenAny().needsInterface('GreetServiceInterface2').giveClass(HelloService);
        warehouse.whenAny().needsInterface('GreetServiceInterface3').giveClass(I18nHelloService);
        //warehouse.whenAny().needs(WithBindDependency).giveClass(WithBindDependency);

    });

    factoryCommon(warehouse);

    it('ensure that at each warehouse.get() call, we get the same instance of the same class', () => {

        const service1 = warehouse.get(I18nHelloService);
        const service2 = warehouse.get(I18nHelloService);
        expect(service1 === service2).toBeTruthy();

        const service3 = warehouse.get(WithBindDependency);
        const service4 = warehouse.get(WithBindDependency);
        expect(service1 === service2).toBeTruthy();
        service4.helloService = warehouse.build(I18nHelloService, warehouse.build(I18n), Languages.en);
        expect(service3.helloService === service4.helloService).toBeTruthy();
        expect(service3.greet('Jeff')).toBe('Hello Jeff');
        expect(service4.greet('Jeff')).toBe('Hello Jeff');

    });

});