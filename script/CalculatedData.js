export class CalculatedData {
    constructor({ death_rate, recovery_rate, cases_per_million_population }) {
        this.deathRate = death_rate;
        this.recoveryRate = recovery_rate;
        this.casesPerMillion = cases_per_million_population;
    }
}
