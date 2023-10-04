const app = document.getElementById("container");
const leftDiv = document.getElementById("left");
const rightDiv = document.getElementById("right");
const buttonsDiv = document.getElementById("buttons");
// Initial look
const generateButtons = (input) => {
    //Replace with switch for future networks
    if (input === "undefined") {
        buttonsDiv.innerHTML = "";
        const someTest = document.createElement("h1");
        someTest.textContent = "Please select a network";
        buttonsDiv.appendChild(someTest);
    }
    else {
        generateARTButtons();
    }
};
const generateARTButtons = () => {
    buttonsDiv.innerHTML = "";
    const startBtn = document.createElement("button");
    const restartBtn = document.createElement("button");
    const drawRandom = document.createElement("button");
    const clearBtn = document.createElement("button");
    startBtn.setAttribute("type", "button");
    restartBtn.setAttribute("type", "button");
    drawRandom.setAttribute("type", "button");
    clearBtn.setAttribute("type", "button");
    startBtn.innerHTML = "Start";
    restartBtn.innerHTML = "Restart";
    drawRandom.innerHTML = "Draw random points";
    clearBtn.innerHTML = "Clear";
    buttonsDiv.appendChild(startBtn);
    buttonsDiv.appendChild(restartBtn);
    buttonsDiv.appendChild(drawRandom);
    buttonsDiv.appendChild(clearBtn);
    // Just testing
    startBtn.addEventListener("click", () => {
        animateNextStep();
    });
    drawRandom.addEventListener("click", () => {
        const posX = Math.floor(Math.random() * 350);
        const posY = Math.floor(Math.random() * 350);
        ctx.fillStyle = "blue";
        ctx.fillRect(posX, posY, 50, 50);
    });
    clearBtn.addEventListener("click", () => {
        ctx.reset();
        currentStep = 0;
        initializeCanvas();
    });
};
//# sourceMappingURL=generatorHTML.js.map