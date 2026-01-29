document.addEventListener("DOMContentLoaded", () => {
  const wall = document.getElementById("photo-wall");
  const track = document.querySelector(".photo-track");
  const bgm = document.getElementById("bgm");
  const endContainer = document.getElementById("end-text-container");
  const typewriterText = document.getElementById("typewriter-text");
  const topBar = document.querySelector(".top-bar");

  const TOTAL_PHOTOS = 93;
  let isEnding = false;

  /* 1. 初始化照片（确保只加载一遍） */
  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const img = document.createElement("img");
    img.src = `asset/${i}.jpg`;
    img.onerror = () => (img.style.display = 'none');
    track.appendChild(img);
  }

  /* 2. 滚动控制核心（炫酷效果逻辑） */
  let currentScroll = 0;
  let targetScroll = 0;
  let autoSpeed = -2.0; // 照片移动速度
  let isDragging = false;
  let lastX = 0;

  function update() {
    if (isEnding) return;

    // 自动巡航
    if (!isDragging) {
      targetScroll += autoSpeed;
    }

    // 平滑插值 (0.08 保证了拖拽后的丝滑回弹)
    currentScroll += (targetScroll - currentScroll) * 0.08;

    // 边界检测
    if (currentScroll > 0) {
      currentScroll = 0;
      targetScroll = 0;
    }

    const limit = track.scrollWidth - window.innerWidth;
    if (currentScroll < -limit - 300) {
      startEnding();
      return;
    }

    // 仅在这里处理位移，绝不触碰音频对象
    track.style.transform = `translateX(${currentScroll}px)`;
    requestAnimationFrame(update);
  }
  update();

  /* 3. 拖拽交互 */
  const onStart = (x) => {
    if (isEnding) return;
    isDragging = true;
    lastX = x;
    const hint = document.querySelector(".drag-hint");
    if (hint) hint.classList.add("fade-out");
  };
  const onMove = (x) => {
    if (!isDragging || isEnding) return;
    targetScroll += (x - lastX) * 2;
    lastX = x;
  };
  const onEnd = () => { isDragging = false; };

  wall.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  wall.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive: true});
  window.addEventListener('touchmove', e => onMove(e.touches[0].clientX), {passive: true});
  window.addEventListener('touchend', onEnd);

  /* --- 找到 script.js 中关于音乐的部分，替换为以下逻辑 --- */
  
  const playlist = ["asset/music.mp3", "asset/music2.mp3"];
  let trackIdx = 0; // 确保初始索引是 0
  
  function playTrack() {
    bgm.pause();
    // 核心：每次播放前重新强制设置 src
    bgm.src = playlist[trackIdx];
    bgm.load(); 
    
    bgm.oncanplaythrough = () => {
      bgm.playbackRate = 1.0; 
      bgm.defaultPlaybackRate = 1.0;
      bgm.play().catch(err => console.log("播放尝试中..."));
      // 播放后清除监听，防止重复触发
      bgm.oncanplaythrough = null;
    };
  }
  
  // 监听歌曲结束，自动切下一首
  bgm.addEventListener("ended", () => {
    trackIdx = (trackIdx + 1) % playlist.length;
    playTrack();
  });
  
  // 统一启动函数
  const startMusic = () => {
    trackIdx = 0; // 再次强制从第一首开始
    bgm.volume = 0.5;
    playTrack();
    
    // 移除所有启动监听
    document.removeEventListener("click", startMusic);
    document.removeEventListener("touchstart", startMusic);
  };
  
  // 同时监听点击和触摸
  document.addEventListener("click", startMusic);
  document.addEventListener("touchstart", startMusic);

  /* 5. 结尾打字机逻辑（解决手机遮挡 & 稳定显示） */
  const fullText = `A Song for Gao Yan\n\n亲爱的高岩\n我们已经相识这么多年\n其实从来没想过\n缘分如此妙不可言\n\n时隔多年\n再次回想那一天\n那一块糖\n开启了属于我们的冒险\n\n有时亲密无间\n有时翻脸互不相见\n但兜兜转转\n我们成为彼此的心安\n\n流光易逝世事易变\n曾经少年心比天高志比海宽\n愿君今依然\n\n你说你在步入中年\n我看你生活地越来越熟练\n让我们和童年再见\n因为新的人生里没有什么不能改变\n\n希望有一天\n我们都变成老太太\n再一起过大年\n继续着没有营养的聊天\n就这么看着夕阳满天\n就像一只鸟回到了属于她的山\n那么自然`;

  function startEnding() {
    if (isEnding) return;
    isEnding = true;
    wall.style.opacity = "0";
    topBar.style.opacity = "0";

    setTimeout(() => {
      wall.style.display = "none";
      endContainer.style.display = "block"; // 配合 style.css 的 block
      setTimeout(() => {
        endContainer.style.opacity = "1";
        playTypewriter();
      }, 500);
    }, 2000);
  }

  function playTypewriter() {
    let charIndex = 0;
    function next() {
      if (charIndex < fullText.length) {
        const char = fullText[charIndex];
        if (char === "\n") {
          typewriterText.appendChild(document.createElement("br"));
        } else {
          const s = document.createElement("span");
          s.className = "char";
          s.innerText = char;
          typewriterText.appendChild(s);
        }
        charIndex++;

        // 核心修复：自动跟随滚动，解决手机遮挡
        endContainer.scrollTo({
          top: endContainer.scrollHeight,
          behavior: 'smooth'
        });

        // 停顿控制
        let d = 110;
        if (char === "，") d = 450;
        if (char === "。" || char === "\n") d = 800;
        setTimeout(next, d);
      }
    }
    next();
  }
});
