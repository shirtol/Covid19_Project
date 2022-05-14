import { Selector } from "./Selector.js";

export class CountrySelector extends Selector {
    constructor() {
        super("country", "");
        this.selectedCountry = this.selectedValue;
    }
}
