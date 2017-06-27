
  //data record;
  var days = 4;
  var currentDay = 0;

  // var deadNightList = [2,3,[4,5],7];
  // var deadDayList = [1,6,8];
//   var deadNightList = [
//     [
//       {
//         'deadPerson':2,
//         'by':'wolf',
//         'at':'night'
//       },
//       {
//         'deadPerson':8,
//         'by':'poison',
//         'at':'night'
//       }
//     ],
//     [
//       {
//         'deadPerson':3,
//         'by':'wolf',
//         'at':'night'
//       },
//     ],
//     [
//       {
//         'deadPerson':4,
//         'by':'wolf',
//         'at':'night'
//       },
//       {
//         'deadPerson':5,
//         'by':'wolf',
//         'at':'night'
//       },
//     ],
//     [
//       {
//         'deadPerson':7,
//         'by':'wolf',
//         'at':'night'
//       }
//     ]
//   ]
//
// var deadDayList =[
//    [
//      {
//        'deadPerson':1,
//        'by':'vote',
//        'at':'day'
//      },
//
//      {
//        'deadPerson':6,
//        'by':'hunter',
//        'at':'day'
//      },
//
//    ],
//    [
//      {
//        'deadPerson':6,
//        'by':'vote',
//        'at':'day'
//      },
//    ],
//    [
//      {
//        'deadPerson':8,
//        'by':'vote',
//        'at':'day'
//      },
//    ]
// ]

  //////////
  // 0 100 100 100 100 100
  //
  /////////

  var deadList = [];

  // var players = ['wolf','villager','villager','villager','wolf','villager','villager','hunter','wolf'];
  var existTexture = [];
  var deadReason = {

  }

  //Aliases
  var Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Sprite = PIXI.Sprite;


  //Create a Pixi stage and renderer and add the
  //renderer.view to the DOM
  var stage = new Container(),
      renderer = autoDetectRenderer(900, 900);
      renderer.view.style.position = "absolute";
      renderer.view.style.display = "block";
      renderer.autoResize = true;
      // renderer.resize(window.innerWidth, window.innerHeight);
      renderer.resize(900, 900);
  document.body.appendChild(renderer.view);
  var characterImages = {};

  //load an image and run the `setup` function when it's done
  function initTexture(){
    loader
      .add("static/images/claw.png")
      .add("static/images/background.jpg")
      .add("static/images/gray.png")
      .add("static/images/poison.png")
      .add("static/images/hand.png")
      //sheriff
      .add("static/images/sheriff.jpg")
      //character bad
      .add("static/images/wolf1.png")
      //character good
      .add("static/images/hunter.jpg")
      .add("static/images/villager.png")
      .add("static/images/witch.png")
      .add("static/images/prophet.jpg")
      .add("static/images/rogue.jpg")
      .add("static/images/guard.jpg")
      .add("static/images/cupid.jpg")
      .add("static/images/elder.jpg")
      .add("static/images/cure.png")
      .add("static/images/lovers.jpg")


      .load(setup);
  }

    initTexture();
    function to2Group(characters){
      var charNum = characters.length;
      var firstLine = [];
      var secondLine = [];
      if(characters.length%2==0){
        var halfNum = characters.length/2;
      }else{
        var halfNum = (characters.length/2)+1;
      }
      var i = 1;
      characters.forEach(function(character){

        if(i < halfNum){
          firstLine.push(character);
        }else{
          secondLine.push(character);
        }
        i++;
      })
      return [firstLine,secondLine];
    }
    function masking(num, players){
      var isDead = checkIsDead(num);
      if(isDead){
        var whiteCover = characterImages.gray();
        return whiteCover
      }else{
        return null
      }
    }

    //separate 2 different group
    function putPosition(day, startFrom, characters, y, characterImages){
      var x = 0;
      var i = startFrom;
      var heightX = 50;
      var widthY = 50;

      characters.forEach(function(character){
        x+=100;
        canvasCharacter = pairing(character, characterImages);
          canvasCharacter.x = x +heightX + 50;
          canvasCharacter.y = y;
          canvasCharacter.width = widthY;
          canvasCharacter.height = heightX;
          stage.addChild(canvasCharacter);

          //show who is died
          var whiteMask = masking(i, players)
          if(whiteMask){
            whiteMask.x = canvasCharacter.x;
            whiteMask.y = y;
            whiteMask.width = widthY;
            whiteMask.height = heightX;
            whiteMask.alpha = 0.8;
            stage.addChild(whiteMask);
          }
          i++;

          if(sheriffList[day] == i){
              var sheriff = pairing('sheriff',characterImages )
              sheriff.x = canvasCharacter.x;
              sheriff.y = y-50;
              sheriff.width = widthY;
              sheriff.height = heightX;
              sheriff.alpha = 0.8;
              stage.addChild(sheriff);
          }

          for(var luv in lovers){
            if(lovers[luv] == i ){
              var lover = pairing('lovers',characterImages )
              lover.x = canvasCharacter.x;
              lover.y = y;
              lover.width = widthY;
              lover.height = heightX;
              stage.addChild(lover);
            }
          }

          // a array to stored every texture.
          existTexture.push(canvasCharacter);
          existTexture.push(sheriff);


      })
    }

    function pairing(character, characterImages){
      switch (character) {
        case 'wolf':
            return characterImages.wolf();
            break;
        case 'villager':
            return characterImages.villager();
            break;
        case 'hunter':
            return characterImages.hunter();
            break;
        case 'rogue':
            return characterImages.rogue();
            break;
        case 'witch':
            return characterImages.witch();
            break;
        case 'prophet':
            return characterImages.prophet();
            break;
        case 'guard':
            return characterImages.guard();
            break;
        case 'cupid':
            return characterImages.cupid();
            break;
        case 'elder':
            return characterImages.elder();
            break;
        case 'sheriff':
            return characterImages.sheriff();
            break;
        case 'lovers':
            return characterImages.lovers();
            break;

        default:
          break;
      }
    }
    //generate canvas image
    function generateImg(imgUrl){
      return new Sprite(resources[imgUrl].texture)
    }
    //show who die in big screen
    function whoDied(day, deads, players, characterImages){
      var wolf = characterImages.wolf();
      var manyDead = 100;
      var onlyDeadOne = 200;
      var diedDistance = 300
      var diedLocation = 400;
      if(Array.isArray(deads)){


        deads.forEach(function(d){
            var deadPerson = players[d.deadPerson];
            var deadOne = characterImages[deadPerson]();
            diedLocation += manyDead +20;

            var deadBy = "";
            deadBy = deadReason[d.by];
            deadOne.x = diedLocation;
            // deadOne.x += diedDistance;
            deadOne.y=200;
            deadOne.width = manyDead;
            deadOne.height = manyDead;


            // var claw = characterImages.claw();
            icon = deadReason[d.by].icon;
            icon.x = diedLocation;
            icon.y = 190;
            icon.width = 120;
            icon.height = 120;

            stage.addChild(deadOne);
            stage.addChild(icon);
            console.log('***'+d.deadPerson);
            displayMsg(deadBy.text+" "+(parseInt(d.deadPerson)+1)+"號","50px sans-serif","white", diedLocation, 300);

            // array stored every texture
            deadList.push(d.deadPerson);
            existTexture.push(deadOne);
            existTexture.push(icon);
            if(day == savePerson.day&& day.who == d.deadPerson){
              // &&savePerson.who ==deads.deadPerson
              console.log(deads[d].deadPerson);
              console.log('***');
              var cure = deadReason['cure'].icon;
              icon.x = diedLocation;
              icon.y = 190;
              icon.width = 120;
              icon.height = 120;
            }

        })
        // var victim = players[deads[0].deadPerson];
        // if(!victim){
        //
        // }



      }else{
        // var victim = players[deads.deadPerson];
      }

        // var dead = characterImages[victim]();



      // displayMsg(deads+"號","50px sans-serif","white", 700, 400);
      // stage.addChild(wolf);
      // stage.addChild(dead);
      // stage.addChild(kill);

      // array to stored texture.
      // existTexture.push(wolf);
      // existTexture.push(dead);
      // existTexture.push(kill);
    }

    function displayMsg(msg, fontSize, color, x, y){
      var message = new PIXI.Text(
        msg,
        {font: fontSize, fill: color}
      );
      message.position.set(x, y);
      existTexture.push(message);
      stage.addChild(message);
    }

    function whoLeave(day, player, players, characterImages){

      if(Array.isArray(player)){

        var positionX = 50;
        player.forEach(function(p){
          var playerId = p.deadPerson;

          if(playerId){
            existTexture.push(msg);
            var reason = deadReason[p.by]['text'];
            var leaver = pairing(players[playerId], characterImages);
            var msg = reason+(parseInt(playerId)+1)+"號";

            positionX += 120;
            leaver.x = positionX;
            leaver.y = 200;
            leaver.width=100;
            leaver.height=100;

            stage.addChild(leaver);
            displayMsg(msg,"32px sans-serif","white", leaver.x, leaver.y+100);
            deadList.push(p.deadPerson);
            existTexture.push(leaver);
          }
        })
      }else{
        var playerId = player.deadPerson;

        if(playerId){
          existTexture.push(msg);
          var reason = deadReason[player.by]['text'];
          var leaver = pairing(players[playerId], characterImages);
          var msg = reason+(parseInt(playerId)+1)+"號";

          positionX += 120;
          leaver.x = positionX;
          leaver.y = 200;
          leaver.width=100;
          leaver.height=100;

          stage.addChild(leaver);
          displayMsg(msg,"32px sans-serif","white", leaver.x, leaver.y+100);
          deadList.push(player.deadPerson);
          existTexture.push(leaver);
        }
        /* end of */
      }
    }

    function whoSave(day, player, players, characterImages ){
      if(day==player.day){
        var victim = players[player.who];
        var victimImg = characterImages[victim]();

        var diedLocation = 520;

        victimImg.x = diedLocation;
        victimImg.y = 350;
        victimImg.width = 100;
        victimImg.height = 100;

        var icon = deadReason['cure'].icon;
        icon.x = diedLocation;
        icon.y = 350;
        icon.width = 100;
        icon.height = 100;

        var msg = displayMsg("解藥"+(parseInt(player.who)+1)+"號 ","40px sans-serif","white", diedLocation, 470);


        stage.addChild(victimImg);
        stage.addChild(icon);
        existTexture.push(victimImg);
        existTexture.push(icon);

      }
    }

      function checkIsDead(num){
        var isExist = false;
        for(var dead in deadList){
          if(deadList[dead]==num){
            isExist = true;
          }
        }
        return isExist
      }

      function nightFall(){
          clearTexture();
          initTexture();
          gameProcess(currentDay, players, characterImages);
          currentDay++;
          PIXI.loader.reset();
      }

  function clearTexture(){
    existTexture.forEach(function(texture){
      // console.log(ttt);
      stage.removeChild(texture);
      // ttt.destroy(true);

    });
    PIXI.loader.reset();
  }

  function gameProcess(day, players, characterImages){

    var msg = displayMsg("第"+(currentDay+1)+"天","40px sans-serif","white", 400, 160);
    existTexture.push(msg);
    var twoLine = to2Group(players);
    var startFrom = twoLine[0].length;
    whoDied(day,deadNightList[day] , players, characterImages);
    whoLeave(day, deadDayList[day], players, characterImages);
    whoSave(day,savePerson,players, characterImages);
    putPosition(day, 0, twoLine[0],100, characterImages);
    putPosition(day, startFrom, twoLine[1],500, characterImages);
    renderer.render(stage);
    extractPic();
  }

  function dividerLine(){

    var line = new PIXI.Graphics();
    line.lineStyle(4, 0xFFFFFF, 1);
    line.moveTo(400, 200);
    line.lineTo(400, 400);
    line.x = 32;
    line.y = 32;
    stage.addChild(line);
  }

  function extractPic(){
    outputPic = renderer.plugins.extract.image(stage);
    /* working solution*/
    var a = document.createElement('a');
    a.href = outputPic.src;
    a.download = "output.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  function setup() {
    //Create the `cat` sprite, add it to the stage, and render it
    characterImages = {
      wolf:function(){ return generateImg("static/images/wolf1.png") },
      dice:function(){ return generateImg("static/images/hunter.jpg") },
      claw:function(){ return generateImg("static/images/claw.png") },
      vote:function(){return generateImg("static/images/hand.png")},
      villager:function(){ return generateImg("static/images/villager.png") },
      hunter:function(){ return generateImg("static/images/hunter.jpg") },
      gray:function(){return generateImg("static/images/gray.png")},
      poison:function(){return generateImg("static/images/poison.png")},
      cure:function(){return generateImg("static/images/cure.png")},
      rogue:function(){return generateImg("static/images/rogue.jpg")},
      witch:function(){return generateImg("static/images/witch.png")},
      prophet:function(){return generateImg("static/images/prophet.jpg")},
      guard:function(){return generateImg("static/images/guard.jpg")},
      cupid:function(){return generateImg("static/images/cupid.jpg")},
      elder:function(){return generateImg("static/images/elder.jpg")},
      sheriff:function(){return generateImg("static/images/sheriff.jpg")},
      lovers:function(){return generateImg("static/images/lovers.jpg")}


    }




      var background = new Sprite(resources['static/images/background.jpg'].texture);
      background.position.x = 0;
      background.position.y = 0;
      background.width = 900;
      background.height = 600;
      stage.addChild(background);

      dividerLine();
      deadReason =  {
        'wolf':{text:'狼刀', icon:characterImages.claw()},
        'poison':{text:'毒', icon:characterImages.poison()},
        'vote':{text:'放逐', icon:characterImages.vote()},
        'hunter':{text:'槍殺', icon:characterImages.hunter()},
        'cure':{text:'解藥', icon:characterImages.cure()},
        'reveal':{text:'自爆', icon:characterImages.claw()},
        'love':{text:'殉情', icon:characterImages.lovers()}



      }

    // var background = new PIXI.Sprite(landscapeTexture);
    // var twoLine = to2Group(players);
    // putPosition(twoLine[0],100, characterImages);
    // putPosition(twoLine[1],500, characterImages);
    // whoDied(3, players, characterImages);
    // whoLeave(1, 2, players, characterImages);
    gameProcess(0, players, characterImages);

    // characterImages.wolf.x=150;
    // characterImages.wolf.y=200;
    // characterImages.dice.x=630;
    // characterImages.dice.y=200;
    // characterImages.claw.x = 400;
    // characterImages.claw.y = 200;
    // stage.addChild(characterImages.wolf);
    // stage.addChild(characterImages.dice);
    // stage.addChild(characterImages.claw);

    renderer.render(stage);


    // var outputIt = function(){
      // renderer.view.
      // var p = new PIXI.extract.WebGLExtract(renderer);
      // p.image();
      // const image = renderer.plugins.extract.image(stage);
      // var outputPic =  document.getElementById('dl').src;


      /* working solution*/
      // var dataURL =renderer.view.toDataURL("image/png");
      // console.log(dataURL);
      // uriContent = "data:application/octet-stream," + encodeURIComponent(dataURL);
      // $(this).attr("href", "data:image/png;base64,abcdefghijklmnop").attr("download", "file-" + d + ".png");
      // this.href = dataURL;

    // }


    // outputPic.src = dataURL;
    // newWindow = window.open(uriContent);

    // document.body.appendChild(image);

    // dl.addEventListener('click', outputIt, false);
    // var a = document.createElement('a');
    // a.href = "img.png";
    // a.download = "output.png";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

  }
