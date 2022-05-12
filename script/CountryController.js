import { Country } from "./Country.js";
import { Utils } from "./Utils.js";

export class CountryController {
    static async build() {
        const data = await CountryController.getArrOfCountries();
        return new CountryController(data);
    }

    static getArrOfCountries = async () => {
        try {
            const data = await Utils.getFetchedData(
                "https://corona-api.com/countries"
            );
            console.log(data);
            //!need to find a better way than Promise.all()
            const specificData = await Promise.all(
                data.data.map(async (country) => {
                    const state = new Country(country);
                    return state;
                })
            );
            return specificData;
        } catch (err) {
            console.log(err);
        }
    };

    constructor(countriesArr) {
        this.countries = countriesArr;
    }
}
