import { CalculatedData } from "./CalculatedData.js";

export class CountryLatestData {
    constructor({ confirmed, deaths, recovered, critical, calculated }) {
        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.critical = critical;
        this.calculated = new CalculatedData(calculated);
    }
}
