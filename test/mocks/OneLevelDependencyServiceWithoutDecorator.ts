import {NoDependencyService} from "./NoDependencyService";

export class OneLevelDependencyServiceWithoutDecorator {

    constructor(public readonly dependency1: NoDependencyService) {
    }
}