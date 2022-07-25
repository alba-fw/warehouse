import {CircularService3} from "./CircularService3";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class CircularService2 {
    constructor(public service: CircularService3) {
    }
}