import { Country } from "./Country.js";
import { Utils } from "./Utils.js";

/**
 * @class
 */
export class CountryController {
    /**
     *
     * @returns {Promise<CountryController>}
     */
    static async build() {
        const continentsObj = await CountryController.getContinentsData();
        return new CountryController(continentsObj);
    }

    /**
     *
     * @returns {Promise <Country[]>}
     */
    static getArrOfCountries = async () => {
        try {
            const data = await Utils.getFetchedData(
                "https://corona-api.com/countries"
            );
            //!need to find a better way than Promise.all()
            const specificData = data.data.map(
                (country) => new Country(country)
            );

            return specificData;
        } catch (err) {
            console.log(err);
        }
    };

    /**
     *
     * @returns {Promise<{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}>}
     */

    static getContinentsData = async () => {
        try {
            const data = await Utils.getFetchedData(
                "https://cors-anywhere.herokuapp.com/https://restcountries.herokuapp.com/api/v1"
            );
            // const specificData = {};
            const countriesArr = await CountryController.getArrOfCountries();
            return data.reduce((acc, country) => {
                const currCountry = countriesArr.find(
                    (state) => state.name === country.name.common
                );
                if (currCountry !== undefined) {
                    acc[country.region] = [
                        ...(acc[country.region] || []),
                        currCountry,
                    ];
                }
                return acc;
            }, {});
        } catch (err) {
            console.log(err);
        }
    };
    /**
     *
     * @param {{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}} continentsObj
     */
    constructor(continentsObj) {
        /**
         *
         * @type {{"":Country[],Africa:Country[],Americas:Country[],Asia:Country[],Europe:Country[], Oceania:Country[]}}
         */
        this.continents = continentsObj;
    }
}
