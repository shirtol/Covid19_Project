export class Utils {
    static getFetchedData = async (url) => {
        try {
            console.log("hi");
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
}
