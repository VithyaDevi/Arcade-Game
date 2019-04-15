//Declaring modals
let startModal = document.querySelector(".start-game");
let gameOverModal = document.querySelector(".game-over");
let winnerModal = document.querySelector(".winner");
let overlay = document.querySelector(".overlay");


// points and player lives
var playerPoints = 0;


// start game function
function startGame(){
    startModal.classList.add("hide");
    overlay.classList.add("hide");
    playerPoints = 0;
}


//When player looses all the lives
function gameOver(){
    gameOverModal.classList.add("show");
    overlay.classList.add("show");
    reset(); //reset variables
}


//if all three lives are lost then game is over
function removeLives(){
    if(alllives.length === 0){
        gameOver();
    }
}


//reset variables
function reset() {
    playerPoints = 0;
}


// this function resets the game
function resetGame(){
    window.location.reload(true);
}


//When player wins the game
function winGame(){
    winnerModal.classList.add("show");
    overlay.classList.add("show");
}


//If player scored 500 points then he wins
function checkpoints(){
    if(playerPoints >= 500){
        winGame();
    }
}


function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + enemy.width + 15 &&  //collision bug changed
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y) {      
            player.y = 390; //player to start position
            alllives.pop(); //reduce lives
            if(playerPoints >= 50){
                playerPoints -= 50; //reduce score
            }   
        }
    });
    removeLives(); 
}


//random numbers
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.x = x; //x axis
    this.y = y; //y axis
    this.speed = getRandomInt(1, 5);
    this.width = 50;
    this.height = 85;
    this.image = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x > 600){
        this.x = -100;
    }
    else{
        this.x += 100 * this.speed * dt; 
    }
    checkCollisions();
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y){
    this.image = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.height = 85;
    this.width = 50;
};



Player.prototype.update = function(dt){
    return this.y;
    //playerX = this.x;
    //playerY =  this.y;
};


Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};


Player.prototype.handleInput = function(keyPress){
    if(keyPress == 'left' && this.x > 33){ //condition restricts player going outside the play area
        this.x -= 100;
    }
    if(keyPress == 'right' && this.x < 400){
        this.x += 100;
    }
    if(keyPress == 'up' && this.y > -35){
        this.y -= 85;
    }
    if(keyPress == 'down' && this.y < 390){
        this.y += 85;
    }
    if(this.y < 0){ //reset player again from the beginning
        setTimeout(function(){
            player.x = 202;
            player.y = 405;
            playerPoints += 100; //increase score if player reaches the water
            checkpoints();
        }, 600);
    }
    
};


// class to give player points
var Points = function(x, y, score){
this.x = x;
this.y = y;
this.score = "Player Score: "+ playerPoints;
}

Points.prototype.render = function(){
ctx.font = '20px serif';
ctx.fillText(this.score, this.x, this.y);
}

Points.prototype.update = function(){
this.score = "Player Score: " + playerPoints;
}


// class to give Lives
var Lives = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
};

// render method for Lives class
Lives.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 28, 42);
}


// Selecting the Player characters
const characterImages = document.querySelectorAll(".char-image");
for(let i = 0; i < characterImages.length; i++) {
    // Set the default Character Image
    characterImages[0].classList.add("active");

    characterImages[i].addEventListener("click", function() {
        // Change the player image
        player.image = this.getAttribute("data-image");
        // Remove class `active` from all character images
        characterImages.forEach(function(image) {
            image.classList.remove("active");
    })
    // Add class `active` to the selected character image
    this.classList.add("active");
    });
}


// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
var enemy_1 = new Enemy(0, 50);
var enemy_2 = new Enemy(-100, 50);
var enemy_3 = new Enemy(-150, 135);
var enemy_4 = new Enemy(-300, 220);
var enemy_5 = new Enemy(-400, 220);
const allEnemies = [enemy_1, enemy_2, enemy_3, enemy_4, enemy_5];

// Place the player object in a variable called player
var player = new Player(202, 390);

//Place the points object in a variable called points
var points = new Points(350, 570);

// instantiate lives
var alllives = [new Lives(10, 540), new Lives(40, 540), new Lives(70, 540)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
