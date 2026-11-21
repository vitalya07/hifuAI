/* ==============================
   CONTACT FORM
============================== */

(() => {
    const form = document.getElementById('contact-form');

    if (!form) return;

    const successBox = form.querySelector('.modal__success');
    const errorBox = form.querySelector('.contact__error');

    if (!successBox || !errorBox) return;

    // Начальное состояние
    successBox.classList.remove('active');
    successBox.hidden = true;
    errorBox.hidden = true;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorBox.hidden = true;

        const submitButton = form.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
            });

            const result = await response.json();

            if (response.ok && result.ok === true) {
                // Скрываем поля формы
                [...form.children].forEach((element) => {
                    if (
                        element !== successBox &&
                        element !== errorBox
                    ) {
                        element.hidden = true;
                    }
                });

                // Показываем сообщение об успехе
                successBox.hidden = false;
                successBox.classList.add('active');

                // Очищаем форму
                form.reset();

            } else {
                errorBox.hidden = false;
            }

        } catch (error) {
            errorBox.hidden = false;

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
})();