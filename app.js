// This loads the environment variables from the .env file
//require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId:'bfcb0251-3d81-4190-8330-34b988ee1973',
    appPassword: 'KqqnVB4Cqm2uhMHAa29qO9i'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector,function (session){
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ec4680f8-7d49-40d3-9fca-bf3d1600f0bd?subscription-key=c26249c377b947fb803eb25b274ac853&verbose=true';
var recognizer = new builder.LuisRecognizer(model);


bot.recognizer(recognizer);
bot.dialog('Hello', function (session,arg){
    session.endDialog("Arrey o Samba !! \n\n Hum hai Gabbar Singh, the bot. Gabbar Ji for you.\n\n\n\n  Ask me release date or any movie you'd like to watch.I'll reccommend based on language,genre,country and your date of convinence.\n\n Type 'Hey' to start and Type 'Help' if your stuck");
}).triggerAction({
    matches: 'Hello'
});

bot.dialog('ReleaseDate', [
    function (session,args,next){
      //  if(intent)
       //session.dialogData.entities=args.entities;
      console.log("intents" + JSON.stringify(args));
      if(args==undefined){
          builder.Prompts.text(session,' Humko movie naam se dede Thakur ');
      }
      else{
       var movieName=builder.EntityRecognizer.findEntity(args.intent.entities,'MovieName');
       if(movieName!==null){
           
           next({response:movieName.entity});
       }else if(session.dialogData.movieName){
           next({response:session.dialogData.movieName});
       }
       else {
           builder.Prompts.text(session,' Humko movie phir se dede Thakur ');
       }
      }
   },

   function getReleaseDate(session,results,next){
       var movieName=results.response;
       if(movieName){
           session.dialogData.movieName=movieName;
       }

       if(!movieName){
           session.endDialog('Request cancelled');
       }else{

           
            Store
            .ReleaseDate(movieName)
            .then(function (movie) {
                //console.log("74");
                //console.log(movie);
               // session.send('I found %d reviews', movie.length);
             if(movie!==null){
                
                 session.sendTyping();

                      setTimeout(function () {
                          var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(movie.map(movieAsAttachment));
                session.send(message);
                 }, 3000);
                next();
             }else{

                // End
                session.endDialog('Humko maaf karde Thakur! Couldn\'t find Release Date ! check movie name');
             }
            });
            

       }
   }
]).triggerAction({

    matches: 'ReleaseDate'

});

bot.dialog('MoviesList',[   
    function confirmQuery(session,args,next){
     session.dialogData.entities=args.intent.entities;
console.log("98:intents" + JSON.stringify(args.intent));
if(args.intent.entities==undefined){
    session.replaceDialog('helpMoviesList');
}else{
//console.log(typeof(args.entities));
     var genreEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Genre');
     var locationEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'builtin.geography.country');
     var languageEntity=builder.EntityRecognizer.findEntity(args.intent.entities,'Language');
     console.log(JSON.stringify(args.intent.entities[0]));
   //  console.log(JSON.stringify(genreEntity));
    // if(args.entities)console.log("into if");
   if(args.intent.entities[0]==undefined)
   {
       session.replaceDialog('helpMoviesList');
   }else{
     if(args.intent.entities[0].type=='builtin.datetimeV2.date') { 
         console.log("1233date entitie");
           var dateEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');

     }else {
          var dateEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.daterange');
     }
     

     if(genreEntity!==null){
         console.log(JSON.stringify(session.dialogData));
           session.dialogData.byGenre=true;
           console.log("114sucessfull bygenre");
         session.dialogData.genre=genreEntity.entity;
         console.log("116sucessfull genre");

      }
    
      console.log("120"+JSON.stringify(session.dialogData));
     console.log("121"+JSON.stringify(dateEntity));

     if(dateEntity!==null){
         //console.log("sucessfull before");
           session.dialogData.byDate=true;
           //console.log("sucessfull byd");
         session.dialogData.date=dateEntity.entity;
     }
     console.log("129 date entity value"+session.dialogData.date);

     if(locationEntity!==null){
           session.dialogData.byLocation=true;
          session.dialogData.location=locationEntity.entity;
     }
     if(languageEntity!==null){
           session.dialogData.byLanguage=true;
          session.dialogData.language=languageEntity.entity;
    }
    if((languageEntity!==null)&&(locationEntity==null)){
          session.dialogData.byLocation=true;
          if((languageEntity.entity=='hindi'|| languageEntity.entity=='telugu'||languageEntity.entity=='tamil'||languageEntity.entity=='malyalam')) {
                session.dialogData.location='IN';
             }else{
                session.dialogData.location='US';
            }
    }
      if(session.dialogData.genre ||session.dialogData.date||session.dialogData.location||session.dialogData.language){
          next();
      }else{
          session.replaceDialog('helpMoviesList');
        
      }    
}
}
},



 function getMoviesList(session,results,next){
     var g=null;
      var loc=null;
      var lan=null;
      var d=null;
      console.log("184"+JSON.stringify(results.response));
      console.log("185"+results.value);
      console.log("186"+JSON.stringify(session.dialogData.opt));
    
            if(session.dialogData.byGenre)
            {
                g=session.dialogData.genre;
            }
             if(session.dialogData.byDate)
            {
                d=session.dialogData.date;
            }
             if(session.dialogData.byLanguage)
            {
                lan=session.dialogData.language;
            } if(session.dialogData.byLocation)
            {
                loc=session.dialogData.location;
            }
       

       if(!((g!=null)||(d!=null)||(lan!=null)||(loc!=null))){
           session.endDialog('Request cancelled');
       }else{
           Store.MoviesList(g,d,loc,lan)
            .then(function (mlist) {
                console.log("mlist"+JSON.stringify( mlist));
                 console.log(mlist.value);
                  console.log("type"+mlist.type)
                if(mlist==null|| mlist==undefined){
                    session.endDialog("Humko maaf karde Thakur! Could not find movies for given details. Ask me something ");
                }
                else
                {
                    //  session.sendTyping();

                     // setTimeout(function () {
                    var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(mlist.map(movieListAsAttachment));
                session.send(message);
                // }, 3000);
                 
            
                next();
            }
            });   
       }
 }
]).triggerAction({

    matches: 'MoviesList'

});

