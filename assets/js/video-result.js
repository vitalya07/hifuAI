
document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".video-results__slider");
    const track = document.querySelector(".video-results__track");

    if (!slider || !track) return;

    const videos = slider.querySelectorAll(".video-results__video");

    // Сброс видео
    function resetVideo(video) {
        const wrapper = video.closest(".video-results__video-wrapper");
        const playButton = wrapper?.querySelector(".video-results__play");

        video.pause();
        video.currentTime = 0;
        video.controls = false;
        video.classList.remove("is-playing");

        if (playButton) {
            playButton.hidden = false;
        }
    }

    // Остановка всех видео
    function stopAllVideos(exceptVideo = null) {
        videos.forEach(video => {
            if (video !== exceptVideo && !video.paused) {
                resetVideo(video);
            }
        });
    }

    videos.forEach(video => {

        const wrapper = video.closest(".video-results__video-wrapper");
        const playButton = wrapper?.querySelector(".video-results__play");

        if (!playButton) return;

        // Запуск видео
        playButton.addEventListener("click", async () => {

            stopAllVideos(video);

            try {
                await video.play();
            } catch (error) {
                console.error("Не удалось запустить видео:", error);
            }

        });

        // Видео начало воспроизводиться
        video.addEventListener("play", () => {

            stopAllVideos(video);

            playButton.hidden = true;
            video.controls = true;
            video.classList.add("is-playing");

        });

        // Видео поставлено на паузу
        video.addEventListener("pause", () => {

            if (!video.ended) {
                playButton.hidden = false;
                video.classList.remove("is-playing");
            }

        });

        // Видео закончилось
        video.addEventListener("ended", () => {

            playButton.hidden = false;
            video.controls = false;
            video.classList.remove("is-playing");

        });

        // Ошибка загрузки
        video.addEventListener("error", () => {

            playButton.hidden = false;
            video.controls = false;
            video.classList.remove("is-playing");

            console.error("Ошибка загрузки видео:", video.currentSrc);

        });

    });

    // Остановка видео при переключении слайдов
    const observer = new MutationObserver(() => {
        stopAllVideos();
    });

    observer.observe(track, {
        attributes: true,
        attributeFilter: ["style"]
    });

    // Остановка видео при закрытии страницы не требуется:
    // браузер сам управляет воспроизведением при выгрузке документа.

});
