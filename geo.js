let coins = Number(localStorage.getItem("coins")) || 0;
document.getElementById("coins").innerText = "🪙 Coins: " + coins;

let difficulty = localStorage.getItem("geo_difficulty") || "easy";
const cooldowns = { easy: 10*60*1000, medium: 20*60*1000, hard: 30*60*1000 };
const lastKey = "geoLast_" + difficulty;

const msg = document.getElementById("msg");
const question = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submitBtn");
const hintsBox = document.getElementById("hints-box");
const hintsDiv = document.getElementById("hints");

const countries = {
  easy: [
    {name:"India", hints:["Asia","Taj Mahal","Spices","Over 1B people"]},
    {name:"Japan", hints:["Asia","Island country","Anime","Sushi"]},
    {name:"Canada", hints:["North America","Maple leaf","Very cold","Large country"]},
    {name:"Italy", hints:["Europe","Pizza","Rome","Boot shaped"]},
    {name:"Australia", hints:["Southern hemisphere","Kangaroos","Island continent","Sydney"]}
  ],
  medium: [
    {name:"France", hints:["Europe","Eiffel Tower","Wine","Paris"]},
    {name:"Brazil", hints:["South America","Football","Amazon","Large country"]},
    {name:"Egypt", hints:["Africa","Pyramids","Nile","Desert"]},
    {name:"Russia", hints:["Largest country","Cold","Europe + Asia","Moscow"]},
    {name:"Mexico", hints:["North America","Tacos","Near USA","Spanish language"]}
  ],
  hard: [
    {name:"Bhutan", hints:["Asia","Himalayas","Happiness index","Thimphu"]},
    {name:"Suriname", hints:["South America","Dutch language","Forests","Small population"]},
    {name:"Belize", hints:["Central America","Barrier reef","English speaking","Belmopan"]},
    {name:"Mongolia", hints:["Landlocked","Genghis Khan","Grasslands","Ulaanbaatar"]},
    {name:"Madagascar", hints:["Island","Africa","Lemurs","Unique wildlife"]}
  ]
};

let picked = countries[difficulty][Math.floor(Math.random()*countries[difficulty].length)];
question.innerText = "_ ".repeat(picked.name.length);

let hintCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
hintsDiv.innerHTML = picked.hints.slice(0, hintCount).join("<br>");
hintsBox.style.display = "block";

function checkCooldown() {
  let last = Number(localStorage.getItem(lastKey)) || 0;
  let now = Date.now();
  if(now - last < cooldowns[difficulty]){
    let mins = Math.ceil((cooldowns[difficulty] - (now - last)) / 60000);
    msg.innerText = "⏳ Come back in " + mins + " min";
    submitBtn.disabled = true;
    return false;
  }
  return true;
}

checkCooldown();

submitBtn.onclick = () => {
  if(!checkCooldown()) return;

  let user = answerInput.value.trim().toLowerCase();
  if(user === picked.name.toLowerCase()){
    let reward = difficulty==="easy"?5:difficulty==="medium"?10:20;
    coins += reward;
    localStorage.setItem("coins", coins);
    document.getElementById("coins").innerText = "🪙 Coins: " + coins;
    msg.innerText = "✅ Correct! +" + reward + " coins";
    msg.style.color = "green";
    localStorage.setItem(lastKey, Date.now());
    submitBtn.disabled = true;
  } else {
    msg.innerText = "❌ Wrong, try again";
    msg.style.color = "red";
  }
};
