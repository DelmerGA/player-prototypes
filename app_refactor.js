function Animator (fps) {
  this.fps = fps;
  this.interval = 0 | (1000*1/this.fps);
  this.queue = [];
  this.items = [];
}

Animator.prototype.start = function () {
  var that = this;
  this.intId = setInterval(function () {
    var elapsed, item;
    while(that.queue.length) {
         item = that.queue.shift();
         that.clearCollisions();
         that.prevCollision = that.getCollisions(item);
         item.calcPosition();
         if (that.prevCollision && !item.collided) {
//            item.movePrev();
           that.runCollisions(item);
         } else  {
           item.drawPosition();
           item.ticks = 0;
         }
   
    }
    for (var i = 0; i < that.items.length; i++) {
      that.items[i].ticks = that.items[i].ticks + 1
      elapsed = that.items[i].ticks*that.interval;
      if (elapsed >= that.items[i].interval) {
        that.queue.push(that.items[i]);
      }
    }
  }, this.interval)
};

Animator.prototype.clearCollisions  = function () {
  if (this.prevCollision) { 
    this.prevCollision.forEach(function (p) {
      p.collided = false;
    });
  }
  this.prevCollision = null;
}

Animator.prototype.runCollisions = function (item) {
  var that = this;
  console.log(item);


item.ticks = 0;  this.prevCollision.forEach(function (p) {
    p.collide(item);
    p.calcPosition();
    p.drawPosition();
    
  });
  item.calcPosition();
  item.drawPosition();
  this.prevCollision = null;
  return this;
}

Animator.prototype.stop = function () {
  window.clearInterval(this.intId);
  return this;
}
Animator.prototype.add = function (obj) {
  obj.place();
  this.currentPlayer = obj;
  this.queue.push(obj);
  this.items.push(obj);
  return this;
}

Animator.prototype.remove = function (obj) {
  var index;
  index = this.queue.indexOf(obj);
  this.queue.splice(index, 1);
  index = this.items.indexOf(obj);
  this.items.splice(index, 1);
  return this;
};

Animator.prototype.selected = function (target) {
   for (var i = 0; i < this.items.length; i += 1) {
     if (this.items[i].el === target) {
       this.currentPlayer = this.items[i];
     }
   }
};

Animator.prototype.getCollisions = function (p) {
     var overlap = false;
     
     for (var i = 0; i < this.items.length; i += 1) {
       if (p !== this.items[i]) {
         if (p.isOverlap(this.items[i])){
           overlap = overlap || [];
           overlap.push(this.items[i]);
         }
       }
     }
     return overlap;
};

Animator.prototype.movePlayer = function (event) {
   if (event.keyCode === 37) {
     this.currentPlayer.moveLeft();
   } else if (event.keyCode === 38) {
     this.currentPlayer.moveUp();
   } else if (event.keyCode === 39) {
     this.currentPlayer.moveRight();
   } else if (event.keyCode === 40) {
     this.currentPlayer.moveDown();
   }
  return this;
};

function Player(src) {
  this.src = src;
  this.width = 50;
  this.increment = 0.001;
  this.height = 50;
  this.left = 0;
  this.top = 0;
  this.speedLeft = 0;
  this.speedTop = 0;
  this.prev = {};
  this.enabled = true;
  this.interval = 100;
  this.ticks = 0;
}

Player.prototype.stop = function () {
  this.speedLeft = 0;
  this.speedTop = 0;
  return this;
}

Player.prototype.place = function () {
  var el = document.createElement("img");
  el.style.backgroundColor = "rgb(0,0," + (0 |Math.random()*255) + ")";
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
   this.el.style.left = this.left + "px";
   this.el.style.top = this.top + "px";
  return this;
};
Player.prototype.calcPosition = function () {
   this.prev.left = this.left;
   this.prev.top = this.top;
   this.left = 0|(this.left + this.interval*this.speedLeft );
   this.top = 0|(this.top + this.interval*this.speedTop);
  return this;
}
Player.prototype.moveLeft = function () {
  if (this.enabled) {
    this.speedLeft += (- this.increment);
  }
  return this;
};

Player.prototype.moveRight = function () {
  if (this.enabled) {
    this.speedLeft += ( this.increment);
  }
  return this;
};

Player.prototype.moveUp = function () {
  if (this.enabled) {
    this.speedTop += ( -this.increment);
  }
  return this;
};
Player.prototype.moveDown = function () {
  if (this.enabled) {
    this.speedTop += ( this.increment);
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

Player.prototype.collide = function (collider) {
  this.drawPosition();
  this.el.style.boxShadow = "0px 0px 10px 10px rgba(255,0,0,1)";
  var left = this.speedLeft;
  var top = this.speedTop;
  this.speedLeft = collider.speedLeft;
  this.speedTop = collider.speedTop;
  collider.speedLeft = left;
  collider.speedTop = top;
  this.collided = true;
};

Player.prototype.uncollide = function () {
  this.el.style.boxShadow = "";
  this.collided = false;
};

Player.prototype.isOverlap = function (pTwo) {
     var pOne = this;
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



window.addEventListener("load", function () {
   var animator = new Animator(60);
   animator.start();

   var form = document.querySelector("#playerForm");
   var playerImg = document.querySelector("#playerImg");
   var playerType = document.querySelector("#playerType");
   var body = document.querySelector("body");
  
   form.addEventListener("submit", function (event) {

      event.preventDefault();
      var src = playerImg.value, player;
      switch (playerType.value) {
        case "regular":
          player = new Player(src);
          break;
      }
      animator.add(player);
   });
  
   body.addEventListener("click", function (event) {
      animator.selected(event.target);
   });
   
   
   body.addEventListener("keydown", function (event) {
     animator.movePlayer(event);
   });
   
});


