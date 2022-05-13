import { Observable } from "./Observable.js";

/**
 * @class
 */
export class ContinentSelector {
    constructor() {
        this.allContinentsBtn = document.querySelectorAll("[data-continent]");
        this.selectedContinent = new Observable("Africa");
        this.addEventToAllContinents();
    }

    addEventToAllContinents = () => {
        this.allContinentsBtn.forEach((continentBtn) => {
            continentBtn.addEventListener("click", (e) => {
                console.log(e.target);
                this.selectedContinent.value =
                    continentBtn.getAttribute("data-continent");
            });
        });
    };
}
