import { Observable } from "./Observable.js";

export class Selector {
    constructor(type, initialValue, dropDownTxt) {
        this.type = type;
        this.allBtn = document.querySelectorAll(`[data-${type}]`);
        this.dropdownBtnTxt = document.querySelector(".drop-btn");
        this.selectedValue = new Observable(initialValue);
        this.addEventToAll(dropDownTxt);
    }

    addEventToAll = (dropDownTxt) => {
        this.allBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.selectedValue.value = e.target.getAttribute(
                    `data-${this.type}`
                );
                this.dropdownBtnTxt.firstChild.textContent =
                    dropDownTxt || this.selectedValue.value;
            });
        });
    };
}
