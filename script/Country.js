import { CountryLatestData } from "./CountryLatestData.js";
import { CountryTodayData } from "./CountryTodayData.js";

export class Country {
    constructor({ name, today, latest_data }) {
        this.name = name;
        this.todayData = new CountryTodayData(today);
        this.latestData = new CountryLatestData(latest_data);
    }
}
