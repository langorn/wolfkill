var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
var index = require('./routes/index');
var users = require('./routes/users');
var exphbs = require('express-handlebars');
var app = express();
var csv = require("fast-csv");


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.engine('.hbs', exphbs({ defaultLayout: 'gogo', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {


    var characterName = {
      '平民':'villager',
      '狼':'wolf',
      '盜賊':'rogue',
      '預':'prophet',
      '女巫':'witch',
      '獵人':'hunter',
      '守衛':'guard',
      '邱':'cupid'
    }

    var csvfile = __dirname+"/public/javascripts/my.csv";
    // console.log(csvfile);
    var csvData = [];
    csv
    .fromPath(csvfile, {ignoreEmpty: true})
    .on("data", function(data){
      csvData.push(data);
        console.log(csvData);
        // csvData.push(data);

    })
    .on("end", function(){
        console.log("done");
        var warHistory = organize(csvData, characterName);
        var players = JSON.stringify(warHistory.players);
        var day = JSON.stringify(warHistory.day);
        var night = JSON.stringify(warHistory.night);
        var savePerson = JSON.stringify(warHistory.savePerson);
        var sheriffList = JSON.stringify(warHistory.sheriffList);
        var lovers = JSON.stringify(warHistory.lovers);

        res.render('home',{csv:{players:players ,day:day, night:night, savePerson:savePerson, sheriffList:sheriffList, lovers:lovers}});

    });

    // uplayers = //['wolf','villager','villager','villager','wolf','villager','villager','hunter','wolf'];
    // player = JSON.stringify(warHistory);
    // console.log(csvStream);
    // warHistory = ['wolf','villager','villager','villager','wolf','villager','villager','hunter','wolf'];
});

function organize(data ,characterName){
  // console.log('organize!');
  // console.log(data);
  var sheriffList = getSheriff(data[0]);
  var lovers = getLovers(data[1])
  var players = getCharacterName(data[3], characterName);
  data.splice(0, 1);
  data.splice(0, 1);
  data.splice(0, 1);
  data.splice(0, 1);
  var diedRecord = whoDied(data);
  return { 'lovers':lovers, 'players':players, 'day':diedRecord.day , 'night':diedRecord.night ,'savePerson':diedRecord.savePerson , 'sheriffList':sheriffList }
}

function getSheriff(data){
  var sheriffList = [];
  for(var d in data){
    if(data[d] && d!=0 && data[d]!=''){
      sheriffList.push(data[d])
    }
  }
  console.log(sheriffList);
  return sheriffList;
}

function getLovers(data){
  var lovers = [];
  for(var d in data){
    if(data[d] && d!=0 && data[d]!=''){
      lovers.push(data[d])
    }
  }
  return lovers
}

function getCharacterName(data, characterName){

  var translateName = [];
  for(var d in data){
    var name = data[d];
    var cname = characterName[name];
    translateName.push(cname);
  }
  return translateName;
}

function whoDied(data){
  var dayDead=[];
  var nightDead=[];
  var savePerson = {};
  // 'deadPerson':2,
  // 'by':'wolf',
  // 'at':'night'
  var diedStatus = {
    '推':function(d){
      return {
        'deadPerson':d,
        'by':'vote',
        'at':'day'
      };
    },
    '槍':function(d){
      return {
        'deadPerson':d,
        'by':'hunter',
        'at':'day'
      };
    },
    '爆':function(d){
      return {
        'deadPerson':d,
        'by':'reveal',
        'at':'day'
      };
    },
    '殉':function(d){
      return {
        'deadPerson':d,
        'by':'love',
        'at':'day'
      };
    },
    '刀':function(d){
      return {
        'deadPerson':d,
        'by':'wolf',
        'at':'night'
      };
    },
    '刀|救':function(d){
      return {
        'deadPerson':d,
        'by':'wolf',
        'at':'none'
      };
    },
    '毒':function(d){
      return {
        'deadPerson':d,
        'by':'poison',
        'at':'night'
      };
    }

  }
  // data.splice(0, 1);
  // data.splice(1, 1);
  for(var d in data){
    if(data[d]){
      var players = data[d];
      var day = [];
      var night = [];

      for(var p in players){
        if(players[p]!=''){

          var diedState = players[p];
          console.log(diedState);
          var checkDead = diedStatus[diedState](p);
          if(checkDead.at=='day'){
            day.push(checkDead);
          }else if(checkDead.at=='night'){
            night.push(checkDead);
          }else{
            savePerson = {who:checkDead.deadPerson, day:d};
          }
        }

      }
      dayDead.push(day);
      nightDead.push(night);
    }
  }
  return {'day':dayDead, 'night':nightDead , 'savePerson':savePerson}
}

app.use('/users', users);
app.use('/static', express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
