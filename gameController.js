let IS_ANSWER_SELECTED = false;
let currentQuestionGen;
let currentTheme;
let questionNr;
let currentRightAnswers;

function newGame() {
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("tippingPoints").style.visibility = "visible";
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
}

function openQuestions(tippingPointId) {
    tippingPointObj = tippingPoints.find(tippingPoint => tippingPoint.id === tippingPointId);
    document.getElementById("question-container").classList.add("scale-out-from-center");
    document.getElementById("tippingPoints").classList.add("fade-out");
    currentQuestionGen = questionGen(tippingPointObj.questions);
    currentTheme = tippingPointObj.desc;
    questionNr = 1;
    currentRightAnswers = 0;
    nextQuestion();
}

function nextQuestion() {
    if (!currentQuestionGen) {return;}
    let gen = currentQuestionGen.next();
    if (gen.done) {
        showQuestionResults();
        return;
    }
    let questionObj = gen.value;
    document.getElementById("tippingPoint").innerHTML = currentTheme;
    let img = document.getElementById("question-img"); // still just a placeholder img
    let question = document.getElementById("question");
    let answerContainer = document.getElementById("answer-container");
    let answersRand = questionObj.answers.sort(() => Math.random() - 0.5);
    let nrElement = document.getElementById("question-nr");
    let nr = questionNr++;

    nrElement.innerHTML = "Frage " + nr + "/3";
    question.innerHTML = questionObj.question;
    answerContainer.innerHTML = "";
    for (let i = 0; i < answersRand.length; i++) {
        const answer = answersRand[i];
        let node = document.createElement("p");
        node.innerHTML = i+1 + ". " + answer.value;
        node.classList.add("button");
        node.setAttribute("correct", answer.correct);
        node.addEventListener("click", (event) => {handleAnswer(event);});
        answerContainer.appendChild(node);
    }
    document.getElementById("continue-button").style.visibility = "hidden";
    IS_ANSWER_SELECTED = false;
}

function showQuestionResults() {
    let questSummaryEle = document.getElementById("question-summary");
    let rightAnswersEle = document.getElementById("right-answers");
    let scoreEle = document.getElementById("score");

    questSummaryEle.style.visibility = "visible";
    rightAnswersEle.innerHTML = currentRightAnswers;
    scoreEle.classList.add("progress-" + currentRightAnswers);
}

function handleAnswer(mouseEvent) {
    if (IS_ANSWER_SELECTED) {return;}
    let answerContainer = document.getElementById("answer-container");
    let targetEle = mouseEvent.target;
    targetEle.style.boxShadow = "inset 0 0 4px 2px rgba(0, 0, 0, 0.2)";
    targetEle.style.border = "3px solid #5882FA";
    if (targetEle.getAttribute("correct") === "true") {
        currentRightAnswers++;
    }
    for (const answer of answerContainer.children) {
        if (answer.getAttribute("correct") === "true"){
            answer.style.background = "rgba(135, 211, 124,0.6)";
        } else {
            answer.style.background = "rgba(255, 102, 102, 0.6)";
        }
    }
    document.getElementById("continue-button").style.visibility = "visible";
    IS_ANSWER_SELECTED = true;
}