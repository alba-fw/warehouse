import {NoDependencyService} from "./NoDependencyService";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class OneLevelDependencyService {

    constructor(public readonly dependency1: NoDependencyService) {
    }
}