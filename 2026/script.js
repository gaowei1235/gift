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

  /* 2. 滚动控制核心变量 */
  let currentScroll = 0;   // 画面当前的位移
  let targetScroll = 0;    // 目标位移（由于拖拽或自动播放改变）
  let autoSpeed = -4.0;    // 【速度设置】负数向左跑，4.0 是较快的速度
  let isDragging = false;
  let lastX = 0;
  let maxScroll = 0;

  function getLimit() {
    maxScroll = track.scrollWidth - window.innerWidth;
    return Math.max(0, maxScroll);
  }

  /* 3. 动画主循环 */
  function update() {
    if (isEnding) return;

    // 如果没在拖拽，就一直累加自动滚动的速度
    if (!isDragging) {
      targetScroll += autoSpeed;
    }

    // 平滑插值：让 currentScroll 追赶 targetScroll，产生丝滑感
    currentScroll += (targetScroll - currentScroll) * 0.1;

    // 边界检查：左侧不越界
    if (currentScroll > 0) {
      currentScroll = 0;
      targetScroll = 0;
    }

    // 终点检查：如果滚到了最后一张图后再往后 300px
    const limit = getLimit();
    if (currentScroll < -limit - 300) {
      startEnding();
      return;
    }

    track.style.transform = `translateX(${currentScroll}px)`;
    requestAnimationFrame(update);
  }

  update();

  /* 4. 拖拽交互 */
  const onStart = (x) => {
    if (isEnding) return;
    isDragging = true;
    lastX = x;
    document.querySelector(".drag-hint").classList.add("fade-out");
  };

  const onMove = (x) => {
    if (!isDragging || isEnding) return;
    const delta = x - lastX;
    targetScroll += delta * 1.8; // 增加拖拽灵敏度
    lastX = x;
  };

  const onEnd = () => { isDragging = false; };

  wall.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  wall.addEventListener('touchstart', e => onStart(e.touches[0].clientX));
  window.addEventListener('touchmove', e => onMove(e.touches[0].clientX));
  window.addEventListener('touchend', onEnd);

  /* 5. 结尾打字机效果 */
  const finalText = `A Song for Gao Yan\n\n亲爱的高岩\n我们已经相识这么多年\n其实从来没想过\n缘分如此妙不可言\n\n时隔多年\n再次回想那一天\n那一块糖\n开启了属于我们的冒险\n\n有时紧密无间\n有时翻脸互不相见\n但兜兜转转\n我们成为彼此的心安\n\n流光易逝世事易变\n曾经少年心比天高志比海宽\n愿君今依然\n\n你说你在步入中年\n我看你生活地越来越熟练\n让我们和童年再见\n因为新的人生里没有什么不能改变\n\n希望有一天\n我们都变成老太太\n再一起过大年\n继续着没有营养的聊天\n就这么看着夕阳满天\n就像一只鸟回到了属于她的山\n那么自然`;

  function startEnding() {
    isEnding = true;
    wall.classList.add("fade-out");
    topBar.classList.add("fade-out");

    setTimeout(() => {
      wall.style.display = "none";
      endContainer.style.display = "flex";
      setTimeout(() => {
        endContainer.style.opacity = "1";
        playTypewriter();
      }, 100);
    }, 2000);
  }

  function playTypewriter() {
    let charIndex = 0;
    function nextChar() {
      if (charIndex < finalText.length) {
        const char = finalText[charIndex];
        if (char === "\n") {
          typewriterText.innerHTML += "<br/>";
        } else {
          const span = document.createElement("span");
          span.className = "char";
          span.innerText = char;
          typewriterText.appendChild(span);
        }
        charIndex++;
        // 根据符号调整停顿
        let delay = 120;
        if (/[，。\n]/.test(char)) delay = 600;
        setTimeout(nextChar, delay);
      }
    }
    nextChar();
  }

  /* 6. 音乐启动 */
  const startMusic = () => {
    bgm.play().catch(() => {});
    bgm.volume = 0.5;
    document.removeEventListener("click", startMusic);
  };
  document.addEventListener("click", startMusic);
});
