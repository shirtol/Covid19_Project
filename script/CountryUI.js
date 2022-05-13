import { ContinentSelector } from "./ContinentSelector.js";

export class CountryUI {
    constructor() {
        Chart.defaults.font.size = 12;
        this.ctx = document.getElementById("chart").getContext("2d");
        this.countriesDropdownMenu = document.querySelector("#all-countries");
        this.countriesDropdownBtn = document.querySelector(".drop-btn");
        this.continentSelector = new ContinentSelector();
        this.chart = null;
    }

    getColorByCountryName = (countryName, countryIdx) => {
        const allLetters = "abcdefghijklmnopqrstuvwxyz";
        const firstLetterNum =
            allLetters.indexOf(countryName[0].toLowerCase()) * 9;

        return [firstLetterNum, 60 + countryIdx, 100 + countryIdx];
    };

    getObjOfData = (continents, continentName, condition = "critical") => {
        return continents[continentName].reduce((acc, curr) => {
            acc[curr.name] = curr.latestData[condition];
            return acc;
        }, {});
    };

    createDataset = (conditionObj, titleIdentifier, colorOffset) => {
        const dataset = {
            label: `Number of ${titleIdentifier} cases`,
            hidden: titleIdentifier !== "confirmed",
            data: Object.values(conditionObj),
            backgroundColor: (point) => {
                const countryIdx = point.index;
                const countryName = Object.keys(conditionObj)[countryIdx];
                const [r, g, b] = this.getColorByCountryName(
                    countryName,
                    countryIdx + colorOffset
                );
                return `rgba(${r},${g},${b},0.6`;
            },
            tension: 0.4,
            cubicInterpolationMode: "monotone",
        };
        return dataset;
    };

    createConditionObj = (continents, continentName) => {
        const confirmedConditionObj = this.getObjOfData(
            continents,
            continentName,
            "confirmed"
        );
        const recoveredConditionObj = this.getObjOfData(
            continents,
            continentName,
            "recovered"
        );
        const criticalConditionObj = this.getObjOfData(
            continents,
            continentName,
            "critical"
        );
        const deathsConditionObj = this.getObjOfData(
            continents,
            continentName,
            "deaths"
        );
        return [
            confirmedConditionObj,
            recoveredConditionObj,
            criticalConditionObj,
            deathsConditionObj,
        ];
    };

    drawChart = (continents, continentName) => {
        const conditionsObjectsArr = this.createConditionObj(
            continents,
            continentName
        );
        if (this.chart === null) {
            const chart = new Chart(this.ctx, {
                type: "bar",
                data: {
                    labels: Object.keys(conditionsObjectsArr[0]),
                    datasets: [
                        this.createDataset(
                            conditionsObjectsArr[0],
                            "confirmed",
                            0
                        ),
                        this.createDataset(
                            conditionsObjectsArr[1],
                            "recovered",
                            30
                        ),
                        this.createDataset(
                            conditionsObjectsArr[2],
                            "critical",
                            60
                        ),
                        this.createDataset(
                            conditionsObjectsArr[3],
                            "deaths",
                            90
                        ),
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        title: {
                            display: false,
                            text: "Chart.js Line Chart - Logarithmic",
                        },
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false,
                            },
                        },
                        y: {
                            display: true,
                            type: "logarithmic",
                            min: 0,
                            grid: {
                                display: false,
                            },
                        },
                    },
                },
            });
            this.chart = chart;
        } else {
            this.chart.data.labels = Object.keys(conditionsObjectsArr[0]);
            this.chart.data.datasets.forEach((dataset, idx) => {
                dataset.data = Object.values(conditionsObjectsArr[idx]);
            });
            this.chart.update();
        }
    };

    createDropdownCountiesElements = (continents, continentName = "Africa") => {
        while (this.countriesDropdownMenu.firstChild) {
            this.countriesDropdownMenu.removeChild(
                this.countriesDropdownMenu.firstChild
            );
        }
        continents[continentName].forEach((country) => {
            const element = document.createElement("div");
            element.textContent = `${country.name}`;
            this.countriesDropdownMenu.appendChild(element);
        });
    };
}
