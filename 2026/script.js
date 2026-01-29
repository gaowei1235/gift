document.addEventListener("DOMContentLoaded", () => {
  const wall = document.getElementById("photo-wall");
  const track = document.querySelector(".photo-track");
  const bgm = document.getElementById("bgm");
  const endContainer = document.getElementById("end-text-container");
  const typewriterText = document.getElementById("typewriter-text");
  const topBar = document.querySelector(".top-bar");

  const TOTAL_PHOTOS = 93;
  let isEnding = false;

  /* 1. 初始化照片 */
  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.onerror = () => img.style.display = 'none';
    track.appendChild(img);
  }

  /* 2. 滚动控制 */
  let currentScroll = 0;
  let targetScroll = 0;
  let autoSpeed = -2; // 稍微再快一点
  let isDragging = false;
  let lastX = 0;
  let maxScroll = 0;

  function getLimit() {
    maxScroll = track.scrollWidth - window.innerWidth;
    return Math.max(0, maxScroll);
  }

  function update() {
    if (isEnding) return;
    if (!isDragging) { targetScroll += autoSpeed; }
    currentScroll += (targetScroll - currentScroll) * 0.1;
    if (currentScroll > 0) { currentScroll = 0; targetScroll = 0; }
    const limit = getLimit();
    if (currentScroll < -limit - 300) { startEnding(); return; }
    track.style.transform = `translateX(${currentScroll}px)`;
    requestAnimationFrame(update);
  }
  update();

  /* 3. 交互事件 */
  const onStart = (x) => {
    if (isEnding) return;
    isDragging = true;
    lastX = x;
    document.querySelector(".drag-hint").classList.add("fade-out");
  };
  const onMove = (x) => {
    if (!isDragging || isEnding) return;
    targetScroll += (x - lastX) * 1.8;
    lastX = x;
  };
  const onEnd = () => { isDragging = false; };

  wall.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  wall.addEventListener('touchstart', e => onStart(e.touches[0].clientX));
  window.addEventListener('touchmove', e => onMove(e.touches[0].clientX));
  window.addEventListener('touchend', onEnd);

  /* 4. 音乐列表循环逻辑 */
  const playlist = ["asset/music.mp3", "asset/music2.mp3"];
  let currentTrackIndex = 0;

  bgm.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    bgm.src = playlist[currentTrackIndex];
    bgm.play();
  });

  const startMusic = () => {
    bgm.play().catch(() => {});
    bgm.volume = 0.5;
    document.removeEventListener("click", startMusic);
  };
  document.addEventListener("click", startMusic);

  /* 5. 结尾打字机逻辑 (优化稳定性) */
  const finalText = `A Song for Gao Yan\n\n亲爱的高岩\n我们已经相识这么多年\n其实从来没想过\n缘分如此妙不可言\n\n时隔多年\n再次回想那一天\n那一块糖\n开启了属于我们的冒险\n\n有时紧密无间\n有时翻脸互不相见\n但兜兜转转\n我们成为彼此的心安\n\n流光易逝世事易变\n曾经少年心比天高志比海宽\n愿君今依然\n\n你说你在步入中年\n我看你生活地越来越熟练\n让我们和童年再见\n因为新的人生里没有什么不能改变\n\n希望有一天\n我们都变成老太太\n再一起过大年\n继续着没有营养的聊天\n就这么看着夕阳满天\n就像一只鸟回到了属于她的山\n那么自然`;

  function startEnding() {
    if (isEnding) return;
    isEnding = true;
    wall.classList.add("fade-out");
    topBar.classList.add("fade-out");

    setTimeout(() => {
      wall.style.display = "none";
      endContainer.style.display = "flex";
      setTimeout(() => {
        endContainer.style.opacity = "1";
        playTypewriter();
      }, 500);
    }, 2000);
  }

  function playTypewriter() {
    let charIndex = 0;
    // 使用 requestAnimationFrame 或更稳健的 setTimeout 逻辑
    function nextChar() {
      if (charIndex < finalText.length) {
        const char = finalText[charIndex];
        if (char === "\n") {
          const br = document.createElement("br");
          typewriterText.appendChild(br);
        } else {
          const span = document.createElement("span");
          span.className = "char";
          span.innerText = char;
          typewriterText.appendChild(span);
        }
        charIndex++;
        
        // 节奏感控制
        let delay = 100; // 基础速度
        if (char === "，") delay = 500;
        if (char === "。" || char === "\n") delay = 800;
        
        setTimeout(nextChar, delay);
      }
    }
    nextChar();
  }
});
