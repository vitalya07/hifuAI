(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successBox = form.querySelector('.contact__success');
    const errorBox   = form.querySelector('.contact__error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.hidden = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
            });
            const result = await response.json();

            if (result.ok) {
                successBox.hidden = false;
                form.reset();
            } else {
                errorBox.hidden = false;
            }
        } catch {
            errorBox.hidden = false;
        }
    });
})();
