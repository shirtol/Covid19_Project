import { ContinentSelector } from "./ContinentSelector.js";

export class CountryUI {
    constructor() {
        Chart.defaults.font.size = 10;
        this.ctx = document.getElementById("myChart").getContext("2d");
        this.continentSelector = new ContinentSelector();
        this.chart = null;
    }

    getColorByCountryName = (countryName) => {
        const allLetters = "abcdefghijklmnopqrstuvwxyz";
        const firstLetterNum =
            allLetters.indexOf(countryName[0].toLowerCase()) * 10;
        const secondLetterNum =
            allLetters.indexOf(countryName[1].toLowerCase()) * 10;
        const lastLetterNum =
            allLetters.indexOf(
                countryName[countryName.length - 1].toLowerCase()
            ) * 10;
        return [firstLetterNum, secondLetterNum, lastLetterNum];
    };

    getObjOfData = (continents, continentName, chosenData = "critical") => {
        const dataObj = {};
        continents[continentName].forEach((country) => {
            dataObj[country.name] = country.latestData[chosenData];
        });
        return dataObj;
    };

    drawChart = (chosenData) => {
        if (this.chart === null) {
            const myChart = new Chart(this.ctx, {
                type: "bar",
                data: {
                    labels: Object.keys(chosenData),
                    datasets: [
                        {
                            label: "Number of confirmed cases",
                            data: Object.values(chosenData),
                            backgroundColor: (point) => {
                                const countryIdx = point.index;
                                const countryName =
                                    Object.keys(chosenData)[countryIdx];
                                const [r, g, b] =
                                    this.getColorByCountryName(countryName);
                                return `rgba(${r},${g},${b},0.4`;
                            },
                            tension: 0.4,
                            cubicInterpolationMode: "monotone",
                        },
                    ],
                },
                options: {
                    responsive: true,
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
            this.chart = myChart;
        } else {
            this.chart.data.labels = Object.keys(chosenData);
            this.chart.data.datasets[0].data = Object.values(chosenData);
            this.chart.update();
        }
    };

    createChart = (continents, continentName, chosenData) => {
        const data = this.getObjOfData(continents, continentName, chosenData);
        this.drawChart(data);
    };
}
