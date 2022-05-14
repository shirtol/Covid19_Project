export class Utils {
    static getFetchedData = async (url) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data;
        } catch (err) {
            document.querySelectorAll("canvas").forEach((canvas) => {
                canvas.classList.remove("card");
            });
            document.querySelector(".error-msg-container").style.display =
                "flex";
            console.error(err);
        }
    };

    static getColorByCountryName = (countryName, countryIdx) => {
        const allLetters = "abcdefghijklmnopqrstuvwxyz";
        const firstLetterNum =
            allLetters.indexOf(countryName[0].toLowerCase()) * 9;

        return [firstLetterNum, 60 + countryIdx, 100 + countryIdx];
    };
}
