let IS_ANSWER_SELECTED = false;
let currentQuestionGen;
let currentTheme;
let currentSources;
let currentID;
let questionNr;
let currentRightAnswers;
let currentTippingPoint;
let totalRightAnswers;
let timeFactor = 1;

function newGame() {
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("tippingPoints").style.visibility = "visible";
    document.getElementById("thermometer").style.visibility = "visible";
    score = 0;
    let thermometerBar = document.getElementById("thermometer-bar");
    let barHeight = 27;
    thermometerBar.style.height = barHeight + "px";
    let thermometerInterval = setInterval(() => {
        thermometerBar.style.height = barHeight + "px";
        // game is gonna be 15 min long with a val of 0.2
        barHeight += 0.2 * timeFactor;
        if (barHeight >= 207) { // end of game
            clearInterval(thermometerInterval);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    document.getElementById("game-over-summary").style.visibility = "visible";
    document.getElementById("total-right-answers").innerHTML = totalRightAnswers;
    document.getElementById("question-summary").style.visibility = "hidden";
    document.getElementById("tippingPoints").classList.add("fade-out");
    document.getElementById("question-container").classList.remove("scale-out-from-center");
}

function ueber() {
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("ueber").style.visibility = "visible";
    document.getElementById("back-button").style.visibility = "visible";
}

function back() {
    document.getElementById("menu").style.visibility = "visible";
    document.getElementById("ueber").style.visibility = "hidden";
    document.getElementById("back-button").style.visibility = "hidden";
}

function* questionGen(questions) {
    for (const question of questions) {
        yield question;
    }
}

function closeQuestions() {
    document.getElementById("question-container").classList.remove("scale-out-from-center");
    document.getElementById("tippingPoints").classList.remove("fade-out");
    document.getElementById("question-summary").style.visibility = "hidden";
    totalRightAnswers += currentRightAnswers;
}

function openQuestions(tippingPointId) {
    tippingPointObj = tippingPoints.find(tippingPoint => tippingPoint.id === tippingPointId);
    // Has this tipping point already been visited?
    if (tippingPointObj.visited === true) {
        window.alert('Diese Region wurde bereits besucht!');
        return;
    }
    tippingPointObj.visited = true;
    document.getElementById("question-container").classList.add("scale-out-from-center");
    document.getElementById("tippingPoints").classList.add("fade-out");
    currentQuestionGen = questionGen(tippingPointObj.questions);
    currentTippingPoint = tippingPointObj;
    currentTheme = tippingPointObj.desc;
    questionNr = 1;
    currentRightAnswers = 0;
    currentSources = tippingPointObj.sources;
    currentID = tippingPointObj.id;
    nextQuestion();
}

function nextQuestion() {
    if (!currentQuestionGen) { return; }
    let gen = currentQuestionGen.next();
    if (gen.done) {
        showQuestionResults();
        // set colour of 'lost' and 'saved' regions
        if (((currentRightAnswers / currentTippingPoint.questions.length) * 100 | 0) <= 33) {
            document.getElementById(currentID).style.fill = "rgba(255, 102, 102, 0.6)";
        }
        else {
            document.getElementById(currentID).style.fill = "rgba(135, 211, 124,0.6)";
        }
        return;
    }
    let questionObj = gen.value;
    document.getElementById("tippingPoint").innerHTML = currentTheme;
    let img = document.getElementById("question-img");
    let tippingPointObj = tippingPoints.find(tp => tp.desc === currentTheme);
    img.src = `assets/${tippingPointObj.img}`;
    let question = document.getElementById("question");
    let answerContainer = document.getElementById("answer-container");
    let answersRand = questionObj.answers.sort(() => Math.random() - 0.5);
    let nrElement = document.getElementById("question-nr");
    let nr = questionNr++;

    nrElement.innerHTML = "Frage " + nr + "/" + currentTippingPoint.questions.length;
    question.innerHTML = questionObj.question;
    answerContainer.innerHTML = "";
    for (let i = 0; i < answersRand.length; i++) {
        const answer = answersRand[i];
        let node = document.createElement("p");
        node.innerHTML = i + 1 + ". " + answer.value;
        node.classList.add("button");
        node.setAttribute("correct", answer.correct);
        node.addEventListener("click", (event) => { handleAnswer(event); });
        answerContainer.appendChild(node);
    }
    document.getElementById("continue-button").style.visibility = "hidden";
    IS_ANSWER_SELECTED = false;
}

function showQuestionResults() {
    let questSummaryEle = document.getElementById("question-summary");
    let rightAnswersEle = document.getElementById("right-answers");
    let scoreEle = document.getElementById("score");
    let linksEle = document.getElementById("links");
    let domainRegex = new RegExp("^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)");
    let nrOfQuestions = currentTippingPoint.questions.length;

    questSummaryEle.style.visibility = "visible";
    rightAnswersEle.innerHTML = currentRightAnswers + "/" + nrOfQuestions;

    scoreEle.className = "progress-" + ((currentRightAnswers / nrOfQuestions) * 100 | 0) + " circular-progress-bar";
    linksEle.innerHTML = "";
    for (const source of currentSources) {
        let node = document.createElement("a");
        node.href = source;
        node.target = "_blank";
        node.innerHTML = domainRegex.exec(source)[1] + "<br>";
        linksEle.appendChild(node);
    }
}

function handleAnswer(mouseEvent) {
    if (IS_ANSWER_SELECTED) { return; }
    let answerContainer = document.getElementById("answer-container");
    let targetEle = mouseEvent.target;
    targetEle.style.boxShadow = "inset 0 0 4px 2px rgba(0, 0, 0, 0.2)";
    targetEle.style.border = "3px solid #5882FA";
    if (targetEle.getAttribute("correct") === "true") {
        currentRightAnswers++;
    }
    for (const answer of answerContainer.children) {
        if (answer.getAttribute("correct") === "true") {
            answer.style.background = "rgba(135, 211, 124,0.6)";
        } else {
            answer.style.background = "rgba(255, 102, 102, 0.6)";
            timeFactor += 0.1;
        }
    }
    document.getElementById("continue-button").style.visibility = "visible";
    IS_ANSWER_SELECTED = true;
}