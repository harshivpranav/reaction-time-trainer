let level = 0;
let streak = 0;
let best = localStorage.getItem("bestLevel") || 0;

document.getElementById("best").innerText = best;

let startTime;
let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("score").innerText = "Best Score: " + bestScore;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = [261, 329, 392, 523];

function showGame(game) {
    document.getElementById("reflexGame").classList.add("hidden");
    document.getElementById("memoryGame").classList.add("hidden");

    document.getElementById(game).classList.remove("hidden");
}

function playSound(index) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.frequency.value = frequencies[index];
    oscillator.type = "sine";

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.3
    );

    oscillator.stop(audioCtx.currentTime + 0.3);
}

function startReflex() {
    showGame("reflexGame");

    const box = document.getElementById("reflexBox");

    box.innerHTML = "Wait for green...";
    box.style.background = "#ff4b5c";

    setTimeout(() => {
        box.style.background = "#28a745";
        box.innerHTML = "CLICK!";
        startTime = new Date().getTime();
    }, Math.random() * 3000 + 1000);

    box.onclick = () => {
        if (box.style.background === "rgb(40, 167, 69)") {
            let reactionTime = new Date().getTime() - startTime;
            box.innerHTML = `⚡ ${reactionTime} ms`;
            box.style.background = "transparent";
        }
    };
}

let sequence = [];
let userInput = [];
let tiles = document.querySelectorAll(".tile");

function startMemory() {
    showGame("memoryGame");

    sequence = [];
    userInput = [];
    level = 0;
    streak = 0;

    updateStats();
    nextRound();
}

function nextRound() {
    userInput = [];
    sequence.push(Math.floor(Math.random() * 4));

    level++;
    streak++;

    updateStats();
    playSequence();
}

function playSequence() {
    let i = 0;

    function flashNext() {
        if (i >= sequence.length) return;

        let tile = tiles[sequence[i]];

        tile.classList.add("active");
        playSound(sequence[i]);
        vibrate(30);

        setTimeout(() => {
            tile.classList.remove("active");

            setTimeout(() => {
                i++;
                flashNext();
            }, 250);
        }, 400);
    }

    flashNext();
}

function handleTile(index) {
    userInput.push(index);

    let tile = tiles[index];

    tile.classList.add("active");
    playSound(index);
    vibrate(40);

    setTimeout(() => tile.classList.remove("active"), 200);

    if (userInput[userInput.length - 1] !== sequence[userInput.length - 1]) {
        vibrate(200);
        if (level > best) {
            best = level;
            localStorage.setItem("bestLevel", best);
        }
        // document.getElementById("gameArea").innerHTML = `
        //     <div style="text-align:center;">
        //         <h2>❌ Game Over</h2>
        //         <p>Level: ${level}</p>
        //         <p>Best: ${best}</p>
        //         <button onclick="restartMemory()">🔁 Restart</button>
        //         <button onclick="goMenu()">🏠 Menu</button>
        //     </div>
        // `;
        document.getElementById("finalLevel").innerText = level;
        document.getElementById("finalBest").innerText = best;
        document.getElementById("gameOverScreen").classList.remove("hidden");

        level = 0;
        streak = 0;
        updateStats();
        return;
    }

    if (userInput.length === sequence.length) {
        setTimeout(nextRound, 800);
    }
}

function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

function updateStats() {
    document.getElementById("level").innerText = level;
    document.getElementById("streak").innerText = streak;
    document.getElementById("best").innerText = best;
}

function restartMemory() {
    document.getElementById("gameOverScreen").classList.add("hidden");
    startMemory();
}

function goMenu() {
    document.getElementById("gameOverScreen").classList.add("hidden");

    document.getElementById("reflexGame").classList.add("hidden");
    document.getElementById("memoryGame").classList.add("hidden");
}