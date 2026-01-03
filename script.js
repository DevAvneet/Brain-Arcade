let COOLDOWN = 60 * 60 * 1000; // 1 hour
let key = "guess_lastPlayed";

let lastPlayed = localStorage.getItem(key);
let now = Date.now();

let secretNumber = Math.floor(Math.random() * 10) + 1;
let attempts = 0;
let gameOver = false;

let message = document.getElementById("message");

if (lastPlayed && now - lastPlayed < COOLDOWN) {
  let remaining = Math.ceil((COOLDOWN - (now - lastPlayed)) / 60000);
  message.innerText = "Come back in " + remaining + " minutes";
  message.style.color = "gray";
  gameOver = true;
}

function checkGuess() {
  if (gameOver) return;

  let guess = Number(document.getElementById("guessInput").value);

  if (guess < 1 || guess > 10) {
    message.style.color = "orange";
    message.innerText = "Enter a number between 1 and 10";
    return;
  }

  attempts++;

  if (guess === secretNumber) {
    message.style.color = "green";
    message.innerText =
      "Correct! You guessed it. Attempts: " + attempts;

    localStorage.setItem(key, Date.now());
    gameOver = true;
  } else {
    message.style.color = "red";
    message.innerText =
      "Wrong guess. Attempts: " + attempts;
  }
}
