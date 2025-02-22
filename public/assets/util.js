function updateProgress(progress) {
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    const percent = Math.round(progress * 100);
    progressBar.style.width = `${percent}%`;
    progressText.innerText = `${percent}% `;
}
