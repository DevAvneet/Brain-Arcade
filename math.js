document.addEventListener("DOMContentLoaded", () => {

  const msg = document.getElementById("msg");
  const btn = document.getElementById("submitBtn");
  const question = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const hintsBox = document.getElementById("hints-box");
  const hintsDisplay = document.getElementById("hints");

  let coins = Number(localStorage.getItem("coins")) || 0;
  document.getElementById("coins").innerText = "🪙 Coins: " + coins;

  let correctAnswer = 0;
  let a, b, c; // numbers for hints

  let difficulty = localStorage.getItem("math_difficulty") || "easy";
  const cooldowns = { easy: 15*60*1000, medium: 30*60*1000, hard: 60*60*1000 };
  const lastKey = "mathLast_" + difficulty;

  function checkCooldown() {
    let last = Number(localStorage.getItem(lastKey)) || 0;
    let now = Date.now();
    if(now - last < cooldowns[difficulty]){
      let mins = Math.ceil((cooldowns[difficulty] - (now - last))/60000);
      msg.innerText = `⏳ Come back in ${mins} min`;
      msg.style.color = "gray";
      btn.disabled = true;
      return false;
    } else {
      btn.disabled = false;
      msg.innerText = "";
      return true;
    }
  }

  // Prevent negative input in easy
  if(difficulty === "easy") {
    answerInput.addEventListener("keydown", e => {
      if(e.key === "-" || e.key === "e") e.preventDefault();
    });
    answerInput.addEventListener("paste", e => {
      if(e.clipboardData.getData("text").includes("-")) e.preventDefault();
    });
    answerInput.addEventListener("input", () => {
      if(Number(answerInput.value) < 0) answerInput.value = "";
    });
  }

  function formatNumber(n) { return n < 0 ? `(${n})` : n; }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateQuestion() {
    let reward = 0;
    let questionText = "";

    if(difficulty === "easy") {
      hintsBox.style.display = "none";
      reward = 5;
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      let op = Math.random() < 0.5 ? "+" : "-";
      if(op === "-" && b > a) [a,b] = [b,a]; // no negative result
      questionText = `${a} ${op} ${b} = ?`;
      correctAnswer = op === "+" ? a + b : a - b;

    } else if(difficulty === "medium") {
      hintsBox.style.display = "block";
      reward = 10;
      a = Math.floor(Math.random()*50)-25;
      b = Math.floor(Math.random()*50)-25;
      let op = Math.random() < 0.5 ? "+" : "-";
      questionText = `${formatNumber(a)} ${op} ${formatNumber(b)} = ?`;
      correctAnswer = op === "+" ? a + b : a - b;

    } else { // hard
      hintsBox.style.display = "block";
      reward = 20;
      a = Math.floor(Math.random()*20)-10;
      b = Math.floor(Math.random()*20)-10;
      c = Math.floor(Math.random()*20)-10;

      let ops = ["+","-","*","/"];
      let op1 = ops[Math.floor(Math.random()*4)];
      let op2 = ops[Math.floor(Math.random()*4)];

      let useParentheses = Math.random() < 0.5;

      if(useParentheses){
        if(op2 === "/" && c === 0) c = 1;
        if(op1 === "/" && b === 0) b = 1;
        questionText = `${formatNumber(a)} ${op1} (${formatNumber(b)} ${op2} ${formatNumber(c)}) = ?`;
        correctAnswer = eval(`${a} ${op1} (${b} ${op2} ${c})`);
      } else {
        if(op1 === "/" && b === 0) b = 1;
        if(op2 === "/" && c === 0) c = 1;
        questionText = `${formatNumber(a)} ${op1} ${formatNumber(b)} ${op2} ${formatNumber(c)} = ?`;
        correctAnswer = eval(`${a} ${op1} ${b} ${op2} ${c}`);
      }
    }

    question.innerText = questionText;
    answerInput.value = "";
    answerInput.focus();
    btn.disabled = false;
    answerInput.dataset.reward = reward;

    showHints();
  }

  function showHints() {
    if(difficulty === "easy") {
      hintsBox.style.display = "none";
      return;
    }

    hintsBox.style.display = "block";
    let hintArr = [];

    if(difficulty === "medium") {
      const op = correctAnswer >= a ? "+" : "-"; // operator used
      const options = [
        correctAnswer >= 0 ? "✅ Result is positive" : "⚠️ Result is negative",
        a >= b ? "First number ≥ second number" : "First number < second number",
        "Check addition or subtraction carefully",
        `Estimate roughly: ${a} ${op} ${b}?`
      ];
      hintArr = shuffleArray(options).slice(0,1); // 1 unique hint

    } else { // hard
      const hardHints = [
        "Compute from left to right",
        "Do parentheses first if exist",
        "Estimate the result roughly",
        "Watch out for division by zero",
        `Check individual numbers: ${a}, ${b}, ${c}`
      ];
      hintArr = shuffleArray(hardHints).slice(0,2); // 2 unique hints
    }

    hintsDisplay.innerHTML = hintArr.join("<br>");
  }

  generateQuestion();
  checkCooldown();

  btn.onclick = () => {
    if(!checkCooldown()) return;

    let user = Number(answerInput.value);
    if(isNaN(user)){
      msg.innerText = "Enter a valid number";
      msg.style.color = "orange";
      return;
    }

    if(difficulty === "easy" && user < 0){
      msg.innerText = "❌ Easy level only accepts positive numbers";
      msg.style.color = "orange";
      return;
    }

    if(user === correctAnswer){
      let reward = Number(answerInput.dataset.reward);
      coins += reward;
      localStorage.setItem("coins", coins);
      document.getElementById("coins").innerText = "🪙 Coins: " + coins;
      msg.innerText = `✅ Correct! +${reward} coins`;
      msg.style.color = "green";
      localStorage.setItem(lastKey, Date.now());
      btn.disabled = true;
    } else {
      msg.innerText = "❌ Wrong, try again";
      msg.style.color = "red";
    }
  }

});
