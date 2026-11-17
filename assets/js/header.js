
document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".header__burger");
    const menu = document.querySelector(".header__menu");
    const menuLinks = document.querySelectorAll(".header__link, .header__cta");

    // Проверяем наличие элементов
    if (!burger || !menu) return;

    // Открытие меню
    function openMenu() {
        menu.hidden = false;

        // Небольшая задержка для запуска CSS-анимации
        requestAnimationFrame(() => {
            menu.classList.add("is-open");
            burger.classList.add("is-active");

            burger.setAttribute("aria-expanded", "true");
            burger.setAttribute("aria-label", "Cerrar menú");

            document.body.classList.add("no-scroll");
        });
    }

    // Закрытие меню
    function closeMenu() {
        menu.classList.remove("is-open");
        burger.classList.remove("is-active");

        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Abrir menú");

        document.body.classList.remove("no-scroll");

        // Убираем hidden после завершения анимации
        const handleTransitionEnd = (event) => {
            if (event.target !== menu || event.propertyName !== "opacity") return;

            menu.hidden = true;
            menu.removeEventListener("transitionend", handleTransitionEnd);
        };

        menu.addEventListener("transitionend", handleTransitionEnd);

        // Запасной вариант, если transitionend не сработает
        setTimeout(() => {
            if (!menu.classList.contains("is-open")) {
                menu.hidden = true;
            }

            menu.removeEventListener("transitionend", handleTransitionEnd);
        }, 500);
    }

    // Переключение меню
    function toggleMenu() {
        const isOpen = burger.classList.contains("is-active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Клик по hamburger
    burger.addEventListener("click", toggleMenu);

    // Закрытие при клике на ссылку
    menuLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !menu.hidden) {
            closeMenu();
            burger.focus();
        }
    });

    // Закрытие при клике вне меню
    menu.addEventListener("click", (event) => {
        if (event.target === menu) {
            closeMenu();
        }
    });
});
