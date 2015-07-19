//Current Version 0.1.07.2(Development)，next version will add agent status track command.
/*
Version 0.1.00 Only map load and Sprites with tiles load;
Version 0.1.01 add test object into map;
Version 0.1.04 1.change Bots control methods 2.add laser scan in Bot skill 3.the laser scan will return signal and object
Gray level information into sensor information(Only Demo code for Gray level images,not real one)
Version 0.1.06 1.allow Lories part can change the Bot speed 2.Make sure the portal hit event will not return 1,should return 2
Version 0.1.06.1 Fixed the Bot Speed Bug,the Bot will not too fast when go right/down.
Version 0.1.06.2 add other scan sensor, 90degree scan by using x
Version 0.1.07.2 1.add agent self status check command, when the agent send Check_Body type command,it should return related
information,e.g. Stand_up,Stand_left,Stand_right,Stand_down,Go_up,Go_down,Go_left,Go_right,tec.
Next Version Development Plan:
Version 0.1.
Version 0.1.10.2 1.add photo graph display screen for human image classification 2.add some simple action into this game for
object take event 3.add agent self object track command.(more details about them will be list later,after we finished the
Version 0.1.07.2)
-more information about how to read and using this code, please waiting for our release version and the final development
Documents
*/
window.addEventListener("load",function() {

  var Q = window.Q = Quintus({ development: true, audioSupported: [ 'wav','mp3','ogg' ] })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio")
    .setup("slidermap",{ maximize: true }).controls(true).touch().enableSound();;

  Q.input.keyboardControls();
  Q.input.joypadControls();

  Q.gravityY = 0;
  Q.gravityX = 0;

  var SPRITE_PLAYER = 1;
  var SPRITE_TILES = 2;
  var SPRITE_ENEMY = 4;
  //test code here
  var SPRITE_GRA = 7;
  //
  var SPRITE_DOT = 8;
  var SPRITE_PBULLET = 16;
  var SPRITE_FLOOR = 32;
  var SPRITE_STAIRS = 64;
  var SPRITE_ROUTE= 128;
  //var Route = 0;
  var col_bullet = true;
  var cte=0;
  //act type command for agent self status check
  var act=0;
  //test code,tag is used to stop agent or continue going,speed_ here set as 85(default)
  var tag=1;
  //the speed will change in version 0.106, the code may delete later.!Please do not change this code until we have first
  //stable version!
  //var speed_=85;
  // People
  Q.Sprite.extend("Player", {
    init: function(p, sheetplayer) {
      this._super(p,{
        sheet: "player",
        sprite: "player",
        stepDelay: 0.2,  // seconds to delay before next step,Can we allow Bot AI can change his stepdelay?
        type: SPRITE_PLAYER,
        collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT | SPRITE_ROUTE,//| Route,
        speed: 85,//ignore it.
        score:0
      });
      Q.input.on("action",this,function(){
        //document.getElementById("myTextarea").value="777";
        document.getElementById("myTextarea").value="9";
        var xx = this.p.x , yy = this.p.y, vvx = this.p.vx, vvy = this.p.vy;
        /*if(this.p.direction=='left'){ xx -=8;  } else
        if(this.p.direction=='right'){ xx +=8; } else
        if(this.p.direction=='up'){yy -=15;xx-=1;} else
        if(this.p.direction=='down'){yy +=15;}*/
        //var cox=parseInt(xx/32,10);
        //var coy=parseInt(yy/32,10);
        //this.stage.insert( new Q.Bird({x: cox*32, y: coy*32, scale: 1} ) );
        //if()
        /*this.stage.insert(new Q.Bird({x: xx, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx, y: yy-32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.2,direction: this.p.direction}));*/
        if(this.p.direction=='left'){
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.1,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='right'){
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.1,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='up'){
          //this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx, y: yy-32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.1,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='down'){
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx, y: yy+32, scale: 0.1,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.1,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy+64, scale: 0.2,direction: this.p.direction}));
        }

      });
      this.p.sheet = sheetplayer;
      this.add("2d, animation");
      //this is keyboard control, fire command for manual control;
      Q.input.on("fire", this, function(){
        document.getElementById("myTextarea").value="0";
        var xx = this.p.x , yy = this.p.y, vvx = this.p.vx, vvy = this.p.vy;
        /*if(this.p.direction=='left'){ xx -=8; } else
        if(this.p.direction=='right'){ xx +=8; } else
        if(this.p.direction=='up'){yy -=15;xx-=1;} else
        if(this.p.direction=='down'){yy +=15;}*/
        //
        /*var _tools_and_equipment2 = [
            [xx,yy+32],[xx,yy],[xx,yy-32],
            [xx-32,yy+32],[xx-32,yy],[xx-32,yy-32],
            [xx-64,yy+32],[xx-64,yy],[xx-64,yy-32]
        ];*/
        //
        if(this.p.direction=='left'){ xx -=8;  } else
        if(this.p.direction=='right'){ xx +=8; } else
        if(this.p.direction=='up'){yy -=15;xx-=1;} else
        if(this.p.direction=='down'){yy +=15;}
        if(col_bullet){
          this.stage.insert(
            new Q.Bullet({
              type: SPRITE_PBULLET,
              direction: this.p.direction,
              x: xx,
              y: yy,
              speed: 150,
              collisionMask: SPRITE_ENEMY | SPRITE_TILES //| SPRITE_STAIRS //| SPRITE_ROUTE
            })
          );
          col_bullet=true;//false;
          //

          /*for(var i2 = 0 ; i2 < _tools_and_equipment2.length; i2++){
              this.stage.insert( new Q.Coin( Q.tilePos(_tools_and_equipment2[i2][0],_tools_and_equipment2[i2][1]) ) );
          }*/
        }
        //
      });
      //hit event,
      this.on("hit.sprite",function(collision) {
        if(collision.obj.isA("Portal")) {
          var portal = collision.obj;
          this.destroy();
          Q.stageScene("endLevel",1, { label: portal.nextLevel });
        }
        else if(collision.obj.isA("Enemy")){
          Q.audio.play('Game_Over.mp3',{loop:false});
          this.destroy();
          var lvl = new Q.stage();
          Q.stageScene("endLevel",1, { label: lvl.scene.name });
        }
      });
    },
    // step function, add your control command here for auto control,by using cte/x command;
    step: function(dt){
      //version 0.107
      var y = document.getElementById("myInput3").value;
      if(y == "v") act=1;
 	    if (act==1&&this.p.vx > 0) document.getElementById("myTextarea1").value = "walk-right";
 	    else if (act==1&&this.p.vx < 0) document.getElementById("myTextarea1").value = "walk-left";
      else if (act==1&&this.p.vy > 0) document.getElementById("myTextarea1").value = "walk-down";
      else if (act==1&&this.p.vy < 0) document.getElementById("myTextarea1").value = "walk-up";
      else if (act==1&&this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "left")
 		document.getElementById("myTextarea1").value = "stand-left";
      else if (act==1&&this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "right")
 		document.getElementById("myTextarea1").value = "stand-right";
      else if (act==1&&this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "down")
 		document.getElementById("myTextarea1").value = "stand-down";
 	    else if (act==1&&this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "up")
 		document.getElementById("myTextarea1").value = "stand-up";

      //please add speed change code here for version 0.106, using myInput2 to get the element;
      var num=document.getElementById("myInput2").value;
      //test code,for debug purpose;
      //document.getElementById("demo").innerHTML = "You wrote: " + isNaN(parseInt(num,10));;
      if(isNaN(parseInt(num,10))==false){
        //document.getElementById("demo").innerHTML = "You wrote: " + num;
        speed_=parseInt(num,10);
        //else speed_=20;
      }
      else {
        speed_=85;//default speed
      }
      //
      var x = document.getElementById("myInput").value;
      //document.getElementById("demo").innerHTML = "You wrote: " + x;
      if(x=="u")cte=1;
      if(x=="d")cte=2;
      if(x=="l")cte=3;
      if(x=="r")cte=4;
      //
      if(x=="s")cte=5;
      if(x=="o")cte=6;
      //q here means stop;
      if(x=='q')tag=0;
      //g here means go continue;
      if(x=='g')tag=1;
      if(tag==0)speed_=0;
      if(tag==1)speed_=speed_;//85;
      document.getElementById("myInput").value="";

      if(this.p.vx > 0) { this.play("walk_right"); }
      else if(this.p.vx < 0) { this.play("walk_left"); }
      else if(this.p.vy > 0) { this.play("walk_down"); }
      else if(this.p.vy < 0) { this.play("walk_up"); }
      else if(this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "left"){ this.play("stand_left"); }
      else if(this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "right"){ this.play("stand_right"); }
      else if(this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "down"){ this.play("stand_down"); }
      else if(this.p.vx == 0 && this.p.vy == 0 && this.p.direction == "up"){ this.play("stand_up"); }


      this.p.direction = Q.inputs['left'] || cte==3 ? 'left' : Q.inputs['right'] || cte==4 ? 'right' :
        Q.inputs['up'] || cte==1  ? 'up'   : Q.inputs['down'] || cte==2 ? 'down'  : this.p.direction;
      //test code add here; it used to control agent speed, only cte type command and q input command can make speed=85,else 0
      //remove it! stop using q, continue using g!
      /*speed_ = Q.inputs['left'] || cte==3 ? 85 : Q.inputs['right'] || cte==4 ? 85 :
        Q.inputs['up'] || cte==1  ? 85   : Q.inputs['down'] || cte==2 ? 85  : 0;*/
      //this code is for laser scan by command line input
      if(cte==5){
          this.p.speed=0;
          document.getElementById("myTextarea").value="0";
          var xx = this.p.x , yy = this.p.y, vvx = this.p.vx, vvy = this.p.vy;
          /*if(this.p.direction=='left'){ xx -=8; } else
          if(this.p.direction=='right'){ xx +=8; } else
          if(this.p.direction=='up'){yy -=15;xx-=1;} else
          if(this.p.direction=='down'){yy +=15;}*/
          if(this.p.direction=='left'){ xx -=8; } else
          if(this.p.direction=='right'){ xx +=8; } else
          if(this.p.direction=='up'){yy -=15;xx-=1;} else
          if(this.p.direction=='down'){yy +=15;}
          if(col_bullet){
            this.stage.insert(
              new Q.Bullet({
                type: SPRITE_PBULLET,
                direction: this.p.direction,
                x: xx,
                y: yy,
                speed: 150,
                collisionMask: SPRITE_ENEMY | SPRITE_TILES //| SPRITE_STAIRS //| SPRITE_ROUTE
              })
            );
            col_bullet=true;//false;
          }
      }
      if(cte==6){
        document.getElementById("myTextarea").value="9";
        var xx = this.p.x , yy = this.p.y, vvx = this.p.vx, vvy = this.p.vy;
        if(this.p.direction=='left'){ xx -=8;  } else
        if(this.p.direction=='right'){ xx +=8; } else
        if(this.p.direction=='up'){yy -=15;xx-=1;} else
        if(this.p.direction=='down'){yy +=15;}
        //var cox=parseInt(xx/32,10);
        //var coy=parseInt(yy/32,10);
        //this.stage.insert( new Q.Bird({x: cox*32, y: coy*32, scale: 1} ) );
        //if()
        /*this.stage.insert(new Q.Bird({x: xx, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx, y: yy-32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy, scale: 0.2,direction: this.p.direction}));
        this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.2,direction: this.p.direction}));*/
        if(this.p.direction=='left'){
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='right'){
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='up'){
          //this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx, y: yy-32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy-32, scale: 0.2,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy-64, scale: 0.2,direction: this.p.direction}));
        }
        if(this.p.direction=='down'){
          //this.stage.insert(new Q.Bird({x: xx-64, y: yy+64, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx-32, y: yy+32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx, y: yy+32, scale: 0.2,direction: this.p.direction}));
          this.stage.insert(new Q.Bird({x: xx+32, y: yy+32, scale: 0.2,direction: this.p.direction}));
          //this.stage.insert(new Q.Bird({x: xx+64, y: yy+64, scale: 0.2,direction: this.p.direction}));
        }
      }
      //
      //cte=0;
      switch(this.p.direction) {
        /*case "left":  this.p.vx = -this.p.speed; break;
        case "right": this.p.vx = this.p.speed; break;
        case "up":    this.p.vy = -this.p.speed; break;
        case "down":  this.p.vy = this.p.speed; break;*/
        case "left":  {
          this.p.speed=speed_;
          this.p.vx = -this.p.speed;
          //this.p.x-=4;
          break;
        }
        case "right": {
          this.p.speed=speed_;
          this.p.vx = this.p.speed;
          //this.p.x+=4
          break;
        }
        case "up":    {
          this.p.speed=speed_;
          this.p.vy = -this.p.speed;
          //this.p.y-=4
          break;
        }
        case "down":  {
          this.p.speed=speed_;
          this.p.vy = this.p.speed;
          //document.getElementById("demo").innerHTML = "You wrote: " + this.p.speed;
          //this.p.y+=4
          break;
        }
      }
      //add test code here,CTE command should set 0 after we used it.
      cte=0;
      act=0;
      speed_=0;
    }
  });
  //add test code here, later we should change it to object class, can add related event here.
  Q.Sprite.extend("Coin",{
    init: function(p) {
        this._super(p, {
            asset:"equip_0.gif"});
    }

  });
  //
  //change Bird name,please.Camera,360degree?
  Q.Sprite.extend("Bird", {
    init: function(p) {
        //sprite: "equipment",
        this._super(p, {type: SPRITE_PBULLET,asset: "equip_0.gif",collisionMask:SPRITE_TILES,direction: 'left',
        speed: 150,
      });//collisionMask:SPRITE_TILES
    //}
    this.add("2d");
    this.on("hit.sprite",function(collision)
    {
        //if(collision.obj.isA("Coin")){
          //this.destroy();
          //document.getElementById("myTextarea").value="24";
        //}
        /*if(collision.obj.isA("Coin"))
        {
            //demo code, we should change it can load images RGB or Gray level matrix.
            this.destroy();
        }
        //please add portal hit event here, we should make the laser hit with portal not return 1, it should return 2.
        //add your code here for version 0.106 portal event change.
        //
        if(collision.obj.isA("Portal"))
        {
          document.getElementById("myTextarea").value="2";
        }*/
    });
    this.on("hit",function(){
        document.getElementById("myTextarea").value+="1";
        this.destroy();
      });
    },
      hit: function(){
        /*if(this.p.direction=="left"){
          this.p.angle=-180;
          this.p.direction='right';
        }*/
        this.destroy();
      },
      step: function (dt) {
        if(this.p.direction == "left") {
          this.p.angle = 0;
        } else if(this.p.direction == "right") {
          this.p.angle = -180;
        } else if(this.p.direction == "up") {
          this.p.angle = 90;
        } else if(this.p.direction == "down") {
          this.p.angle = -90;
        }
        switch(this.p.direction) {
          case "left":  this.p.vx = -this.p.speed;  break;
          case "right": this.p.vx = this.p.speed; break;
          case "up":    this.p.vy = -this.p.speed; break;
          case "down":  this.p.vy = this.p.speed; break;
        }
      },
  });
  //
  /*Q.Sprite.extend("Jedi", {
    init: function(p) {
        //sprite: "equipment",
        this._super(p, {
          asset: "equip_0.gif",
          type: SPRITE_PBULLET,
          collisionMask: SPRITE_ENEMY | SPRITE_TILES
        });
        this.add("2d");
        this.on("hit.sprite",function(collision)
        {
            if(collision.obj.isA("Coin"))
            {
                //demo code, we should change it can load images RGB or Gray level matrix.
                document.getElementById("myTextarea").value="100011010101010101"+
                                                          "\n011000111101001001"+
                                                          "\n010010111101001001"+
                                                          "\n010010111101001001"+
                                                          "\n000010110111001001"+
                                                          "\n000010110101101001"+
                                                          "\n000010110101101001";
            }
            if(collision.obj.isA("Portal"))
            {
              document.getElementById("myTextarea").value="2";
            }
        });
    }
    hit: function(){
      this.destroy();
    }
    //this.add("2d");
  });*/
  //Agent Laser Sensor,laser scan
  /*Q.Sprite.extend("Laser",{
    init:function(p){
      this._super(p,{

      })
    }
  });*/
  //later, we should add new camera sensor here for image classification purpose.
  //
  //change this code to laser skill/sensor, laser scan
  Q.Sprite.extend("Bullet", {
    init: function (p) {
      this._super(p, {
        type: SPRITE_PBULLET,
        sheet: 'laser14',//'fire',
        direction: 'left',
        speed: 150,
        collisionMask: SPRITE_ENEMY | SPRITE_TILES //| SPRITE_STAIRS
      });
      this.add("2d");
      this.on("hit.sprite",function(collision) { if(collision.obj.isA("Enemy")) { this.destroy(); col_bullet=true; } });
      //add test code here, for return object RGB information with noise input
      this.on("hit.sprite",function(collision)
      {
          if(collision.obj.isA("Coin"))
          {
              //demo code, we should change it can load images RGB or Gray level matrix.
              document.getElementById("myTextarea2").value="100011010101010101"+
                                                        "\n011000111101001001"+
                                                        "\n010010111101001001"+
                                                        "\n010010111101001001"+
                                                        "\n000010110111001001"+
                                                        "\n000010110101101001"+
                                                        "\n000010110101101001";
          }
          //please add portal hit event here, we should make the laser hit with portal not return 1, it should return 2.
          //add your code here for version 0.106 portal event change.
          //
          if(collision.obj.isA("Portal"))
          {
            document.getElementById("myTextarea").value+="2";
          }
      });
      //the laser hit the wall, change it to return back, and when bot receive the signal, display 1.
      this.on("hit",function(){
          this.destroy();
          //later we should change the destroy event at the laser animation hit with Bot,not the wall.
          //the DEV should using their own methods to calculate the distance between Bot and wall
          document.getElementById("myTextarea").value+="1";
          col_bullet=true;
        });
      //
    },
    step: function (dt) {
      if(this.p.direction == "left") {
        this.p.angle = 0;
      } else if(this.p.direction == "right") {
        this.p.angle = -180;
      } else if(this.p.direction == "up") {
        this.p.angle = 90;
      } else if(this.p.direction == "down") {
        this.p.angle = -90;
      }
      switch(this.p.direction) {
        case "left":  this.p.vx = -this.p.speed;  break;
        case "right": this.p.vx = this.p.speed; break;
        case "up":    this.p.vy = -this.p.speed; break;
        case "down":  this.p.vy = this.p.speed; break;
      }
    },
    hit: function(){
      /*if(this.p.direction=="left"){
        this.p.angle=-180;
        this.p.direction='right';
      }*/
      this.destroy();
    }
  });
  //-45 degree and 45 degree
  //Problem need solve
  //Later should change the laser can move a set degree for hall environment scan
  //
  //the enemy control can delete later,Attention!Don't remove it at this version.
  Q.Sprite.extend("Enemy", {
    init: function(p) {
      this._super(p,{
        sprite: "enemy",
        sheet:"enemy",
        type: SPRITE_ENEMY,
        collisionMask: SPRITE_PLAYER | SPRITE_TILES | SPRITE_PBULLET | SPRITE_STAIRS,
        edestroy: true//false
      });
      this.add("2d, enemyControls, animation");
      this.on("hit.sprite",function(collision) {
        this.on("died", this, "playDead");
        if(collision.obj.isA("Bullet")){
          //Q.audio.play('fire.mp3');
          this.play("die");
          this.p.edestroy = true;
        }
      });
    }, playDead: function () {
      this.destroy();
    }
  });
  Q.component("enemyControls", {
    defaults: { speed: 95, direction: 'left', switchPercent: 8 },
    added: function() {
      var p = this.entity.p;
      Q._defaults(p,this.defaults);
      this.entity.on("step",this,"step");
      this.entity.on('hit',this,"changeDirection");
    },
    step: function(dt) {
      var p = this.entity.p;
      if(!p.edestroy){
        if(Math.random() < p.switchPercent / 100) { this.tryDirection(); }
        switch(p.direction) {
          case "left": p.vx = -p.speed; this.entity.play("walk_left"); break;
          case "right":p.vx = p.speed; this.entity.play("walk_right"); break;
          case "up":   p.vy = -p.speed; this.entity.play("walk_up"); break;
          case "down": p.vy = p.speed; this.entity.play("walk_down"); break;
        }
      }else {
        p.vx=0;p.vy=0;
      }
    },
    tryDirection: function() {
      var p = this.entity.p;
      if(p.vy != 0 && p.vx == 0) {
        p.direction = Math.random() < 0.5 ? 'left' : 'right';
      } else if(p.vx != 0 && p.vy == 0) {
        p.direction = Math.random() < 0.5 ? 'up' : 'down';
      }
    },
    changeDirection: function(collision) {
      var p = this.entity.p;
      if(p.vx == 0 && p.vy == 0) {
        if(collision.normalY) {
          p.direction = Math.random() < 0.5 ? 'left' : 'right';
        } else if(collision.normalX) {
          p.direction = Math.random() < 0.5 ? 'up' : 'down';
        }
      }
    }
  });

  //it should used to change room, we can edit this code, and using those methods for room changing
  Q.Sprite.extend("Portal", {
    init: function(p, nextLevel,sheetPortal) {
      this._super(p, {
        sheet: 'portal'
      });
      this.nextLevel = nextLevel;
      this.p.sheet = sheetPortal;
    }
  });

  //Map
  Q.tilePos = function(col,row) {
    return { x: col*32 + 16, y: row*32 + 16 };
  }
  //draw map
  //test code add here, add your new object here!
  Q.Sprite.extend("Room",{ init: function(p) { this._super(p, {type: SPRITE_ROUTE, sheet:'Route' }); } });
  Q.Sprite.extend("Grass", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'grass' }); } });
  // do not change the code as below
  Q.Sprite.extend("Floor", { init: function(p) { this._super(p, { type: SPRITE_FLOOR, sheet: 'floor' }); } });
  Q.Sprite.extend("Floor1", { init: function(p) { this._super(p, { type: SPRITE_FLOOR, sheet: 'floor1' }); } });
  Q.Sprite.extend("Floor2", { init: function(p) { this._super(p, { type: SPRITE_FLOOR, sheet: 'floor2' }); } });
  Q.Sprite.extend("Ice1", { init: function(p) { this._super(p, { type: SPRITE_FLOOR, sheet: 'ice1' }); } });
  Q.Sprite.extend("Ice2", { init: function(p) { this._super(p, { type: SPRITE_FLOOR, sheet: 'ice2' }); } });
  Q.Sprite.extend("Icestep", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'icestep' }); } });
  Q.Sprite.extend("Greenstep", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'greenstep' }); } });
  Q.Sprite.extend("bed1", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'bed1' }); } });
  Q.Sprite.extend("bed2", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'bed2' }); } });
  Q.Sprite.extend("table", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'table' }); } });
  Q.Sprite.extend("tub", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'tub' }); } });
  Q.Sprite.extend("toilet", { init: function(p) { this._super(p, { type: SPRITE_STAIRS, sheet: 'toilet' }); } });
  Q.TileLayer.extend("SoldierMap",{
    init: function(p) {
      this._super(p,{
        type: SPRITE_TILES,
        //test code add here
        dataAsset: 'level0.json',
        sheet:     'tiles320_32'
        //dataAsset: 'level.json',
        //sheet:     'tiles'
      });
    },
    setup: function() {
      var tiles = this.p.tiles = this.p.tiles.concat();
      var size = this.p.tileW;
      for(var y=0;y<tiles.length;y++) {
        var row = tiles[y] = tiles[y].concat();
        for(var x =0;x<row.length;x++) {
          var tile = row[x];
          var className, _step;
          if(tile == 0) {
            if(this.p.sheet == "tiles320_32") {floor = "Room"}
            //else if(this.p.sheet == "tiles320_32" && tile == 7) {floor = "Glass"}
            //test code else add here
            else if(this.p.sheet == "tiles"){ floor = "Floor"}
            else if(this.p.sheet == "tiles1") { floor = "Floor1"}
            else if(this.p.sheet == "tiles2") { floor = "Floor2"}
            //test code here
            //else if(this.p.sheet == "tiles320_32") { floor = ""}
            //
            this.stage.insert(new Q[floor](Q.tilePos(x,y)));
            //if(tile==0)row[x] = 0;
            //else row[x]=7;
            row[x] = 0;
          }else if(tile == 98 || tile == 97) {
            className = tile == 97 ? "Ice1" : "Ice2";
            this.stage.insert(new Q[className](Q.tilePos(x,y)));
            row[x] = 0;
          }else if(tile == 95) {
            if(this.p.sheet == "tiles1") { _step = "Icestep"}
            else if(this.p.sheet == "tiles2") { _step = "Greenstep"}
            this.stage.insert(new Q[_step](Q.tilePos(x,y)));
            row[x] = 0;
          }
          //add test code here,
          else if(tile == 7){
            _step = "Grass"
            this.stage.insert(new Q[_step](Q.tilePos(x,y)));
            row[x] = 0;
          }
          else if(tile == 125 || tile == 126){
            className = tile ==125?  "bed1":"bed2";
            this.stage.insert(new Q[className](Q.tilePos(x,y)));
            row[x] = 0;
          }
          else if(tile == 123 || tile == 124){
            className = tile ==123?  "tub":"toilet";
            this.stage.insert(new Q[className](Q.tilePos(x,y)));
            row[x] = 0;
          }
        }
      }
    }
  });

  //test map here, show in level4
  Q.scene("Nivel 0",function(stage) {
    stage.insert(new Q.Repeater({ asset: "bg-nivel1.png"}));
    var mp = stage.collisionLayer(new Q.SoldierMap({
      type: SPRITE_TILES,
      dataAsset: 'level0.json',
      sheet:     'tiles320_32'
    }));
    mp.setup();
    //var _enemy = [
      // set none enemy here
      //[4,8],[8,8],[2,12],[11,13],[3,20],[9,20],[17,2],[26,2],[17,19]//,
      //[26,19],[16,10],[26,10],[31,8],[35,8],[31,12],[35,12]
    //];
    var _tools_and_equipment = [
        [3,1],[4,4],[8,1],[12,1],[11,7],[2,14],[27,18]
    ];
    var player = new Q.Player(Q.tilePos(6,1),"player1");
    stage.add("viewport").follow(stage.insert(player));
    //for( var i = 0 ; i < _enemy.length; i++ ){
      //stage.insert( new Q.Enemy( Q.tilePos(_enemy[i][0],_enemy[i][1]) ) );
      //stage.insert( new Q.Coin( Q.tilePos(_enemy[i][0],_enemy[i][1]) ) );
    //}
    for(var i = 0 ; i < _tools_and_equipment.length; i++){
        stage.insert( new Q.Coin( Q.tilePos(_tools_and_equipment[i][0],_tools_and_equipment[i][1]) ) );
    }
    //stage.insert( new Q.Coin( Q.tilePos(21,18) ) );
    //room change event, add your room change event here.(two example demo code add here)
    stage.insert(new Q.Portal(Q.tilePos(21,19),"Nivel 0","portal"));
    stage.insert(new Q.Portal(Q.tilePos(22,19),"Nivel 0","portal"));
    stage.insert(new Q.Portal(Q.tilePos(28,0),"Nivel 0","portal"));
    stage.insert(new Q.Portal(Q.tilePos(27,0),"Nivel 0","portal"));
    stage.insert(new Q.Portal(Q.tilePos(26,0),"Nivel 0","portal"));
    // Q.audio.play('intro.mp3',{ loop: true });
  });

  Q.scene("Nivel 1",function(stage) {
    stage.insert(new Q.Repeater({ asset: "bg-nivel3.png"}));
    var mp = stage.collisionLayer(new Q.SoldierMap({
      type: SPRITE_TILES,
      dataAsset: 'level2.json',
      sheet:     'tiles2'
    }));
    mp.setup();
    var _enemy = [
      //none enemy here,test
      //[4,1],[19,1],[5,6],[5,9],[5,13],[18,6],[18,9],
      //[18,13],[6,20],[10,20],[13,20],[17,20],[6,26],[18,26]
    ];
    var player = new Q.Player(Q.tilePos(12,2),"player2");
    for( var i = 0 ; i < _enemy.length; i++ ){
      stage.insert( new Q.Enemy( Q.tilePos(_enemy[i][0],_enemy[i][1]) ) );
    }
    stage.add("viewport").follow(stage.insert(player));
    stage.insert(new Q.Portal(Q.tilePos(11,30),"Nivel 2","portal2"));
    // Q.audio.play('intro.mp3',{ loop: true });
  });
  Q.scene("Nivel 2",function(stage) {
    stage.insert(new Q.Repeater({ asset: "bg-nivel1.png"}));
    var mp = stage.collisionLayer(new Q.SoldierMap({
      type: SPRITE_TILES,
      dataAsset: 'level1.json',
      sheet:     'tiles'
    }));
    mp.setup();
    var _enemy = [
      //none enemy here,test
      //[4,8],[8,8],[2,12],[11,13],[3,20],[9,20],[17,2],[26,2],[17,19],
      //[26,19],[16,10],[26,10],[31,8],[35,8],[31,12],[35,12]
    ];
    var player = new Q.Player(Q.tilePos(6,1),"player1");
    stage.add("viewport").follow(stage.insert(player));
    for( var i = 0 ; i < _enemy.length; i++ ){
      stage.insert( new Q.Enemy( Q.tilePos(_enemy[i][0],_enemy[i][1]) ) );
    }
    stage.insert(new Q.Portal(Q.tilePos(33,17),"Nivel 3","portal"));
    // Q.audio.play('intro.mp3',{ loop: true });
  });
  Q.scene("Nivel 3",function(stage) {
    stage.insert(new Q.Repeater({ asset: "bg-nivel2.png"}));
    var mp = stage.collisionLayer(new Q.SoldierMap({
      type: SPRITE_TILES,
      dataAsset: 'level.json',
      sheet:     'tiles1'
    }));
    mp.setup();
    var _enemy = [
      //none enemy here,test
      //[1,1],[5,5],[17,1],[23,5],[9,7],[15,7],[6,14],[6,22],[18,22],[1,23],
      //[23,23],[1,26],[23,26],[1,34],[23,34],[1,55],[23,55],[9,59],[15,59]
    ];
    var player = new Q.Player(Q.tilePos(12,2),"player3");
    stage.add("viewport").follow(stage.insert(player));
    for( var i = 0 ; i < _enemy.length; i++ ){
      stage.insert( new Q.Enemy( Q.tilePos(_enemy[i][0],_enemy[i][1]) ) );
    }
    stage.insert(new Q.Portal(Q.tilePos(12,60),"Nivel 0","portal 1"));
    // Q.audio.play('intro.mp3',{ loop: true });
  });

  Q.scene("endLevel",function(stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width/2,
      y: Q.height/2,
      fill: "rgb(16,16,16)"
    }));
    var button = container.insert(new Q.UI.Button({
      asset:"btn-start.png",
      x: 0,
      y: 10,
      radius: 25,
      fill: "rgba(116,116,116,.8)",
      font: "100 45px 'Hanalei Fill', cursive",
      fontColor: "#f6e8db",
      label: stage.options.btnText
    }));
    var label = container.insert(new Q.UI.Text({
      x:0,
      y: -5 - button.p.h,
      color: "white",
      family: "'Hanalei Fill', cursive",
      label: stage.options.label+ "  Go!"
    }));
    button.on("click",function() {
      Q.clearStages();
      Q.stageScene(stage.options.label);
    });
    container.fit(Q.width,Q.height);
  });
  //GameStart, add your source(map,images,etc) here
  Q.load("equip_0.gif,sprites32_320.png,sprite.png, background-wall.png, tiles.png, btn-start.png, pisos.png,bg_c2.png, " +
    "bg-nivel1.png, bg-nivel2.png, bg-nivel3.png, soldier.png, tiles1.png, tiles2.png,tiles320_32.png,laser.png, " +
    "laser_45.png,laser_-45.png,"+
    "sprites3.json,sprites.json, level.json, level1.json, level2.json, level0.json,pisos.json,pisos2.json, soldier.json,laser.json, " +
    "gamestart.mp3, coin.mp3, intro.mp3, fire.mp3, Game_Over.mp3",
    function() {
      Q.sheet("tiles320_32","tiles320_32.png",{tileW: 32, tileH: 32});
      Q.sheet("tiles","tiles.png", { tileW: 32, tileH: 32 });
      Q.sheet("tiles1","tiles1.png", { tileW: 32, tileH: 32 });
      Q.sheet("tiles2","tiles2.png", { tileW: 32, tileH: 32 });
      Q.sheet("pisos","pisos.png", { tileW: 32, tileH: 32 });
      Q.sheet("bg_c2","bg_c2.png", { tileW: 32, tileH: 32 });
      var stepPlayer = {
        walk_right: { frames: [6,7,8], rate: 1/3, flip: false, loop: true },
        walk_left:  { frames: [6,7,8], rate: 1/3, flip: "x",   loop: true },
        walk_up:    { frames: [3,4,5], rate: 1/3, flip: false, loop: true },
        walk_down:  { frames: [0,1,2], rate: 1/3, flip: false, loop: true },
        stand_up:   { frames: [4], rate: 1/10, flip: false },
        stand_down: { frames: [1], rate: 1/10, flip: false },
        stand_right:{ frames: [7], rate: 1/10, flip: false },
        stand_left: { frames: [7], rate: 1/10, flip:"x" }
      };
      var stepEnemy = {
        walk_right:  { frames: [1], rate: 1/3, flip: false, loop: false },
        walk_left:   { frames: [2], rate: 1/3, flip: false, loop: false },
        walk_up:     { frames: [3], rate: 1/3, flip: false, loop: false },
        walk_down:   { frames: [0], rate: 1/3, flip: false, loop: false },
        die: { frames: [4,5,6,7,8], rate: 1/3, trigger: "died", loop: false}
      };
      Q.animations('player', stepPlayer);
      Q.animations('enemy', stepEnemy);
      Q.compileSheets("sprite.png","sprites.json");
      Q.compileSheets("soldier.png","soldier.json");
      Q.compileSheets("pisos.png","pisos.json");
      Q.compileSheets("bg_c2.png","pisos2.json");
      Q.compileSheets("sprites32_320.png","sprites3.json");
      Q.compileSheets("laser.png","laser.json");
      Q.stageScene("Nivel 0");
    },{
      progressCallback: function(loaded,total) {
        //var element = document.getElementById("loading_progress");
        //element.style.width = Math.floor(loaded/total*100) + "%";
      }
    });

});
