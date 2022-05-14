import { Observable } from "./Observable.js";

/**
 * @class
 */
export class ContinentSelector {
    constructor() {
        this.allContinentsBtn = document.querySelectorAll("[data-continent]");
        this.dropdownBtn = document.querySelector(".drop-btn");
        this.selectedContinent = new Observable("Africa");
        this.addEventToAllContinents();
        this.changeSelectedContinentElement();
    }

    addEventToAllContinents = () => {
        this.allContinentsBtn.forEach((continentBtn) => {
            continentBtn.addEventListener("click", (e) => {
                this.selectedContinent.value =
                    continentBtn.getAttribute("data-continent");
                this.dropdownBtn.firstChild.textContent = "Choose Country";
            });
        });
    };

    changeSelectedContinentElement = () => {
        this.selectedContinent.addChangeListener((newSelectedContinent) => {
            document.querySelector(".selected").classList.remove("selected");
            document
                .querySelector(`[data-continent=${newSelectedContinent}]`)
                .classList.add("selected");
        });
    };
}
