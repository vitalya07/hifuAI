
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact-form");

    if (!form) return;

    const nameInput = form.querySelector("#contact-name");
    const phoneInput = form.querySelector("#contact-phone");
    const treatmentSelect = form.querySelector("#contact-treatment");
    const privacyCheckbox = form.querySelector("#contact-privacy");

    const submitButton = form.querySelector(".contact__submit");
    const successMessage = form.querySelector(".contact__success");
    const errorMessage = form.querySelector(".contact__error");

    let isSubmitting = false;

    // УБИРАЕМ СООБЩЕНИЯ
    function hideMessages() {
        successMessage.hidden = true;
        errorMessage.hidden = true;
    }

    // ПРОВЕРКА ТЕЛЕФОНА
    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, "");

        return digits.length >= 9 && digits.length <= 15;
    }

    // ПРОВЕРКА ИМЕНИ
    function validateName(name) {
        return name.trim().length >= 2;
    }

    // ВАЛИДАЦИЯ ФОРМЫ
    function validateForm() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const treatment = treatmentSelect.value;

        if (!validateName(name)) {
            nameInput.setCustomValidity("Introduce un nombre válido.");
            nameInput.reportValidity();
            nameInput.setCustomValidity("");
            return false;
        }

        if (!validatePhone(phone)) {
            phoneInput.setCustomValidity("Introduce un número de teléfono válido.");
            phoneInput.reportValidity();
            phoneInput.setCustomValidity("");
            return false;
        }

        if (!treatment) {
            treatmentSelect.reportValidity();
            return false;
        }

        if (!privacyCheckbox.checked) {
            privacyCheckbox.setCustomValidity(
                "Debes aceptar la política de privacidad."
            );
            privacyCheckbox.reportValidity();
            privacyCheckbox.setCustomValidity("");
            return false;
        }

        return true;
    }

    // СОСТОЯНИЕ КНОПКИ
    function setLoading(isLoading) {
        isSubmitting = isLoading;
        submitButton.disabled = isLoading;

        const buttonText = submitButton.querySelector("span");

        if (buttonText) {
            buttonText.textContent = isLoading
                ? "ENVIANDO..."
                : "RESERVAR MI CITA";
        }
    }

    // ОТПРАВКА ФОРМЫ
    async function sendForm(data) {
        // ВСТАВИТЬ URL API ИЛИ WEBHOOK ЗАКАЗЧИКА
        const API_URL = "";

        if (!API_URL) {
            throw new Error("API_URL_NOT_CONFIGURED");
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("FORM_SUBMISSION_FAILED");
        }

        return response;
    }

    // META PIXEL
    function trackLead() {
        if (typeof window.fbq === "function") {
            window.fbq("track", "Lead");
        }
    }

    // ОБРАБОТКА ОТПРАВКИ
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        hideMessages();

        if (!validateForm()) return;

        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            treatment: treatmentSelect.value
        };

        setLoading(true);

        try {
            await sendForm(formData);

            successMessage.hidden = false;

            form.reset();

            trackLead();

        } catch (error) {
            console.error("Contact form error:", error);

            errorMessage.hidden = false;

        } finally {
            setLoading(false);
        }
    });

    // УБИРАЕМ ОШИБКИ ПРИ ИЗМЕНЕНИИ ПОЛЕЙ
    [nameInput, phoneInput, treatmentSelect, privacyCheckbox].forEach((field) => {
        field.addEventListener("input", hideMessages);
        field.addEventListener("change", hideMessages);
    });

});
