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

describe("Test lazy resolving of dependencies", () => {

    let warehouse:Warehouse = new Warehouse();

    beforeAll(() => {

        // set up the bindings
        warehouse.whenAny().needs(I18nHelloService).giveLazy((wh) => wh.build(I18nHelloService, wh.build(I18n), Languages.pt));
        warehouse.whenAny().needsInterface('GreetServiceInterface').giveLazy((warehouse) => warehouse.build(GreetService, 'Hey'));
        warehouse.whenAny().needsInterface('GreetServiceInterface2').giveClassLazy(HelloService);
        warehouse.whenAny().needsInterface('GreetServiceInterface3').giveClassLazy(I18nHelloService);

    });

    factoryCommon(warehouse);

    it('ensure that at each warehouse.get() call, we get a different instance of the same class (lazy loading)', () => {
        const service1 = warehouse.getNew(I18nHelloService);
        const service2 = warehouse.getNew(I18nHelloService);
        expect(service1 === service2).toBeFalsy();

        const service3 = warehouse.getNew(WithBindDependency);
        const service4 = warehouse.getNew(WithBindDependency);
        expect(service3 === service4).toBeFalsy();
        service4.helloService = warehouse.build(I18nHelloService, warehouse.build(I18n), Languages.en);
        expect(service3.helloService === service4.helloService).toBeFalsy();
        expect(service3.greet('Jeff')).toBe('Olá Jeff');
        expect(service4.greet('Jeff')).toBe('Hello Jeff');
    });

});