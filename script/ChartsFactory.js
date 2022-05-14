import { ChartWrapper } from "./ChartWrapper.js";
import { Utils } from "./Utils.js";

export class ChartsFactory {
    constructor() {
        Chart.defaults.font.size = 12;
        this.continentChart = new ChartWrapper("chart");
        this.latestDataChart = new ChartWrapper("latest-data");
        this.todayDataChart = new ChartWrapper("today-data");
        this.radarDataChart = new ChartWrapper("radar-chart");
    }

    getObjOfData = (continents, continentName, condition = "critical") => {
        return continents[continentName].reduce((acc, curr) => {
            acc[curr.name] = curr.latestData[condition];
            return acc;
        }, {});
    };

    createConditionObj = (continents, continentName) => {
        return [
            this.getObjOfData(continents, continentName, "confirmed"),
            this.getObjOfData(continents, continentName, "recovered"),
            this.getObjOfData(continents, continentName, "critical"),
            this.getObjOfData(continents, continentName, "deaths"),
        ];
    };

    /**
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

    getSortedDataObj = (dataObj) => {
        const sortedKeys = Object.keys(dataObj)
            .filter((key) => key !== "calculated")
            .sort();
        const sortedVals = [];
        Object.entries(dataObj).forEach((condition) => {
            sortedVals[sortedKeys.indexOf(condition[0])] = condition[1];
        });
        return { keys: sortedKeys, vals: sortedVals };
    };

    orderCountryObject = (continents, continentName, countryName) => {
        const [latestDataObj, todayDataObj] = this.getObjOfCountryData(
            continents,
            continentName,
            countryName
        );
        return [
            this.getSortedDataObj(latestDataObj),
            this.getSortedDataObj(todayDataObj),
        ];
    };

    createDataset = (conditionObj, titleIdentifier, colorOffset) => {
        return {
            label: `Number of ${titleIdentifier} cases`,
            hidden: titleIdentifier !== "confirmed",
            data: Object.values(conditionObj),
            backgroundColor: (point) => {
                const countryIdx = point.index;
                const countryName = Object.keys(conditionObj)[countryIdx];
                const [r, g, b] = Utils.getColorByCountryName(
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
        if (this.continentChart.chart === null) {
            const chart = new Chart(this.continentChart.canvas, {
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
            this.continentChart.chart = chart;
        } else {
            this.continentChart.chart.data.labels = Object.keys(
                conditionsObjectsArr[0]
            );
            this.continentChart.chart.data.datasets.forEach((dataset, idx) => {
                dataset.data = Object.values(conditionsObjectsArr[idx]);
            });
            this.continentChart.chart.update();
        }
    };

    /**
     * @description latest data
     * @param {string}  countryName
     * @param {*} continents
     * @param {string} continentName
     * @returns {Object}
     */
    createDatasetPerCountry = (
        countryName,
        continents,
        continentName,
        dataIdx
    ) => {
        return {
            data: this.orderCountryObject(
                continents,
                continentName,
                countryName
            )[dataIdx].vals,
            backgroundColor: [
                "#577F998a",
                "#CE9AB38a",
                "#8248598a",
                "#6f98b38a",
            ],
        };
    };

    drawCountryChart = (
        countryName,
        continents,
        continentName,
        dataIdx,
        chartWrapper
    ) => {
        if (chartWrapper.chart === null) {
            const chart = new Chart(chartWrapper.canvas, {
                type: "polarArea",
                data: {
                    labels: this.orderCountryObject(
                        continents,
                        continentName,
                        countryName
                    )[dataIdx].keys,
                    datasets: [
                        this.createDatasetPerCountry(
                            countryName,
                            continents,
                            continentName,
                            dataIdx
                        ),
                    ],
                    hoverOffset: 4,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: countryName,
                        },
                        legend: {
                            labels: {
                                generateLabels: (chart) => {
                                    const datasets = chart.data.datasets;
                                    return datasets[0].data.map((data, i) => ({
                                        text: `${chart.data.labels[i]} - ${data}`,
                                        fillStyle:
                                            datasets[0].backgroundColor[i],
                                    }));
                                },
                            },
                        },
                    },
                    scales: {
                        r: {
                            grid: {
                                color: "#3333334a",
                            },
                        },
                    },
                },
            });
            chartWrapper.chart = chart;
        } else {
            chartWrapper.chart.data.datasets = [
                this.createDatasetPerCountry(
                    countryName,
                    continents,
                    continentName,
                    dataIdx
                ),
            ];
            chartWrapper.chart.options.plugins.title.text = countryName;
            chartWrapper.chart.update();
        }
    };

    getObjOfCountryLatestCalculatedData = (
        continents,
        continentName,
        countryName
    ) => {
        const country = continents[continentName].find(
            (country) => country.name === countryName
        );
        return country.latestData.calculated;
    };

    createDatasetForRadarChart = (dataObj, countryName) => {
        return {
            label: countryName,
            data: this.getSortedDataObj(dataObj).vals,
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
        };
    };

    drawRadarChart = (dataObj, countryName) => {
        if (this.radarDataChart.chart === null) {
            const chart = new Chart(this.radarDataChart.canvas, {
                type: "radar",
                data: {
                    labels: this.getSortedDataObj(dataObj).keys,
                    datasets: [
                        this.createDatasetForRadarChart(dataObj, countryName),
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: countryName,
                        },
                    },
                    scales: {
                        r: {
                            grid: {
                                color: "#3333334a",
                            },
                        },
                    },
                },
            });
            this.radarDataChart.chart = chart;
        } else {
            this.radarDataChart.chart.data.datasets = [
                this.createDatasetForRadarChart(dataObj, countryName),
            ];
            this.radarDataChart.chart.options.plugins.title.text = countryName;
            this.radarDataChart.chart.update();
        }
    };
}
