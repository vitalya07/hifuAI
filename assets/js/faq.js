
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq__item");

    if (!faqItems.length) return;

    // CLOSE FAQ ITEM
    function closeItem(item) {
        const button = item.querySelector(".faq__trigger");
        const panel = item.querySelector(".faq__panel");

        if (!button || !panel) return;

        button.setAttribute("aria-expanded", "false");

        // Keep current height until next animation frame
        panel.style.maxHeight = panel.scrollHeight + "px";

        requestAnimationFrame(() => {
            panel.classList.remove("is-open");
            panel.style.maxHeight = "0px";
        });
    }

    // OPEN FAQ ITEM
    function openItem(item) {
        const button = item.querySelector(".faq__trigger");
        const panel = item.querySelector(".faq__panel");

        if (!button || !panel) return;

        button.setAttribute("aria-expanded", "true");

        panel.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
    }

    // TOGGLE FAQ
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq__trigger");

        if (!button) return;

        button.addEventListener("click", () => {
            const isOpen = button.getAttribute("aria-expanded") === "true";

            // Close all other items
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    closeItem(otherItem);
                }
            });

            // Toggle current item
            if (isOpen) {
                closeItem(item);
            } else {
                openItem(item);
            }
        });
    });

    // UPDATE HEIGHT ON WINDOW RESIZE
    window.addEventListener("resize", () => {
        faqItems.forEach((item) => {
            const button = item.querySelector(".faq__trigger");
            const panel = item.querySelector(".faq__panel");

            if (
                button &&
                panel &&
                button.getAttribute("aria-expanded") === "true"
            ) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
});
