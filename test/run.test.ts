import {Warehouse} from "../src";
import {RunService} from "./mocks/RunService";

describe("Test Warehouse run method", () => {

    let warehouse:Warehouse;
    let service:RunService;

    beforeAll(() => {
        warehouse = new Warehouse();
        service = warehouse.build(RunService);
    });

    it("Runs a method without dependencies", () => {
        expect(warehouse.run(service, service.methodWithoutDeps)).toBe('Hi Jeff');
    });

    it("Runs a method with dependencies", () => {
        expect(warehouse.run(service, service.methodWithDeps)).toBe('Hello Jeff');
    });

    it("Runs a method with dependencies that is not decorated for container run", () => {
        expect(() => warehouse.run(service, service.methodWithDepsNotDecorated)).toThrow('No metadata found for method `methodWithDepsNotDecorated`. Did you forgot to add the @Runnable() decorator to it or to enable "emitDecoratorMetadata"?');
    });

    it("Runs a method with dependencies including a call to `this`", () => {
        expect(warehouse.run(service, service.methodWithDepsUsingThis)).toBe('Hello Jeff | Hey Jeff');
    });

});