document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".photo-track");
  const bgm = document.getElementById("bgm");

  const TOTAL = 93;

  /* ===== 照片加载 ===== */

  // 第一轮
  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.alt = `photo-${i}`;
    track.appendChild(img);
  }

  // 复制一轮，实现无缝滚动
  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.alt = `photo-${i}-copy`;
    track.appendChild(img);
  }

  /* ===== 背景音乐兜底处理 ===== */

  if (bgm) {
    bgm.volume = 0.4; // 背景就好，不抢情绪

    // 防止浏览器阻止 autoplay
    document.addEventListener(
      "click",
      () => {
        if (bgm.paused) {
          bgm.play();
        }
      },
      { once: true }
    );
  }
});
