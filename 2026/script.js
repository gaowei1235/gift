document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".photo-track");
  const bgm = document.getElementById("bgm");
  const TOTAL = 93;

  /* ===== 照片加载 ===== */
  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    track.appendChild(img);
  }

  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    track.appendChild(img);
  }

  /* ===== 音乐启动（浏览器兜底） ===== */
  if (bgm) {
    bgm.volume = 0.4;

    const startMusic = () => {
      bgm.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);
  }
});
