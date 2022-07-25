import {CircularService1} from "./CircularService1";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class CircularService3 {
    constructor(public service: CircularService1) {
    }
}