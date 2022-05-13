// import { Chart } from "./chart.js";
// import { Chart } from "chart.js";
import { CountryController } from "./CountryController.js";

const countryController = await CountryController.build();

console.log(countryController);

// const myData = {
//     labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
//     datasets: [
//         {
//             label: "Car Speed (mph)",
//             data: [0, 59, 75, 20, 20, 55, 40],
//             tension: 0.4,
//             cubicInterpolationMode: "monotone",
//             fill: false,
//             borderColor: "#E64A19",
//             backgroundColor: "transparent",
//             borderDash: [20, 10, 60, 10],
//             pointBorderColor: "#E64A19",
//             pointBackgroundColor: "#FFA726",
//             pointRadius: 5,
//             pointHoverRadius: 10,
//             pointHitRadius: 30,
//             pointBorderWidth: 2,
//             pointStyle: "rectRounded",
//         },
//     ],
// };

const getColorByCountryName = (countryName) => {
    const allLetters = "abcdefghijklmnopqrstuvwxyz";
    const firstLetterNum =
        allLetters.indexOf(countryName[0].toLowerCase()) * 10;
    const secondLetterNum =
        allLetters.indexOf(countryName[1].toLowerCase()) * 10;
    const lastLetterNum =
        allLetters.indexOf(countryName[countryName.length - 1].toLowerCase()) *
        10;
    return [firstLetterNum, secondLetterNum, lastLetterNum];
};

Chart.defaults.font.size = 10;

const getObjOfData = () => {
    const dataObj = {};
    countryController.continents.Africa.forEach((country) => {
        dataObj[country.name] = country.latestData.confirmed;
    });
    // console.log(dataObj);
    return dataObj;
};

const data = getObjOfData();

const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: Object.keys(data),
        datasets: [
            {
                label: "Number of confirmed cases",
                data: Object.values(data),
                backgroundColor: (point) => {
                    const countryIdx = point.index;
                    const countryName = Object.keys(data)[countryIdx];
                    const [r, g, b] = getColorByCountryName(countryName);
                    return `rgba(${r},${g},${b},0.4`;
                },
                tension: 0.4,
                cubicInterpolationMode: "monotone",

                // borderWidth: 2,
                // borderColor: "black",
            },
        ],
    },
    option: {},
});
