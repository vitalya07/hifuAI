
document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".hero__video");
    const playButton = document.querySelector(".hero__video-play");

    if (!video || !playButton) return;

    // Запуск видео
    playButton.addEventListener("click", async () => {
        try {
            await video.play();
        } catch (error) {
            console.error("Не удалось запустить видео:", error);
        }
    });

    // Видео начало воспроизводиться
    video.addEventListener("play", () => {
        playButton.hidden = true;
        video.controls = true;
        video.classList.add("is-playing");
    });

    // Видео поставлено на паузу
    video.addEventListener("pause", () => {
        playButton.hidden = false;
        video.classList.remove("is-playing");
    });

    // Видео закончилось
    video.addEventListener("ended", () => {
        playButton.hidden = false;
        video.classList.remove("is-playing");
        video.controls = false;
    });

    // Ошибка загрузки видео
    video.addEventListener("error", () => {
        playButton.hidden = false;
        console.error("Ошибка загрузки видео.");
    });
});
