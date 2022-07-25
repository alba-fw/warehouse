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

describe("Test resolving dependencies directly to instances", () => {

    let warehouse:Warehouse = new Warehouse();

    beforeAll(() => {

        // set up the instances
        const i18nHelloService:I18nHelloService = warehouse.build(I18nHelloService, warehouse.build(I18n), Languages.pt);
        const greetService1 = warehouse.build(GreetService, 'Hey');

        // set up the bindings
        warehouse.whenAny().needs(I18nHelloService).giveInstance(i18nHelloService);
        warehouse.whenAny().needsInterface('GreetServiceInterface').giveInstance(greetService1);
        warehouse.whenAny().needsInterface('GreetServiceInterface2').giveClass(HelloService);
        warehouse.whenAny().needsInterface('GreetServiceInterface3').giveClass(I18nHelloService);

        const withBindDependency = warehouse.get(WithBindDependency)
        warehouse.whenAny().needs(WithBindDependency).giveInstance(withBindDependency);

    });

    factoryCommon(warehouse);

});