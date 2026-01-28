document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".photo-track");

  const TOTAL = 93;

  // 第一轮
  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.alt = `photo-${i}`;
    track.appendChild(img);
  }

  // 复制一轮，用于无缝滚动
  for (let i = 1; i <= TOTAL; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.alt = `photo-${i}-copy`;
    track.appendChild(img);
  }
});