bot.dialog('Reviews', [
function (session,args,next){
      // session.dialogData.entities=args.entities;
      // console.log("intents" + JSON.stringify(args.intents));
       if(args==undefined){
 builder.Prompts.text(session,'Humko movie naam se dede Thakur ')
      }else{
       var movieName=builder.EntityRecognizer.findEntity(args.intent.entities,'MovieName');
       if(movieName!==null){
           
           next({response:movieName.entity});
       }else if(session.dialogData.movieName){
           next({response:session.dialogData.movieName});
       }
       else {
           builder.Prompts.text(session,'Humko movie phir se dede Thakur ')
       }
      }
   },

function getReview(session,results,next){
       var movieName=results.response;
       if(movieName.entity){
           movieName=session.dialogData.movieName=movieName.entity;
       }else{
           session.dialogData.movieName=movieName;
       }

       if(!movieName){
           session.endDialog('Request cancelled');
       }else{
            Store
            .Reviews(movieName)
            .then(function (reviews) {
                if(reviews!=null){
                 session.sendTyping();

                      setTimeout(function () {
                         var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(reviews.map(reviewAsAttachment));
                session.send(message);
                 }, 3000);

               
                next();
            
             }else{

                // End
                session.endDialog('Humko maaf karde Thakur!Couldn\'t find Review \n\n Ask me something');
               
             }
            });

       }
   }
]).triggerAction({

    matches: 'Reviews'

});
bot.dialog('Help',[
   function helpme(session,args,next)
   {
       options=['Find Release Date of Movie','Get list of movies of your Choice','Search for reviews'];
      // builder.Prompts.choice(session,"choose",options);
      builder.Prompts.choice(session,"Thakur ! Aapkea hukum sarakhon pe!  You can ask me about release date or movies of your choice !! choose an option  :",options);

       //session.endDialog('Hi! Try asking me things like \'reviews of dangal\', \'movies releasing on 24th march\' or \'release date of Baahuballi 2\'');
   },

   function helpMeChoose(session,results,next){
       var choice=results.response.entity;
       switch(choice){
           case 'Find Release Date of Movie':{
               //session.matches('ReleaseDate');
               session.replaceDialog('ReleaseDate');
               break;
               console.log("292");
           }
           case 'Get list of movies of your Choice':
             session.replaceDialog('helpMoviesList');
               break;
           case 'Search for reviews':{
               session.replaceDialog('Reviews');
               break;
           }
       }
       

   }
]).triggerAction({

    matches: 'Help'

});

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

// Helpers


bot.dialog('helpMoviesList',[
         function (session,args,next)
         {
             var searchType=['Genre','Language','Location','Date'];
             builder.Prompts.choice(session,"I reccommend movies based on Genre , Language , Location and Date . \n Choose an option ",searchType);
        },

        function (session,results,next)
        {
                var choice=results.response.entity;
                 session.dialogData.category=choice;
                switch(choice){
                        case 'Genre':{
                            session.beginDialog('genreCategory');
           //  gval=getgenre(session,results);
                             break;
                        }case 'Language':{
                             session.beginDialog('lanCategory');
                              break;
                         }
                        case 'Location':{
                            session.beginDialog('locCategory');
                            break;
                         }
                       case 'Date':{
                            session.beginDialog('dateCategory');
                            break;
                       }
               }
         },

        function (session,results,next){
                var gval=null;
                var dval=null;
                var lanval=null;
                var locval=null;
                 switch(session.dialogData.category){
                       case 'Genre':gval=session.conversationData.genre;break;
                       case 'Language':lanval=session.conversationData.lan;break;
                       case 'Date':dval=session.conversationData.d;break;
                       case 'Location':locval=session.conversationData.loc;break;
                 }
         

   
                Store.MoviesList(gval,dval,locval,lanval)
                   .then(function (mlist) {
                       
                if(mlist!=null)
                {
                      session.sendTyping();

                      setTimeout(function () {
                     var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(mlist.map(movieListAsAttachment));
                session.send(message);
                 }, 3000);
                 
                next();
            }else{
                session.endDialog("Sorry,could not find movies for given details :( \n\n  Ask me something else ");

                }
            });   
}
]).triggerAction({

    matches: 'helpMoviesList'
});

