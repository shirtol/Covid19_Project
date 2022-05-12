export class CountryLatestData {
    constructor({ confirmed, deaths, recovered, critical }) {
        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.critical = critical;
    }
}
