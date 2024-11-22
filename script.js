document.addEventListener("DOMContentLoaded", () => { 
    const startBtn = document.getElementById("start-btn");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const messages = document.getElementById("messages");
    const photoGallery = document.getElementById("photo-gallery");
    const finalMessage = document.getElementById("final-message");
    const welcomeMusic = document.getElementById("welcome-music");
    const galleryMusic = document.getElementById("gallery-music");
    
    const question1 = "猜猜里面是什么？ 1. 生活不顺、心理扭曲的反社会人安放的炸弹 2. 来自同学（not朋友）的神秘🎁";
    const correctAnswer1 = "2";
    const question2 = "打开神秘🎁需要验证身份，现在开始身份认证。请回答，今年是我们认识几周年？";
    const correctAnswer2 = "11";
    const question3 = "不错不错，你是老驴，猜猜我想说啥？";
    const correctAnswer3 = "祝老驴生日快乐";
    
    let currentQuestion = 1;
    let incorrectAttempts = 0;

    const photos = Array.from({ length: 29 }, (_, i) => `assets/photo${i + 1}.jpg`);
    let currentPhotoIndex = 0;

    // 点击开始按钮，显示聊天框并发送第一个问题
    startBtn.addEventListener("click", () => {
        chatBox.classList.remove("hidden");
        chatBox.classList.add("visible");
        startBtn.classList.add("hidden");
        welcomeMusic.play();
        sendMessage(question1, "bot-chat");
    });

    // 发送消息按钮
    sendBtn.addEventListener("click", () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(`老驴: ${message}`, "user-chat");

            if (currentQuestion === 1) {
                if (message.includes(correctAnswer1)) {
                    currentQuestion = 2;
                    sendMessage(question2, "bot-chat");
                } else {
                    explodePage();
                }
            } else if (currentQuestion === 2) {
                if (message.includes(correctAnswer2)) {
                    currentQuestion = 3;
                    sendMessage(question3, "bot-chat");
                } else {
                    handleFailedIdentityVerification();
                }
            } else if (currentQuestion === 3) {
                if (message.includes(correctAnswer3)) {
                    transitionToPhotoGallery();
                } else {
                    handleFailedGuess();
                }
            }

            userInput.value = "";
        }
    });

    function sendMessage(text, senderClass) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = text;
        messageDiv.classList.add("chat-bubble", senderClass);
        messages.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function transitionToPhotoGallery() {
        chatBox.classList.add("hidden");
        photoGallery.classList.remove("hidden");
        photoGallery.classList.add("active");

        welcomeMusic.pause();
        welcomeMusic.currentTime = 0;
        galleryMusic.play();

        displayPhoto(currentPhotoIndex);

        let photoCount = 0;  // Tracking photo loop
        const photoInterval = setInterval(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            displayPhoto(currentPhotoIndex);
            photoCount++;
            if (photoCount === photos.length) {
                clearInterval(photoInterval);  // Stop after all photos are displayed
                transitionToFinalMessage();
            }
        }, 3000);
    }

    function displayPhoto(index) {
        photoGallery.innerHTML = "";
        const img = document.createElement("img");
        img.src = photos[index];
        img.alt = `Photo ${index + 1}`;
        photoGallery.appendChild(img);
        img.classList.add("show");
    }

    function transitionToFinalMessage() {
        // 清空照片内容并隐藏照片区域
        photoGallery.innerHTML = "";
        photoGallery.classList.add("hidden");
    
        // 显示最终消息区域并设置背景和布局
        finalMessage.style.backgroundColor = "#ffc0cb"; // 粉红色背景
        finalMessage.style.position = "fixed"; // 背景覆盖全屏
        finalMessage.style.top = "0";
        finalMessage.style.left = "0";
        finalMessage.style.width = "100vw";
        finalMessage.style.height = "100vh";
        finalMessage.style.display = "flex";
        finalMessage.style.justifyContent = "center";
        finalMessage.style.alignItems = "center";
    
        finalMessage.classList.remove("hidden");
        finalMessage.classList.add("active");
    
        // 停止画廊音乐并播放最终音乐
        galleryMusic.pause();
        const finalMusic = document.getElementById("final-music");
        finalMusic.play();
    
        // 显示打字效果
        displayTypingEffect();
    }
    
    
    
    function displayTypingEffect() {
        const message = `亲爱的高岩：
    见字如面（虽然不知道我能忍耐到哪一天才发给你，也不知道我们是否已经见过面。）就在刚刚，你对我买的礼物表示无语。我想表示，你真是一个肤浅的家伙！
    
    虽然不知道你什么感受，但是我相当满意。为了弄这个，我翻阅了我们的各大朋友圈和空间，图片越选越多，才发现10多年的历史原来真的很厚。时间弹指而过，我们度过了关键的每一年，又将迎来崭新的关键一年，在此我想说：是的，活着就好。
    
    当我对所有的事情都厌倦的时候，我就会想到你。想到你在世界的某个地方生活着，存在着，我就愿意忍受一切。你的存在对我而言很重要。
    
    是不是想说写得太好了？废话，当然是抄的。虽然忍受不了一切，但希望我们能一直自由地生活下去，随心所欲，不被束缚。
    
    23岁，这个数字看的我心惊肉跳，又逐渐地平和，想到就这样能一年一年的一起生活下去，我更期待看到80岁的年纪。
    
    23岁的高岩生日快乐，在这里我携全体高岩向你祝贺，祝贺你向自己想要成为的人、想要做的事、想要抵达的地方更近了一步。虽然这是一个不再那么轻松幸福的时代，但已经足够幸运。
    
    不知道要说什么了，天天发微信还得写封信，如果你看到这里了，就约个下次见面的时间吧（然后禁止一直拖下去！）。
    
    From 相信永远的高玮`; // 右对齐需要特殊处理
    
        let index = 0;
    
        // 清空容器内容
        finalMessage.innerHTML = `<div class="typing-container"></div>`;
        const typingContainer = finalMessage.querySelector(".typing-container");
    
        // 样式设置
        typingContainer.style.fontSize = "1.2em";
        typingContainer.style.color = "white";
        typingContainer.style.fontFamily = "Courier New, Courier, monospace";
        typingContainer.style.whiteSpace = "pre-line"; // 保留换行和缩进格式
        typingContainer.style.textAlign = "left"; // 强制左对齐
        typingContainer.style.overflowY = "auto"; // 启用滚动条
        typingContainer.style.height = "100%"; // 确保内容超出时可滚动
    
        // 打字效果
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                typingContainer.innerText += message[index]; // 按字符添加
                index++;
    
                // 自动滚动到底部
                typingContainer.scrollTop = typingContainer.scrollHeight;
            } else {
                clearInterval(typingInterval); // 打字完成后保持文字显示
            }
        }, 100); // 调整此值改变打字速度
    }
        
        
    function explodePage() {
        document.body.classList.add("explode");
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    function handleFailedIdentityVerification() {
        incorrectAttempts++;
        if (incorrectAttempts === 1) {
            sendMessage("故意选错的人是老驴", "bot-chat");
        } else if (incorrectAttempts === 2) {
            sendMessage("你还上瘾了？好好做！", "bot-chat");
        } else if (incorrectAttempts === 3) {
            sendMessage("你谁啊你？？是萝卜人老驴吗？再给你最后一次机会", "bot-chat");
        } else {
            explodePage();
        }
    }

    function handleFailedGuess() {
        incorrectAttempts++;
        if (incorrectAttempts === 1) {
            sendMessage("啧啧，没有默契啊", "bot-chat");
        } else if (incorrectAttempts === 2) {
            sendMessage("给你点提示？", "bot-chat");
        } else if (incorrectAttempts === 3) {
            sendMessage("行了行了，提示一下，草莓蛋糕", "bot-chat");
        } else {
            sendMessage("我们就一直在这耗着呗，看谁耗过谁", "bot-chat");
        }
    }
});
