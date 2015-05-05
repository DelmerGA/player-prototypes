function Player(src) {
  this.src = src;
  this.width = 50;
  this.speed = 10;
  this.height = 50;
  this.left = 0;
  this.top = 0;
  this.prev = {};
  this.enabled = true;
}

Player.prototype.place = function () {
  var el = document.createElement("img");
  el.src = this.src;
  el.style.position = "absolute";
  el.style.width = this.width + "px";
  el.style.height = this.height + "px";
  this.el = el;
  document.
    querySelector("body").
    appendChild(el);
};

Player.prototype.drawPosition = function () {
   this.prev.left = this.left;
   this.prev.top = this.top;
   this.el.style.left = this.left + "px";
   this.el.style.top = this.top + "px";
  return this;
};

Player.prototype.moveLeft = function () {
  if (this.enabled) {
    this.left -= this.speed;
  }
  return this;
};

Player.prototype.moveRight = function () {
  if (this.enabled) {
    this.left += this.speed;
  }
  return this;
};

Player.prototype.moveUp = function () {
  if (this.enabled) {
    this.top -= this.speed;
  }
  return this;
};
Player.prototype.moveDown = function () {
  if (this.enabled) {
    this.top += this.speed;
  }
  return this;
};

Player.prototype.movePrev = function () {
  this.left = this.prev.left;
  this.top = this.prev.top;
  return this;
};

Player.prototype.disable = function () {
  this.enabled = false;
  return this;
}

Player.prototype.enable = function() {
  this.enabled = true;
}

Player.prototype.collide = function (players) {
  this.movePrev();
  this.drawPosition();
  this.el.style.boxShadow = "0px 0px 10px 10px rgba(255,0,0,1)";
  this.collided = true;
};

Player.prototype.uncollide = function () {
  this.el.style.boxShadow = "";
  this.collided = false;
};

function SuperPlayer(src) {
  Player.call(this, src);
  this.width = 100;
  this.height = 100;
  this.speed = 25;
  this.prev = {};
  this.captured = [];
}

SuperPlayer.prototype = new Player();
SuperPlayer.uber = Player.prototype;
SuperPlayer.prototype.drawPosition = function() {
  SuperPlayer.uber.drawPosition.call(this);
  var player = this;
  this.captured.forEach(function (p) {
      p.left = player.left;
      p.top = player.top - p.height - player.speed*2;
      p.drawPosition();
  });
  return this;
}
SuperPlayer.prototype.collide = function (players, player) {
  if (player === this) {
    players.forEach(function (p) {
      if (p !== player && player.captured.indexOf(p) === -1){
        player.captured.push(p);
        p.left = player.left;
        p.top = player.top - p.height* player.captured.length;
        p.drawPosition();
        p.disable();
      }

    })
  }
  SuperPlayer.uber.collide.call(this, players, player);
  return this;
};



window.addEventListener("load", function () {
   var form = document.querySelector("#playerForm");
   var playerImg = document.querySelector("#playerImg");
   var playerType = document.querySelector("#playerType"); 
   var players = [];
   var currentPlayer = null;
   var body = document.querySelector("body");
  

  
  
   var isOverlap = function (pOne, pTwo) {
     var oneLeft, oneTop, oneBtm, oneRight,
         twoLeft, twoTop, twoBtm, twoRight;
     
     oneLeft = pOne.left; 
     oneTop = pOne.top;
     oneBtm = oneTop + pOne.height;
     oneRight = oneLeft + pOne.width;
     
     twoLeft = pTwo.left;
     twoTop = pTwo.top;
     twoBtm = twoTop + pTwo.height;
     twoRight = twoLeft + pTwo.width;
     
     var inter = !(  twoLeft > oneRight ||
                      twoRight < oneLeft||
                    twoTop > oneBtm ||
                     twoBtm < oneTop);
     
     return inter;
     
 
     
   };
  
   var isColliding = function (p) {
     var overlap = false;
     
     for (var i = 0; i < players.length; i += 1) {
       if (p !== players[i]) {
         if (isOverlap(p, players[i])){
           overlap = overlap || [];
           overlap.push(players[i]);
         }
       }
     }
     if (overlap){
       overlap.unshift(p);
     }
     return overlap;
   };
   
   
   form.addEventListener("submit", function (event) {

      event.preventDefault();
      var src = playerImg.value;
      var player;
      switch (playerType.value) {
        case "regular":
          player = new Player(src);
          break;
        case "super":
          player = new SuperPlayer(src);
          break;
      }
      
      player.place();
      players.push(player);
      currentPlayer = player;
   });
  
   
  
   body.addEventListener("click", function (event) {
     var target = event.target;
     for (var i = 0; i < players.length; i += 1) {
       if (players[i].el === target) {
         currentPlayer = players[i];
       }
     }
   });
   
   var prevCollision;
   
   body.addEventListener("keydown", function (event) {
     
     if (prevCollision) {
       prevCollision.forEach(function (p) {
         p.uncollide();
       });
     }
     
     prevCollision = null;
     
     if (event.keyCode === 37) {
       currentPlayer.moveLeft();
     } else if (event.keyCode === 38) {
       currentPlayer.moveUp();
     } else if (event.keyCode === 39) {
       currentPlayer.moveRight();
     } else if (event.keyCode === 40) {
       currentPlayer.moveDown();
     }
     
     prevCollision = isColliding(currentPlayer);
     
     if (prevCollision) {
       prevCollision.forEach(function (p) {
          p.collide(prevCollision, currentPlayer);
       });
     } else {
       currentPlayer.drawPosition();
     }
     
   });
   
});


