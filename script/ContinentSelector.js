import { Selector } from "./Selector.js";

export class ContinentSelector extends Selector {
    constructor() {
        super("continent", "Africa", "Choose Country");
        this.selectedContinent = this.selectedValue;
        this.changeSelectedContinentElement();
    }

    changeSelectedContinentElement = () => {
        this.selectedValue.addChangeListener((newSelectedContinent) => {
            document.querySelector(".selected").classList.remove("selected");
            document
                .querySelector(`[data-continent=${newSelectedContinent}]`)
                .classList.add("selected");
        });
    };
}
