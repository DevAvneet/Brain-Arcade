let coins = Number(localStorage.getItem("coins")) || 0;
document.getElementById("coins").innerText = "🪙 Coins: " + coins;

let difficulty = localStorage.getItem("guess_difficulty") || "easy";
const cooldowns = { easy: 5*60*1000, medium: 15*60*1000, hard: 30*60*1000 };
const lastKey = "guessLast_" + difficulty;

const msg = document.getElementById("msg");
const btn = document.getElementById("submitBtn");
const input = document.getElementById("guess");
const hintsDiv = document.getElementById("hints");

let min = 1;
let max = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
let secret = Math.floor(Math.random() * (max - min + 1)) + min;

let hintCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;
let hints = [];

/* ✅ SAFE HINTS */
if (secret % 2 === 0) hints.push("Even number");
else hints.push("Odd number");

hints.push("Greater than " + (secret - Math.floor(Math.random()*3) - 1));
hints.push("Less than " + (secret + Math.floor(Math.random()*3) + 1));

while (hints.length < hintCount) {
  let r = Math.floor(Math.random() * max);
  if (r < secret && !hints.includes("Greater than " + r)) {
    hints.push("Greater than " + r);
  }
}

hintsDiv.innerHTML = hints.join("<br>");

function checkCooldown() {
  let last = Number(localStorage.getItem(lastKey)) || 0;
  let now = Date.now();
  if (now - last < cooldowns[difficulty]) {
    let mins = Math.ceil((cooldowns[difficulty] - (now - last)) / 60000);
    msg.innerText = "⏳ Come back in " + mins + " min";
    btn.disabled = true;
    return false;
  }
  return true;
}

checkCooldown();

btn.onclick = () => {
  if (!checkCooldown()) return;

  let user = Number(input.value);
  if (user < min || user > max) {
    msg.innerText = "Enter number between " + min + " and " + max;
    msg.style.color = "orange";
    return;
  }

  if (user === secret) {
    let reward = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    coins += reward;
    localStorage.setItem("coins", coins);
    document.getElementById("coins").innerText = "🪙 Coins: " + coins;

    msg.innerText = "✅ Correct! +" + reward + " coins";
    msg.style.color = "green";
    localStorage.setItem(lastKey, Date.now());
    btn.disabled = true;
  } else {
    msg.innerText = "❌ Wrong guess";
    msg.style.color = "red";
  }
};
