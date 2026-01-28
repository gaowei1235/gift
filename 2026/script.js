document.addEventListener("DOMContentLoaded", () => {
  const wall = document.getElementById("photo-wall");
  const track = document.querySelector(".photo-track");
  const bgm = document.getElementById("bgm");
  const endContainer = document.getElementById("end-text-container");
  const typewriterText = document.getElementById("typewriter-text");
  const topBar = document.querySelector(".top-bar");
  const dragHint = document.querySelector(".drag-hint");

  const TOTAL_PHOTOS = 93;
  let isEnding = false;

  /* ===== 1. 加载照片 (保持不变) ===== */
  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.onerror = () => { img.src = 'https://via.placeholder.com/300x400?text=Photo+Missing'; };
    track.appendChild(img);
  }

  /* ===== 2. 核心滚动逻辑：自动播放 + 手动拖拽 ===== */
  let currentScroll = 0;   // 实际显示的偏移量
  let targetScroll = 0;    // 目标偏移量
  let autoSpeed = -3.5;    // 【速度调整】负数代表向左移动。3.5 左右速度较快且丝滑
  let isDragging = false;
  let lastX = 0;
  let maxScroll = 0;

  function calculateMaxScroll() {
      // 轨道总宽度 - 屏幕宽度 + 预留的一段空白
      maxScroll = track.scrollWidth - window.innerWidth;
      maxScroll = Math.max(0, maxScroll);
  }

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  function animate() {
    if (isEnding) return;

    if (!isDragging) {
      // 【自动播放】如果没有拖拽，目标位置不断累加自动速度
      targetScroll += autoSpeed;
    }

    // 平滑插值
    currentScroll = lerp(currentScroll, targetScroll, 0.08);

    // 边界限制：不能滑过最左侧
    if (currentScroll > 0) {
        currentScroll = 0;
        targetScroll = 0;
    }

    // 检查是否到达终点
    if (!maxScroll) calculateMaxScroll();
    
    // 当滚动到最后一张照片再往后一段距离时触发
    if (currentScroll < -maxScroll - 200) {
        startEndingSequence();
        return; 
    }

    track.style.transform = `translate3d(${currentScroll}px, 0, 0)`;
    requestAnimationFrame(animate);
  }

  animate();

  /* ===== 3. 拖拽交互 ===== */
  const handleStart = (x) => {
    if (isEnding) return;
    isDragging = true;
    lastX = x;
    wall.classList.add("grabbing-cursor");
    dragHint.classList.add("fade-out");
    calculateMaxScroll();
  };

  const handleMove = (x) => {
    if (!isDragging || isEnding) return;
    const delta = x - lastX;
    // 拖拽时直接修改 targetScroll
    targetScroll += delta * 1.5; 
    lastX = x;
  };

  const handleEnd = () => {
    isDragging = false;
    wall.classList.remove("grabbing-cursor");
  };

  wall.addEventListener('mousedown', (e) => handleStart(e.clientX));
  window.addEventListener('mousemove', (e) => handleMove(e.clientX));
  window.addEventListener('mouseup', handleEnd);
  wall.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', handleEnd);

  /* ===== 4. 结尾打字机逻辑 (保持不变) ===== */
  function startEndingSequence() {
      if (isEnding) return;
      isEnding = true;
      wall.style.opacity = '0';
      topBar.classList.add('fade-out');

      setTimeout(() => {
          wall.style.display = 'none';
          endContainer.style.display = 'flex';
          endContainer.offsetHeight;
          endContainer.style.opacity = '1';
          typeWriter(finalText, typewriterText, 150);
      }, 1500);
  }

  const finalText = `A Song for Gao Yan\n\n亲爱的高岩\n我们已经相识这么多年\n其实从来没想过\n缘分如此妙不可言\n\n时隔多年\n再次回想那一天\n那一块糖\n开启了属于我们的冒险\n\n有时紧密无间\n有时翻脸互不相见\n但兜兜转转\n我们成为彼此的心安\n\n流光易逝世事易变\n曾经少年心比天高志比海宽\n愿君今依然\n\n你说你在步入中年\n我看你生活地越来越熟练\n让我们和童年再见\n因为新的人生里没有什么不能改变\n\n希望有一天\n我们都变成老太太\n再一起过大年\n继续着没有营养的聊天\n就这么看着夕阳满天\n就像一只鸟回到了属于她的山\n那么自然`;

  function typeWriter(text, element, speed) {
    let i = 0;
    element.innerHTML = "";
    function type() {
      if (i < text.length) {
        if (text.charAt(i) === '\n') {
            element.innerHTML += '<br/>';
        } else {
            const charSpan = document.createElement('span');
            charSpan.textContent = text.charAt(i);
            charSpan.style.animation = "fadeChar 0.8s forwards";
            element.appendChild(charSpan);
        }
        i++;
        let dynamicSpeed = speed;
        if (/[\n，。]/.test(text.charAt(i-1))) dynamicSpeed = speed * 3;
        setTimeout(type, dynamicSpeed);
      }
    }
    type();
  }

  // 辅助样式：打字机文字淡入
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeChar {
        from { opacity: 0; transform: translateY(10px) scale(0.9); filter: blur(5px); }
        to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    #typewriter-text span { display: inline-block; opacity: 0; }
  `;
  document.head.appendChild(style);

  /* ===== 5. 音乐启动 ===== */
  if (bgm) {
    bgm.volume = 0.4;
    const startMusic = () => {
      bgm.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };
    document.addEventListener("click", startMusic);
  }
});
