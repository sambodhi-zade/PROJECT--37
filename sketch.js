//Create variables here
var dog,dogImg,happyDogImg,database,foodS,foodStockRef,database;
var frameCountNow = 0;
var fedTime, lastFed, feed, addFood,foodObj,currentTime;
var milk,input,name;
var gameState = "hungry";
var gameStateRef;
var bedroomImg,gardenImg,runImg,washroomImg,sleepImg;
var feed,addFood;
var input,button;
var hungryDog;


function preload(){
	//load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
  bedroomImg = loadImage("Bed Room.png");
  gardenImg = loadImage("Garden.png");
  washroomImg = loadImage("Wash Room.png");
  sleepImg = loadImage("Lazy.png");
  runImg = loadImage("running.png");
  hungryDog = loadImage("images/dogImg1.png");   
  livingRoom=loadImage("Living Room.png");
}


function setup() {
  createCanvas(1200,500);
   database= firebase.database();
  
  foodObj = new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy", happyDogImg);
  dog.addAnimation("sleeping",sleepImg);
  dog.addAnimation("run",runImg);
  dog.scale = 0.3;

  getGameState();

  feed=createButton("Feed the dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addFoods);

  input = createInput("Pet Name");
  input.position(950,120);
  
  button = createButton("Done");
  button.position(1000,145);
  button.mousePressed(createName);

}

function draw() {   
  currentTime = hour();
  if(currentTime === (lastFed + 1)){
   gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  
  else if(currentTime === (lastFed + 2)){
  gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
   gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }else{
    gameState = "hungry";
    updateGameState();
    foodObj.display();

  }
  
  foodObj.getFoodStock();
  getGameState();

  fedTime = database.ref('FeedTime')
  fedTime.on("value", function (data){
  lastFed = data.val();
})

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addImage("hungry", hungryDog);
    
  }
  else{
    feed.hide();
    addFood.hide();
    dog.remove();
  
  }

    drawSprites();


    fill("red");
    textSize(20);
    text("Last Fed: "+lastFed+":00",300,40);

    fill("red");
    textSize(20);
    text("Time Since last fed: "+(currentTime - lastFed),300,125);
    
}

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
    dog.addImage("happy", happyDogImg);
    gameState="happy";
    updateGameState();
  }

//function to add food in stock
function addFoods(){
foodObj.addFood();
foodObj.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("Pet's Name: "+ name);
  greetin.position(width/2+850,height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState  = data.val();
  })
}

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
  })
}
