
document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".treatment__video");
    const playButton = document.querySelector(".treatment__video-play");

    if (!video || !playButton) return;

    playButton.addEventListener("click", () => {
        video.play()
            .then(() => {
                playButton.hidden = true;
                video.controls = true;
            })
            .catch((error) => {
                console.error("Не удалось запустить видео:", error);
            });
    });

    video.addEventListener("pause", () => {
        if (!video.ended) {
            playButton.hidden = false;
        }
    });

    video.addEventListener("ended", () => {
        playButton.hidden = false;
        video.controls = false;
    });
});
