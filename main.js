(function(){
  // Create Canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;
  document.body.appendChild(canvas);

  // Background image
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Randomly place a monster
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
  }

  var game = {
    running: false,
    won: false
  };

  // Hero
  window.hero = {
    ready: true,
    images: {
      left: new Sprite('images/party.png', [12,16], [14,18], 22, [0,1], 'vertical'),
      right: new Sprite('images/party.png', [14,18], [14,18], 22, [2,3], 'vertical'),
      up: new Sprite('images/party.png', [14,18], [14,18], 22, [4,5], 'vertical'),
      down: new Sprite('images/party.png', [14,20], [14,18], 22, [6,7], 'vertical'),
    },
    dir: 'left',
    x: canvas.width/2,
    y: canvas.height-30,
    height: 20,
    width: 14,
    speed: 256 // pixels per second
  };

  resources.load([
    'images/party.png'
  ]);
  resources.onReady(init);

  // Monster
  var monsterReady = false;
  var monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
  var monster = {
    x: 0,
    y: 0
  };
  var monstersCaught = 0;

  // User Input
  var keysDown = {};
  addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
  }, false);

  var update = function (modifier) {
    if (38 in keysDown) {
      // Player holding up key
      if (hero.y > 0)
      hero.y -= hero.speed * modifier;
      hero.images.up.update(modifier);
      hero.dir = 'up';
    }
    if (40 in keysDown) {
      // Player holding down key
      if (hero.y < 480-hero.height)
      hero.y += hero.speed * modifier;
      hero.images.down.update(modifier);
      hero.dir = 'down';
    }
    if (37 in keysDown) {
      // Left
      if (hero.x > 0)
      hero.x -= hero.speed * modifier;
      hero.images.left.update(modifier);
      hero.dir = 'left';
    }
    if (39 in keysDown) {
      // Right
      if (hero.x < 512-hero.width)
      hero.x += hero.speed * modifier;
      hero.images.right.update(modifier);
      hero.dir = 'right';
    }

    if (
      hero.x <= (monster.x + 32)
      && monster.x <= (hero.x + 32)
      && hero.y <= (monster.y + 32)
      && monster.y <= (hero.y + 32)
    ) {
      ++monstersCaught;
      reset();
    }
  };

  var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage,0,0);
    }
    if (hero.ready) {
      switch(hero.dir) {
        case 'left':
        ctx.save();
        ctx.translate(hero.x,hero.y);
        hero.images.left.render(ctx);
        ctx.restore();
        break;
        case 'right':
        ctx.save();
        ctx.translate(hero.x,hero.y);
        hero.images.right.render(ctx);
        ctx.restore();
        break;
        case 'up':
        ctx.save();
        ctx.translate(hero.x,hero.y);
        hero.images.up.render(ctx);
        ctx.restore();
        break;
        case 'down':
        ctx.save();
        ctx.translate(hero.x,hero.y);
        hero.images.down.render(ctx);
        ctx.restore();
        break;
      }
    }
    if (monsterReady) {
      ctx.drawImage(monsterImage,monster.x,monster.y);
    }
    ctx.fillStyle = "rgba(250,250,250,1)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
  };

  var main = function (then) {
    var now = Date.now();
    var delta = now - then;
    var dt = (delta / 1000);
    update(dt);
    render();

    then = now;
  }

  var frameLimiter = function (fn, fps) {

    // Use var then = Date.now(); if you
    // don't care about targetting < IE9
    var then = new Date().getTime();

    // custom fps, otherwise fallback to 60
    fps = fps || 60;
    var interval = 1000 / fps;

    return (function loop(time){
      requestAnimationFrame(loop);
      // again, Date.now() if it's available
      var now = new Date().getTime();
      var delta = now - then;

      if (delta > interval) {
        // Update time
        // now - (delta % interval) is an improvement over just
        // using then = now, which can end up lowering overall fps
        then = now - (delta % interval);

        // call the fn
        main(then);
      }
    }(0));
  };

  function init() {
    var then = Date.now();
    hero.ready = true;
    reset();
    frameLimiter();
  }

})()
