
// ==========================================
// TAYPER - TYPING TEST
// ==========================================


// 1. HTML ELEMENTS

const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const charactersDisplay = document.getElementById("characters");

const restartBtn = document.getElementById("restart");
const tryAgainBtn = document.getElementById("tryAgain");

const resultsScreen = document.getElementById("resultsScreen");
const mainContainer = document.querySelector(".container");

const categoryButtons = document.querySelectorAll(".category-btn");
const timeButtons = document.querySelectorAll(".time-options button");


// 2. WORD DATABASE

const words = {

    all: [
        "computer", "technology", "beautiful", "development",
        "programming", "javascript", "website", "internet",
        "creative", "information", "keyboard", "software",
        "application", "business", "education", "success",
        "knowledge", "experience", "design", "project",
        "learning", "future", "developer", "digital",
        "solution", "language", "communication", "system",
        "opportunity", "important", "professional"
    ],

    work: [
        "meeting", "project", "office", "manager",
        "employee", "schedule", "business", "team",
        "working", "planning", "deadline", "career",
        "company", "document", "success", "task",
        "creative", "professional", "experience", "report"
    ],

    technology: [
        "technology", "computer", "software", "hardware",
        "internet", "digital", "database", "network",
        "artificial", "intelligence", "algorithm", "website",
        "information", "application", "processor", "system",
        "security", "innovation", "development", "robot"
    ],

    programming: [
        "javascript", "html", "css", "function",
        "variable", "developer", "coding", "programming",
        "frontend", "backend", "framework", "database",
        "boolean", "string", "number", "array",
        "object", "method", "element", "document"
    ],

    life: [
        "family", "happiness", "beautiful", "dream",
        "future", "success", "friendship", "journey",
        "positive", "motivation", "experience", "freedom",
        "education", "knowledge", "respect", "healthy",
        "creative", "challenge", "confidence", "smile"
    ],

    business: [
        "business", "marketing", "customer", "product",
        "company", "strategy", "finance", "management",
        "investment", "success", "market", "service",
        "development", "organization", "profit", "brand",
        "quality", "planning", "sales", "leadership"
    ]

};


// 3. GAME VARIABLES

let selectedCategory = "all";
let selectedTime = 15;

let timeLeft = 15;

let timer = null;

let started = false;
let finished = false;

let currentText = "";

let correctCharacters = 0;
let incorrectCharacters = 0;

let tabPressed = false;


// 4. GENERATE RANDOM TEXT

function generateText() {

    const wordList = words[selectedCategory];

    let result = [];

    for (let i = 0; i < 250; i++) {

        const randomIndex = Math.floor(
            Math.random() * wordList.length
        );

        result.push(wordList[randomIndex]);

    }

    currentText = result.join(" ");

    renderText();

}


// 5. DISPLAY TEXT

function renderText() {

    textDisplay.innerHTML = "";

    currentText.split("").forEach((character, index) => {

        const span = document.createElement("span");

        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);

    });

}


// 6. UPDATE TEXT COLORS

function updateText() {

    const typedText = input.value;

    const characters = textDisplay.querySelectorAll("span");

    correctCharacters = 0;
    incorrectCharacters = 0;

    characters.forEach((span, index) => {

        span.classList.remove(
            "correct",
            "incorrect",
            "current"
        );

        if (index < typedText.length) {

            if (typedText[index] === currentText[index]) {

                span.classList.add("correct");

                correctCharacters++;

            } else {

                span.classList.add("incorrect");

                incorrectCharacters++;

            }

        }

        if (index === typedText.length) {

            span.classList.add("current");

        }

    });


    // CHARACTER COUNT

    charactersDisplay.textContent = typedText.length;


    // ACCURACY

    const totalTyped = typedText.length;

    let accuracy = totalTyped > 0
        ? Math.round((correctCharacters / totalTyped) * 100)
        : 100;

    accuracyDisplay.textContent = accuracy + "%";


    // UPDATE WPM

    updateWPM();


    // FINISH WHEN TEXT ENDS

    if (typedText.length >= currentText.length) {

        finishTest();

    }

}


// 7. CALCULATE WPM

function updateWPM() {

    const elapsedTime = selectedTime - timeLeft;

    if (elapsedTime <= 0) {

        wpmDisplay.textContent = "0";

        return;

    }

    const minutes = elapsedTime / 60;

    const wpm = Math.round(
        (correctCharacters / 5) / minutes
    );

    wpmDisplay.textContent = wpm;

}


// 8. START TIMER

function startTimer() {

    if (started || finished) return;

    started = true;

    timer = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        updateWPM();

        if (timeLeft <= 0) {

            finishTest();

        }

    }, 1000);

}


// 9. FINISH TEST

function finishTest() {

    if (finished) return;

    finished = true;

    clearInterval(timer);

    input.disabled = true;

    const totalTyped = input.value.length;

    const accuracy = totalTyped > 0
        ? Math.round((correctCharacters / totalTyped) * 100)
        : 0;

    const elapsedTime = selectedTime - timeLeft;

    const minutes = elapsedTime / 60;

    const finalWpm = minutes > 0
        ? Math.round((correctCharacters / 5) / minutes)
        : 0;


    // FINAL RESULTS

    document.getElementById("finalWpm").textContent = finalWpm;

    document.getElementById("finalAccuracy").textContent =
        accuracy + "%";

    document.getElementById("finalCharacters").textContent =
        totalTyped;

    document.getElementById("finalCorrect").textContent =
        correctCharacters;

    document.getElementById("finalIncorrect").textContent =
        incorrectCharacters;

    document.getElementById("finalTime").textContent =
        elapsedTime + "s";


    // SHOW RESULTS SCREEN

    mainContainer.style.display = "none";

    resultsScreen.classList.add("show");

}


// 10. RESTART TEST

function restartTest() {

    clearInterval(timer);

    started = false;
    finished = false;

    timeLeft = selectedTime;

    correctCharacters = 0;
    incorrectCharacters = 0;

    tabPressed = false;


    // RESET INFO

    timerDisplay.textContent = timeLeft;

    wpmDisplay.textContent = "0";

    accuracyDisplay.textContent = "100%";

    charactersDisplay.textContent = "0";


    // RESET INPUT

    input.value = "";

    input.disabled = false;


    // HIDE RESULTS

    mainContainer.style.display = "block";

    resultsScreen.classList.remove("show");


    // NEW TEXT

    generateText();

    input.focus();

}


// 11. CATEGORY SELECTION

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        restartTest();

    });

});


// 12. TIME SELECTION

timeButtons.forEach(button => {

    button.addEventListener("click", () => {

        timeButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedTime = Number(button.dataset.time);

        restartTest();

    });

});


// 13. TYPING EVENT

input.addEventListener("input", () => {

    if (finished) return;

    if (!started && input.value.length > 0) {

        startTimer();

    }

    updateText();

});


// 14. RESTART BUTTONS

restartBtn.addEventListener("click", restartTest);

tryAgainBtn.addEventListener("click", restartTest);


// 15. TAB + ENTER SHORTCUT

document.addEventListener("keydown", event => {

    if (event.key === "Tab" && document.activeElement === input) {

        event.preventDefault();

        tabPressed = true;

        return;

    }

    if (
        event.key === "Enter" &&
        tabPressed &&
        document.activeElement === input
    ) {

        event.preventDefault();

        restartTest();

    }

});


// 16. INITIALIZE

generateText();

timerDisplay.textContent = selectedTime;

input.focus();


// ==========================================
// TAYPER READY!
// ==========================================

