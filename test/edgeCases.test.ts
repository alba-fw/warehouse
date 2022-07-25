import {Warehouse} from "../src/Warehouse";
import {CircularService1} from "./mocks/CircularService1";

describe("Test eager resolving of dependencies", () => {

    let warehouse:Warehouse = new Warehouse();

    it ('Test the correct handling of circular dependencies', () => {
        warehouse.get(CircularService1);
    });

});