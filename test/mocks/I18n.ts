import {Languages} from "./Languages.enum";

export class I18n {

    translate(key: string, lang: Languages): string {
        const translations: {[lang: string]: {[key: string]: string}} = {
            [Languages.en]: {
                'Hello': 'Hello',
                'Hi': 'Hi',
            },
            [Languages.pt]: {
                'Hello': 'Olá',
                'Hi': 'Oi',
            }
        };

        return translations[lang][key];
    }
}