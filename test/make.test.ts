import {Warehouse} from "../src/Warehouse";
import {NoDependencyService} from "./mocks/NoDependencyService";
import {OneLevelDependencyService} from "./mocks/OneLevelDependencyService";
import {TwoLevelDependencyService} from "./mocks/TwoLevelDependencyService";
import {I18nHelloService} from "./mocks/I18nHelloService";
import {OneLevelDependencyServiceWithoutDecorator} from "./mocks/OneLevelDependencyServiceWithoutDecorator";

describe("Test Warehouse make method for zero config resolution", () => {

    let warehouse:Warehouse;

    beforeAll(() => {
        warehouse = new Warehouse();
    });

    it("automatically instantiate a class without dependencies", () => {
        expect(warehouse.get(NoDependencyService)).toBeInstanceOf(NoDependencyService);
    });

    it('automatically instantiate a class with one level of resolvable dependencies', () => {
        const service = warehouse.get(OneLevelDependencyService);
        expect(service).toBeInstanceOf(OneLevelDependencyService);
        expect(service.dependency1).toBeInstanceOf(NoDependencyService);
    });

    it('automatically instantiate a class with two levels of resolvable dependencies', () => {
        const service = warehouse.get(TwoLevelDependencyService);
        expect(service).toBeInstanceOf(TwoLevelDependencyService);
        expect(service.dependency1).toBeInstanceOf(OneLevelDependencyService);
        expect(service.dependency1.dependency1).toBeInstanceOf(NoDependencyService);
    });

    it('fails to instantiate a class with dependencies that doesn\'t have a `Injectable` decorator', () => {
        expect(() => warehouse.get(OneLevelDependencyServiceWithoutDecorator))
            .toThrow('No metadata found for type `OneLevelDependencyServiceWithoutDecorator`. Did you forgot to add the @Injectable decorator or to enable "emitDecoratorMetadata"?');
    });

    it('fails to instantiate a class that depends on non resolvable dependencies (like native types)', () => {
        expect(() => warehouse.get(I18nHelloService))
            .toThrow('Type `String` is not automatically resolvable. Maybe you need to setup a bind for `I18nHelloService`?');
    });

});