bot.dialog('genreCategory',[
    function (session,args,next){
         var Gchoice=['Action','Adventure','Comedy','Crime','Family','Fantasy','Horror','Mystery','Romance','Thriller'];
         builder.Prompts.choice(session,"Choose a Genre Category :",Gchoice);
    },
function getgenre(session,results){
   // console.log(JSON.stringify(results));
    //console.log(JSON.stringify(session.message.text));
    //setTimeout(function(){return true;},1000);
    var genre=results.response.entity;
    switch(genre){
        case "Action":session.conversationData.genre ='action';break;
        case "Adventure":session.conversationData.genre='adventure';break;
        case "Comedy":session.conversationData.genre='comedy';break;
        case 'Crime':session.conversationData.genre='crime';break;
        case "Family":session.conversationData.genre='family';break;
        case "Fantasy":session.conversationData.genre='fantasy';break;
        case "Horror":session.conversationData.genre='horror';break;
        case 'Mystery':session.conversationData.genre='mystery';break;
        case 'Romance':session.conversationData.genre='romance';break;
        default:session.conversationData.genre='thriller';
    }
    session.endDialog();

   // session.endDialogWithResults({ repsonse: session.conversationData.genre })
 }
]);

bot.dialog('lanCategory',[
    function (session,args,next){
        var Lanchoice=['Hindi','Telugu','Tamil','English','Malyalam'];
         builder.Prompts.choice(session,"choose a language",Lanchoice);
    },
function (session,results){
   // console.log(JSON.stringify(results));
    //console.log(JSON.stringify(session.message.text));
    //setTimeout(function(){return true;},1000);
    var lan=results.response.entity;
    console.log(results.response.entity);
    switch(lan){
        case "Hindi":session.conversationData.lan ='hindi';break;
        case "Telugu":session.conversationData.lan='telugu';break;
        case "Tamil":session.conversationData.lan='tamil';break;
       case 'English':session.conversationData.lan='english';break;
        case "Malyalam":session.conversationData.lan='malyalam';break;
       // default:session.conversationData.lan='hindi';
        
    }
     session.endDialog();
    //session.endDialogWithResults({ repsonse: session.conversationData.lan })
}
]);

bot.dialog('locCategory',[
    function (session,args,next){
          var Locchoice=['India','Usa','Canada'];
         builder.Prompts.choice(session,"choose a Country ",Locchoice);
    },
function getgenre(session,results,next){
   // console.log(JSON.stringify(results));
    //console.log(JSON.stringify(session.message.text));
    //setTimeout(function(){return true;},1000);
    var loc=results.response.entity;
    switch(loc){
        case "India":{session.conversationData.loc ='india';break;}
        case "Usa":session.conversationData.loc='usa';break;
        case "Canada":session.conversationData.loc='canada';break;
        default:session.conversationData.loc='india';
    }
     session.endDialog();
   // session.endDialogWithResults({ repsonse: session.conversationData.loc })
}
]);

bot.dialog('dateCategory',[
    function (session,args,next){
          var Dchoice=['Today','Tomorrow','This Week'];
         builder.Prompts.choice(session,"Choose Date ",Dchoice);
    },
function getgenre(session,results,next){
   // console.log(JSON.stringify(results));
    //console.log(JSON.stringify(session.message.text));
    //setTimeout(function(){return true;},1000);
    var d=results.response.entity;
    switch(d){
        case "Today":session.conversationData.d ='today';break;
        case "Tomorrow":session.conversationData.d='tomorrow';break;
        case "This Week":session.conversationData.d='this week';break;
       
        default:session.conversationData.d='today';
    }
     session.endDialog();
    //session.endDialogWithResults( { repsonse: session.conversationData.d })
}
]);


function movieAsAttachment(movie) {
    return new builder.HeroCard()
        .title(movie.rtitle)
        .subtitle('RELEASE DATE : %s',movie.release)
        .text('Overview %s',movie.overview)
        .images([new builder.CardImage().url(movie.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=release+date+of+' + encodeURIComponent(movie.title))
        ]);
}

function movieListAsAttachment(list) {
    return new builder.HeroCard()
        .title(list.title)
       .subtitle('RELEASE DATE %s',list.subtitle)
       .text('Language : %s',list.text)
        .images([new builder.CardImage().url(list.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=movie+' + encodeURIComponent(list.title))
        ]);
}


function reviewAsAttachment(review) {
    return new builder.ThumbnailCard()
        .title(review.title)
        .text(review.text)
        .images([new builder.CardImage().url(review.image)]);
}