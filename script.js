let startTime;
let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("score").innerText = "Best Score: " + bestScore;

function startReflex() {
    const gameArea = document.getElementById("gameArea");

    gameArea.innerHTML = "Wait for green...";
    gameArea.style.background = "#ff4b5c";

    setTimeout(() => {
        gameArea.style.background = "#28a745";
        gameArea.innerHTML = "CLICK!";
        startTime = new Date().getTime();
    }, Math.random() * 3000 + 1000);

    gameArea.onclick = () => {
        if (gameArea.style.background === "rgb(40, 167, 69)") {
            let reactionTime = new Date().getTime() - startTime;

            gameArea.innerHTML = `⚡ ${reactionTime} ms`;

            if (bestScore == 0 || reactionTime < bestScore) {
                bestScore = reactionTime;
                localStorage.setItem("bestScore", bestScore);
                document.getElementById("score").innerText = "Best Score: " + bestScore;
            }

            gameArea.style.background = "transparent";
        }
    };
}

let sequence = [];
let userInput = [];
let tiles = document.querySelectorAll(".tile");

function startMemory() {
    sequence = [];
    userInput = [];
    nextRound();
}

function nextRound() {
    userInput = [];
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
}

function playSequence() {
    let i = 0;

    function flashNext() {
        if (i >= sequence.length) return;

        let tile = tiles[sequence[i]];
        tile.classList.add("active");

        setTimeout(() => {
            tile.classList.remove("active");

            setTimeout(() => {
                i++;
                flashNext();
            }, 300); // gap
        }, 500); // light duration
    }

    flashNext();
}

function handleTile(index) {
    userInput.push(index);

    let tile = tiles[index];
    tile.classList.add("active");
    setTimeout(() => tile.classList.remove("active"), 200);

    if (userInput[userInput.length - 1] !== sequence[userInput.length - 1]) {
        document.getElementById("gameArea").innerHTML = "❌ Game Over";
        return;
    }

    if (userInput.length === sequence.length) {
        setTimeout(nextRound, 800);
    }
}