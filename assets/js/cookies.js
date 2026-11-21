
document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector("#cookies-banner");
    const acceptButton = document.querySelector("#cookies-accept");
    const rejectButton = document.querySelector("#cookies-reject");

    const storageKey = "sculptlinea-cookies";

    function lockPage() {
        document.documentElement.classList.add("cookies-locked");
        document.body.classList.add("cookies-locked");
    }

    function unlockPage() {
        document.documentElement.classList.remove("cookies-locked");
        document.body.classList.remove("cookies-locked");
    }

    function closeBanner(choice) {
        localStorage.setItem(storageKey, choice);

        banner.classList.add("hidden");
        unlockPage();
    }

    const savedChoice = localStorage.getItem(storageKey);

    if (!savedChoice) {
        banner.classList.remove("hidden");
        lockPage();
    } else {
        banner.classList.add("hidden");
        unlockPage();
    }

    acceptButton.addEventListener("click", () => {
        closeBanner("accepted");
    });

    rejectButton.addEventListener("click", () => {
        closeBanner("rejected");
    });
});
