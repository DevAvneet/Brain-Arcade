let COOLDOWN = 2 * 60 * 60 * 1000;
let key = "geo_lastPlayed";

let lastPlayed = localStorage.getItem(key);
let now = Date.now();

let message = document.getElementById("message");
let gameOver = false;

if (lastPlayed && now - lastPlayed < COOLDOWN) {
  let mins = Math.ceil((COOLDOWN - (now - lastPlayed)) / 60000);
  message.innerText = "Come back in " + mins + " minutes";
  gameOver = true;
}

let countries = [
  { name: "India", hint: "It is in Asia" },
  { name: "Japan", hint: "Island country near China" },
  { name: "France", hint: "In Europe, near Germany" },
  { name: "Brazil", hint: "Largest country in South America" }
];

let pick = countries[Math.floor(Math.random() * countries.length)];
let answer = pick.name.toLowerCase();

document.getElementById("word").innerText =
  "_ ".repeat(answer.length);

document.getElementById("hint").innerText =
  "Hint: " + pick.hint;

function checkAnswer() {
  if (gameOver) return;

  let user = document.getElementById("answer").value.toLowerCase().trim();

  if (user === answer) {
    message.innerText = "Correct!";
    localStorage.setItem(key, Date.now());
    gameOver = true;
  } else {
    message.innerText = "Wrong guess";
  }
}
