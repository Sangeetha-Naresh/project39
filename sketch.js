var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, groundsGroup,sground;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;
var c=0;

function preload()
{
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
  
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup()
 {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-100,height-600,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1;
  
  trex = createSprite(100,height-70,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  trex.velocityX=6 + 3*score/100;
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,100,125);  
  invisibleGround.shapeColor = "red";
  //invisibleGround.visible=true;
  
  
 //ground = createSprite(width/2,height,width,2);
 //ground.addImage("ground",groundImage);
 //ground.x = width/2;
 //ground.velocityX = -6;

  sground = createSprite(width/2,height,width,2);
  sground.addImage("ground",groundImage);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  groundsGroup=new Group();
  
  score = 0;
}

function draw() 
{
  //trex.debug = true;
  background(backgroundImg);
  spawnGround() ;
  

  camera.position.x=trex.x;
  sun.x=camera.position.x+600;
  invisibleGround.x=camera.position.x;
  

  
  textSize(20);
  fill("black");
 
  text("Score: "+ score,camera.position.x-50,50);
  
  
  if (gameState===PLAY)
  {
   
      
   // spawnGround() ;
    
    score = score + Math.round(getFrameRate()/60);
  
   // ground.velocityX=-6;
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) 
    {
      jumpSound.play( );
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8

   // console.log("ground x: "+ ground.x);
    //console.log("width: "+ width);
  
   /* if (ground.x < (width/2)-1)
    {
          ground.x = ground.width/2;
    }*/
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END)
   {
  
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
   // ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX=0; 

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    groundsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    groundsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnGround() 
{

  //write code here to spawn the clouds
  if (frameCount % 200 === 0) 
  {
    var ground = createSprite(camera.position.x+600,height,width,2);
    ground.addImage("ground",groundImage);
    c=c+1;
    console.log("spawncount: "+c);
   
    
     //assign lifetime to the variable
    ground.lifetime = 600;
    
    //adjust the depth
    ground.depth = trex.depth;
    trex.depth = trex.depth+1;
    groundsGroup.add(ground);
  
  }
  
}
function spawnClouds() 
{
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) 
  {
    var cloud = createSprite(camera.position.x+600,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() 
{
  if(frameCount % 200=== 0) 
  {
    var obstacle = createSprite(camera.position.x+600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
   // obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand)
    {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}




function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  trex.velocityX=6 + 3*score/100;
  
}
