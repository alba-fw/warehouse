import {Warehouse} from "../src/Warehouse";
import {GreetService} from "./mocks/GreetService";
import {ContextService1} from "./mocks/ContextService1";
import {ContextService2} from "./mocks/ContextService2";
import {ContextService3} from "./mocks/ContextService3";
import {ContextService4} from "./mocks/ContextService4";
import {HelloService} from "./mocks/HelloService";
import {ContextService5} from "./mocks/ContextService5";
import {ContextService6} from "./mocks/ContextService6";
import {ContextService7} from "./mocks/ContextService7";

describe("Test contextual bindings", () => {

    let warehouse:Warehouse;

    beforeAll(() => {
        warehouse = new Warehouse();
        warehouse.when(ContextService1).needs(GreetService).giveLazy(wh => wh.build(GreetService, 'Hi'));
        warehouse.when(ContextService2).needs(GreetService).giveLazy(wh => wh.build(GreetService, 'Hey'));
        warehouse.when(ContextService3, ContextService4).needs(GreetService).giveClassLazy(HelloService);
        warehouse.when(ContextService5).needs(GreetService).give(wh => wh.build(HelloService));
        warehouse.when(ContextService6).needs(GreetService).giveClass(HelloService);
    });

    it("check if the context is being respected on dependency resolution", () => {
        const service1 = warehouse.get(ContextService1);
        const service2 = warehouse.get(ContextService2);
        expect(service1).toBeInstanceOf(ContextService1);
        expect(service1.greetService).toBeInstanceOf(GreetService);
        expect(service1.greet('Jeff')).toBe('Hi Jeff');
        expect(service2).toBeInstanceOf(ContextService2);
        expect(service2.greetService).toBeInstanceOf(GreetService);
        expect(service2.greet('Jeff')).toBe('Hey Jeff');
    });

    it("check multiple classes bind to the same dependency (bind to a concrete class)", () => {
        const service3 = warehouse.get(ContextService3);
        const service4 = warehouse.get(ContextService4);
        expect(service3).toBeInstanceOf(ContextService3);
        expect(service4).toBeInstanceOf(ContextService4);
        expect(service3.greetService).toBeInstanceOf(HelloService);
        expect(service4.greetService).toBeInstanceOf(HelloService);
        expect(service3.greet('Jeff')).toBe('Hello Jeff');
        expect(service4.greet('Jeff')).toBe('Hello Jeff');
        expect(service3.greetService === service4.greetService).toBeFalsy(); //lazy resolving / not a singleton
    });

    it("check multiple classes bind to the same dependency (bind to a singleton factory/class)", () => {
        const service4 = warehouse.get(ContextService4);
        const service5 = warehouse.get(ContextService5);
        const service6 = warehouse.get(ContextService6);
        expect(service4.greetService === service5.greetService).toBeFalsy(); // 4 is not a singleton, so it will get a different instance
        expect(service5.greetService === service6.greetService).toBeTruthy(); // 5 and 6 are eager resolved/singletons
    });

    it("throw error when trying to resolve a class that doesn't have a proper binding", () => {
        expect(() => warehouse.get(ContextService7)).toThrow('`GreetService` is not automatically resolvable. Maybe you need to setup a bind for `ContextService7` or add the @Injectable decorator to `GreetService`?');
    });


    // it('automatically instantiate a class with one level of resolvable dependencies', () => {
    //     const service = warehouse.get(OneLevelDependencyService);
    //     expect(service).toBeInstanceOf(OneLevelDependencyService);
    //     expect(service.dependency1).toBeInstanceOf(NoDependencyService);
    // });
    //
    // it('automatically instantiate a class with two levels of resolvable dependencies', () => {
    //     const service = warehouse.get(TwoLevelDependencyService);
    //     expect(service).toBeInstanceOf(TwoLevelDependencyService);
    //     expect(service.dependency1).toBeInstanceOf(OneLevelDependencyService);
    //     expect(service.dependency1.dependency1).toBeInstanceOf(NoDependencyService);
    // });
    //
    // it('fails to instantiate a class with dependencies that doesn\'t have a `Injectable` decorator', () => {
    //     expect(() => warehouse.get(OneLevelDependencyServiceWithoutDecorator))
    //         .toThrow('No metadata found for type `OneLevelDependencyServiceWithoutDecorator`. Did you forgot to add the @Injectable decorator or to enable "emitDecoratorMetadata"?');
    // });
    //
    // it('fails to instantiate a class that depends on non resolvable dependencies (like native types)', () => {
    //     expect(() => warehouse.get(I18nHelloService))
    //         .toThrow('Type `String` is not automatically resolvable. Maybe you need to setup a bind for `I18nHelloService`?');
    // });

});