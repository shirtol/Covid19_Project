export class ChartsFactory {
    constructor() {
        this.chart = null;
        this.countryChart = null;
        Chart.defaults.font.size = 12;
        this.continentsChartContext = document
            .getElementById("chart")
            .getContext("2d");
        this.countriesChartContext = document
            .getElementById("polar-area")
            .getContext("2d");
    }

    //! Move to utils.js
    getColorByCountryName = (countryName, countryIdx) => {
        const allLetters = "abcdefghijklmnopqrstuvwxyz";
        const firstLetterNum =
            allLetters.indexOf(countryName[0].toLowerCase()) * 9;

        return [firstLetterNum, 60 + countryIdx, 100 + countryIdx];
    };

    //! move to continents.js
    getObjOfData = (continents, continentName, condition = "critical") => {
        return continents[continentName].reduce((acc, curr) => {
            acc[curr.name] = curr.latestData[condition];
            return acc;
        }, {});
    };

    //! don't need to save all objects in variable , just return them in array
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

    /**
     *!!REFACTORINGGG
     * @param {*} continents
     * @param {string} continentName
     * @param {string} countryName
     * @returns {Object[]}
     */
    getObjOfCountryData = (continents, continentName, countryName) => {
        const country = continents[continentName].find(
            (country) => country.name === countryName
        );
        return [country.latestData, country.todayData];
    };

    createDataset = (conditionObj, titleIdentifier, colorOffset) => {
        return {
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
            cubicInterpolationMode: "monotone",
        };
    };

    drawContinentsChart = (continents, continentName) => {
        const conditionsObjectsArr = this.createConditionObj(
            continents,
            continentName
        );
        if (this.chart === null) {
            const chart = new Chart(this.continentsChartContext, {
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
                            grid: {
                                display: false,
                            },
                        },
                        y: {
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
            console.log(this.chart);
        } else {
            this.chart.data.labels = Object.keys(conditionsObjectsArr[0]);
            this.chart.data.datasets.forEach((dataset, idx) => {
                dataset.data = Object.values(conditionsObjectsArr[idx]);
            });
            this.chart.update();
        }
    };

    /**
     * @description latest data
     * @param {string}  countryName
     * @param {*} continents
     * @param {string} continentName
     * @returns {Object}
     */
    createDatasetPerCountry = (countryName, continents, continentName) => {
        const dataset = {
            label: countryName,
            data: Object.values(
                this.getObjOfCountryData(
                    continents,
                    continentName,
                    countryName
                )[0]
            ),
            backgroundColor: ["#577F99", "#CE9AB3", "#824859", "#6f98b3"],
        };
        return dataset;
    };

    drawCountryChart = (countryName, continents, continentName) => {
        if (this.countryChart === null) {
            const chart = new Chart(this.countriesChartContext, {
                type: "polarArea",
                data: {
                    labels: ["confirmed", "critical", "deaths", "recovered"],
                    datasets: [
                        this.createDatasetPerCountry(
                            countryName,
                            continents,
                            continentName
                        ),
                    ],
                    hoverOffset: 4,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
            this.countryChart = chart;
        } else {
            this.countryChart.data.datasets = [
                this.createDatasetPerCountry(
                    countryName,
                    continents,
                    continentName
                ),
            ];
            this.countryChart.update();
        }
    };
}
