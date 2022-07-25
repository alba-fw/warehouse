import {CircularService2} from "./CircularService2";
import {Injectable} from "../../src/decorators/Injectable";

@Injectable
export class CircularService1 {
    constructor(public service: CircularService2) {
    }
}