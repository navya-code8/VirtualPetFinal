
var dog, happyDog, database, foodS, foodStock;
var dogImg, happyDogImg;
var ground;
var gameState = "play"
var feedDog, feed, addFood
var fedTime, lastFed;
var foodObj;
var currentTime;
var changingGameState, readingGameState, bedroomImg, gardenImg, washroomImg;


function preload()
{
  dogImg = loadAnimation("dogImg.png")
  happyDogImg = loadAnimation("dogImg1.png")
  bedroomImg = loadImage("Bed Room.png")
  gardenImg = loadImage("Garden.png")
  washroomImg = loadImage("Wash Room.png")
}


function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  
  ground = createSprite(250,480, 500, 40)
  ground.shapeColor = "Gainsboro"

  dog = createSprite(250,400, 100, 100);
  dog.addAnimation("dog", dogImg);
  dog.addAnimation("happydog", happyDogImg)
  dog.scale = 0.25

  foodStock=database.ref('food'); 
  foodStock.on("value",readStock); 

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val()
  })

  foodObj = new Food()

  feed = createButton("Feed the dog")
  feed.position(650,95);
  feed.mousePressed(feedDog)

  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods)



}


function draw() {  
  background("skyblue");

  drawSprites();
  if (foodS === 0){
    gameState = "end";
    
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val()
  });

  fill(255,255,254);
  textSize(15)
  if(lastFed>=12){
    text("Last Feed : "+lastFed + " PM", 350,30)
  }else if(lastFed===0){
    text("LastFed : 12 AM", 350, 30);
  }else {
    text("Last Feed : "+lastFed + " AM", 350, 30)
  }

  if(foodS <= 0){
    text("Uh-oh... you don't have any food!", 20, 30 )
    dog.changeAnimation("dog",dogImg)
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    //dog.remove();
  }else{
    feed.show();
    addFood.show;
    //add sad dog image
  }

  currentTime=hour();
  if(currentTime ===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }
  
  foodObj.display()

}

function readStock(data){
  foodS = data.val();
  console.log(data.val())
}

function writeStock(x){

  if(x<=0){
    x=0
  }

  else{
    x=x-1
  }


  database.ref('/').update({
    food:x
  })

 
}

function feedDog(){
  if(foodS>0){
    foodS-=1
    dog.changeAnimation("happydog",happyDogImg)
    foodObj.changeFood()
    database.ref('/').update({
      food:foodS,
      FeedTime:hour()
    })
  }

}

function addFoods(){

  foodS++;
  dog.changeAnimation("dog",dogImg)
  foodObj.changeFood()
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}