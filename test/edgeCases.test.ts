import {Warehouse} from "../src/Warehouse";
import {CircularService1} from "./mocks/CircularService1";

describe("Test edge cases", () => {

    let warehouse:Warehouse = new Warehouse();

    it ('Test the correct handling of circular dependencies', () => {
        expect(() => warehouse.get(CircularService1)).toThrow('Circular dependency found when resolving `CircularService3`');
    });

});