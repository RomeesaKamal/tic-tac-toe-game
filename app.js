let boxes = document.querySelectorAll(".box");
let msgContainer = document.querySelector(".msg-container");
let resetBtn = document.querySelector("#rest-btn");
let newGameBtn = document.querySelector("#new-btn");
let msg = document.querySelector("#msg");
let turnDisplay = document.getElementById("turn");
let board = document.querySelector(".winning-line-container");

let turnO = false; // Player starts as "X"
let count = 0; // To track draw

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [6, 7, 8], [3, 4, 5]
];

const resetGame = () => {
    turnO = false;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateTurnIndicator();
    removeWinningLine(); // Remove any winning line
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!box.innerText) {
            box.innerText = "X"; // Player move
            box.disabled = true;
            count++;

            turnO = true;  // ✅ Update turn before UI update
            updateTurnIndicator(); // ✅ Update turn display

            let isWinner = checkWinner();
            if (!isWinner && count < 9) {
                setTimeout(computerMove, 500); // Delay computer move
            }
        }
    });
});

// ✅ Computer's Move
const computerMove = () => {
    let emptyBoxes = [...boxes].filter(box => !box.innerText);
    if (emptyBoxes.length === 0) return;

    let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    randomBox.innerText = "O";
    randomBox.disabled = true;
    count++;

    turnO = false; //  Update turn before UI update
    updateTurnIndicator(); // Update turn display

    checkWinner();
};

// Check Winner & Handle Winning Line
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let pos1Val = boxes[a].innerText;
        let pos2Val = boxes[b].innerText;
        let pos3Val = boxes[c].innerText;

        if (pos1Val && pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val, pattern);
            return true;
        }
    }
    if (count === 9) gameDraw();
    return false;
};

const showWinner = (winner, winningPattern) => {
    drawWinningLine(winningPattern); // ✅ Show winning line first

    setTimeout(() => {
        msg.innerText = `Congratulations, Winner is ${winner}!`;
        msgContainer.classList.remove("hide");
    }, 1000); // Delay message for 1 second

    disableBoxes();
};


// Draw Winning Line
const drawWinningLine = (pattern) => {
    let [a, b, c] = pattern;
    let boxA = boxes[a];
    let boxC = boxes[c];

    let boardRect = board.getBoundingClientRect();
    let rectA = boxA.getBoundingClientRect();
    let rectC = boxC.getBoundingClientRect();

    let line = document.createElement("div");
    line.classList.add("winning-line");

    let x1 = rectA.left + rectA.width / 2 - boardRect.left;
    let y1 = rectA.top + rectA.height / 2 - boardRect.top;
    let x2 = rectC.left + rectC.width / 2 - boardRect.left;
    let y2 = rectC.top + rectC.height / 2 - boardRect.top;

    let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = `${distance}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    board.appendChild(line);
};

// Remove Winning Line
const removeWinningLine = () => {
    let lines = document.querySelectorAll(".winning-line");
    lines.forEach(line => line.remove());
};

//  Game Draw
const gameDraw = () => {
    msg.innerText = "Game was a Draw!";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

// Disable Boxes
const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

// Enable Boxes
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

// Update Turn Indicator with Background Color Change
const updateTurnIndicator = () => {
    turnDisplay.innerText = turnO ? "O" : "X";
    turnDisplay.style.backgroundColor = turnO ? "rgba(250, 4, 4, 0.5)" : "rgb(206, 68, 50)";
    turnDisplay.style.boxShadow = turnO ? "0 3px 10px rgb(206, 68, 50)" : "0 3px 10px rgba(250, 4, 4, 0.5)";
    turnDisplay.style.borderRadius = "50%";
    turnDisplay.style.padding = "6px 12px";
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

updateTurnIndicator(); // Initial turn display
