/*var tickSpeed = 6; //in TPS
var z = 0;
var base = 75;
var coreBreath = 4 + base; //in percent? per second
var x = document.getElementById("core-m").style;
//document.getElementById("behave").innerHTML = "Changer le comportement (Actuel: " + bubble.settings.generalBehavior + ")";
//document.getElementById("range").innerHTML = "Changer l'effet de portée (Actuel: " + bubble.settings.generalRangeEffect + ")";
//document.getElementById("pausemenu").style.display = "none";
*/
bubble.settings.generalBehavior = 0;
bubble.settings.generalRangeEffect = -1;
key.enable = true;
var paused = false;
/*function pause() {
  if (paused) { document.getElementById("pausemenu").style.display = "none"; tick(); } 
  else { document.getElementById("pausemenu").style.display = "block"; }
  toogle(paused);
}*/
/*
function cpls() {
  key.enable = toogle(key.enable);
  cursor.enable = toogle(key.enable);
  if (key.enable) { keymotion(); }
}
function cb() {
  if (bubble.settings.generalBehavior < 1) { bubble.settings.generalBehavior++; }
  else { bubble.settings.generalBehavior = -1; }
  //document.getElementById("behave").innerHTML = "Changer le comportement (Actuel: " + bubble.settings.generalBehavior + ")";
}
function cp() {
  if (bubble.settings.generalRangeEffect < 1) { bubble.settings.generalRangeEffect++; }
  else { bubble.settings.generalRangeEffect = -1; }
  //document.getElementById("range").innerHTML = "Changer l'effet de portée (Actuel: " + bubble.settings.generalRangeEffect + ")";
}
*/
function pre() {
  if (!toc) {
    ctx.fillStyle = "#000000";
    if (cursor.enable) { ctx.fillRect(cursor.x, cursor.y, 6, 6); }
    else if (key.enable) { ctx.fillRect(Math.round(key.pos.x), Math.round(key.pos.y), 6, 6); }
  }
}
function post() {
  if (!toc) {
    ctx.fillStyle = "#FF5C79";
    if (cursor.enable) { ctx.fillRect(cursor.x, cursor.y, 6, 6); }
    else if (key.enable) { ctx.fillRect(Math.round(key.pos.x), Math.round(key.pos.y), 6, 6); }
  }
}
var c = document.getElementById("game")
c.style.display = "none";
function recalcPos() {
  c.width = document.documentElement.clientWidth;
  c.height = document.documentElement.clientHeight / 2;
}
recalcPos()
text.to = "document.getElementById('chat').innerHTML";
var posInChat = 0;
var chat = [
  "What is life?",
  "What meaning does it hide?",
  "This, this is what we all seek for.",
  "This is what makes us go along.",
  "This is...",
  "/Life."
]
function effect() {
  a = rand.int(1, 5);
  eval("var audio = new Audio('typing" + a + ".mp3');");
  audio.play();
}
function next() {
  if (chat[posInChat].substr(0, 1) == "/") {
    startGame(1, 0);
    text.startSay(chat[posInChat].substr(1, chat[posInChat].length - 1));
    posInChat++;
    c.style.display = "block";
  } else {
    text.startSay(chat[posInChat]);
    posInChat++;
  }
}

var ctx = c.getContext("2d");
var timer = 1;
var toc = false;
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, c.width, c.height);
function startGame(a, b) {
  bubble.settings.generalBehavior = a;
  bubble.settings.generalRangeEffect = b;
  for (let i = 0; i < 20; i++) {
    bubble.create(rand.int(1, 100), rand.int(1, c.height), rand.real(4.5, 6, 2));
  }
  key.pos.x = Math.round(c.width / 2);
  key.pos.y = Math.round(c.height / 2);
  load();
  ctx.fillStyle = "#FF5C79";
  ctx.fillRect(key.pos.x, key.pos.y, 6, 6);
  key.restrictions(0, c.width - 7, 0, c.height - 7);
  bubble.restrict(0, c.width + 30, -5, c.height);
  tick()
}
function tick() {
  for (let i = 0; i < bubble.data.length; i++) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(Math.round(bubble.data[i].x), Math.round(bubble.data[i].y), 5, 5);
    var x = bubble.data[i].x;
    var y = bubble.data[i].y;
    var a = {}
    if (cursor.enable) { a = bubble.tick(i, cursor.x, cursor.y, timer); }
    else if (key.enable) { a = bubble.tick(i, key.pos.x, key.pos.y, timer); }
    var t = norm(a.x - bubble.data[i].x, a.y - bubble.data[i].y);
    if (cursor.enable) {
      if (t >= 6 * bubble.data[i].speed || norm(cursor.x - a.x, cursor.y - a.y) <= 5) {
        bubble.edit(i, 0, rand.int(1, c.height));
        console.log("Toc");
        toc = true;
      }
    } else if (key.enable) {
      if (t >= 6 * bubble.data[i].speed || norm(key.pos.x - a.x, key.pos.y - a.y) <= 5) {
        console.log("Toc");
        toc = true;
      }
    }
    if (a.x >= c.width) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(4.5, 6, 2)); }
    if (bubble.settings.restrictions.xMin >= a.x || bubble.settings.restrictions.xMax <= a.x) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(4.5, 6, 2)); }
    if (bubble.settings.restrictions.yMin >= a.y || bubble.settings.restrictions.yMax <= a.y) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(4.5, 6, 2)); }
    if (a.speed >= 4.5 && a.speed <= 6) {
      var propSpd = getMix(4.5, 6, a.speed);
      var hexspd = (Math.round(mix(150, 255, propSpd))).toString(16);
      hexspd = hexspd.toUpperCase();
      var color = "#" + hexspd + hexspd + hexspd;
      ctx.fillStyle = color;
    } else {
      console.log("Error: out of range")
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillRect(Math.round(bubble.data[i].x), Math.round(bubble.data[i].y), 5, 5);
  }
  if (!toc) {
    if (!paused) {
      load();
      setTimeout(tick, 1000 / 60);
    }
  } else {
    c.style.display = "none";
    document.getElementById('soil').style.backgroundColor = "#9e0000";
    //document.getElementById('soil').style.background = "linear-gradient(to bottom, #000000 0%,#9e0000 100%)";
  }
}