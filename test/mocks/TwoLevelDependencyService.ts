
import {Injectable} from "../../src/decorators/Injectable";
import {OneLevelDependencyService} from "./OneLevelDependencyService";

@Injectable
export class TwoLevelDependencyService {

    constructor(public readonly dependency1: OneLevelDependencyService) {
    }
}