import {Warehouse} from "../../src/Warehouse";
import {I18nHelloService} from "../mocks/I18nHelloService";
import {WithBindDependency} from "../mocks/WithBindDependency";
import {GreetServiceInterface} from "../mocks/GreetServiceInterface";
import {GreetService} from "../mocks/GreetService";
import {GreetServiceInterface2} from "../mocks/GreetServiceInterface2";
import {GreetServiceInterface3} from "../mocks/GreetServiceInterface3";
import {HelloService} from "../mocks/HelloService";
import {WithBindInterfaceDependency} from "../mocks/WithBindInterfaceDependency";
import {NotBindInterface} from "../mocks/NotBindInterface";
import {WithNotBindInterfaceDependency} from "../mocks/WithNotBindInterfaceDependency";

export const factoryCommon = (warehouse: Warehouse) => {

    it('instantiate a class that was previously configured as a factory binding', () => {
        const service = warehouse.get(I18nHelloService);
        expect(service).toBeInstanceOf(I18nHelloService);
        expect(service.greet('Jeff')).toBe('Olá Jeff');
    });

    it('instantiate a class that depends on a class that was previously configured as a factory binding', () => {
        const service = warehouse.get(WithBindDependency);
        expect(service).toBeInstanceOf(WithBindDependency);
        expect(service.helloService).toBeInstanceOf(I18nHelloService);
        expect(service.greet('Jeff')).toBe('Olá Jeff');
    });

    it('instantiate an implementation of a interface that was previously configured as a factory binding', () => {
        const service = warehouse.getInterface<GreetServiceInterface>('GreetServiceInterface');
        expect(service).toBeInstanceOf(GreetService);
        expect(service.greet('Jeff')).toBe('Hey Jeff');
    });

    it('instantiate an implementation of a interface that was previously configured as a interface to implementation bind', () => {
        const service1 = warehouse.getInterface<GreetServiceInterface2>('GreetServiceInterface2');
        const service2 = warehouse.getInterface<GreetServiceInterface3>('GreetServiceInterface3');
        expect(service1).toBeInstanceOf(HelloService);
        expect(service1.greet('Jeff')).toBe('Hello Jeff');
        expect(service2).toBeInstanceOf(I18nHelloService);
        expect(service2.greet('Jeff')).toBe('Olá Jeff');
    });

    it('instantiate a class that depends on a interface that was previously configured as a factory binding', () => {
        const service = warehouse.get(WithBindInterfaceDependency);
        expect(service).toBeInstanceOf(WithBindInterfaceDependency);
        expect(service.greetService).toBeInstanceOf(GreetService);
        expect(service.greet('Jeff')).toBe('Hey Jeff');
    });

    it('fails to instantiate an interface that was not properly configured in any bind', () => {
        const expectedError = 'Interface `NotBindInterface` is not resolvable. Have you forgot to set a binding for `NotBindInterface`?';
        expect(() => warehouse.getInterface<NotBindInterface>('NotBindInterface')).toThrow(expectedError);
        expect(() => warehouse.get(WithNotBindInterfaceDependency)).toThrow(expectedError);
    });

};