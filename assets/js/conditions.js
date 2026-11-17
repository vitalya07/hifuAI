
document.addEventListener("DOMContentLoaded", () => {
    const mainItems = document.querySelectorAll(".conditions__item");

    if (!mainItems.length) return;

    // UPDATE PANEL HEIGHT
    function updatePanelHeight(panel) {
        if (!panel) return;

        const parentPanel = panel.parentElement.closest(
            ".conditions__panel, .conditions__nested-panel"
        );

        if (panel.classList.contains("is-open")) {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

        // Update parent height when nested content changes
        if (parentPanel && parentPanel.classList.contains("is-open")) {
            updatePanelHeight(parentPanel);
        }
    }

    // TOGGLE ACCORDION
    function toggleAccordion(button, panel) {
        const isOpen = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!isOpen));

        if (isOpen) {
            panel.style.maxHeight = panel.scrollHeight + "px";

            requestAnimationFrame(() => {
                panel.classList.remove("is-open");
                panel.style.maxHeight = "0px";
            });
        } else {
            panel.classList.add("is-open");
            panel.style.maxHeight = panel.scrollHeight + "px";

            updatePanelHeight(panel);
        }

        // Update parent after closing nested accordion
        const parentPanel = panel.parentElement.closest(
            ".conditions__panel, .conditions__nested-panel"
        );

        if (parentPanel) {
            requestAnimationFrame(() => {
                updatePanelHeight(parentPanel);
            });
        }
    }

    // MAIN ACCORDIONS
    mainItems.forEach((item) => {
        const button = item.querySelector(".conditions__trigger");
        const panel = item.querySelector(".conditions__panel");

        if (!button || !panel) return;

        button.addEventListener("click", () => {
            toggleAccordion(button, panel);
        });

        // NESTED ACCORDIONS
        const nestedItems = item.querySelectorAll(".conditions__nested");

        nestedItems.forEach((nestedItem) => {
            const nestedButton = nestedItem.querySelector(
                ".conditions__nested-trigger"
            );

            const nestedPanel = nestedItem.querySelector(
                ".conditions__nested-panel"
            );

            if (!nestedButton || !nestedPanel) return;

            nestedButton.addEventListener("click", () => {
                toggleAccordion(nestedButton, nestedPanel);
            });
        });
    });

    // UPDATE HEIGHT AFTER RESIZE
    window.addEventListener("resize", () => {
        document.querySelectorAll(
            ".conditions__panel.is-open, .conditions__nested-panel.is-open"
        ).forEach((panel) => {
            updatePanelHeight(panel);
        });
    });

    // RECALCULATE HEIGHT AFTER TRANSITIONS
    document.querySelectorAll(".conditions__panel, .conditions__nested-panel")
        .forEach((panel) => {
            panel.addEventListener("transitionend", (event) => {
                if (event.propertyName !== "max-height") return;

                const parentPanel = panel.parentElement.closest(
                    ".conditions__panel, .conditions__nested-panel"
                );

                if (parentPanel && parentPanel.classList.contains("is-open")) {
                    updatePanelHeight(parentPanel);
                }
            });
        });
});
