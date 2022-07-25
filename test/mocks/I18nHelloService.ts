import {Languages} from "./Languages.enum";
import {GreetService} from "./GreetService";
import {I18n} from "./I18n";
import {Injectable} from "../../src/decorators/Injectable";

/**
 * Internationalized Hello service, passing the language on the constructor.
 */
@Injectable
export class I18nHelloService extends GreetService {
    constructor(i18n:I18n, lang: Languages) {
        super(i18n.translate('Hello', lang));
    }
}