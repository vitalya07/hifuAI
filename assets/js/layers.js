document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".layers__item");

    items.forEach((item) => {
        const trigger = item.querySelector(".layers__trigger");
        const panel = item.querySelector(".layers__panel");

        if (!trigger || !panel) return;

        trigger.addEventListener("click", () => {
            const isOpen = trigger.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                // Закрытие
                trigger.setAttribute("aria-expanded", "false");
                panel.classList.remove("is-open");
                panel.style.maxHeight = "0px";
            } else {
                // Открытие
                trigger.setAttribute("aria-expanded", "true");
                panel.classList.add("is-open");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
});