export class ChartWrapper {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId).getContext("2d");
        this.chart = null;
    }
}
