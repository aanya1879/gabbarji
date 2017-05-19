var Promise = require('bluebird');
var http = require("https");
var request = require("request");
var genretype={
    "Action":28,
    "Adventure":12,
    "Comedy":35,
    "Crime":80,
    "Documentary":99,
    "Drama":18,
    "Family":10751,
    "Fantasy":14,
    "History":36,
    "Horror":27,
    "Music":10402,
    "Mystery":9648,
    "Romance":10749,
    "Science Fiction":818,
    "Thriller":53,
    "Western":37,
     "action":28,
    "adventure":12,
    "comedy":35,
    "crime":80,
    "documentary":99,
    "drama":18,
    "family":10751,
    "fantasy":14,
    "history":36,
    "horror":27,
    "music":10402,
    "mystery":9648,
    "romance":10749,
    "science Fiction":818,
    "thriller":53,
    "western":37
};
var languagetype={
    'telugu':'te',
    "tamil":'ta',
    "hindi":'hi',
    "english":'en',
    "malyalam":'ml',
     'Telugu':'te',
    "Tamil":'ta',
    "Hindi":'hi',
    "English":'en',
    "malyalam":'ml'
};


var ReviewsOptions = [
    '“Excellent”',
    '“INSPIRING AND ENTERTAINING”',
   
    '“Lovely”',
    '“Surprise”',
    '“Beautiful movie”'];


 

module.exports = {
    ReleaseDate: function (mname) {
        return new Promise(function (resolve) {

            var movie = [];
           var lan='en-US';
// add region parameter
console.log("movie name received"+mname);
            var chunks = [];
            var options = {
                 method: 'GET',
                 url: 'https://api.themoviedb.org/3/search/movie/',
                 qs: 
                 { 
                     query:mname,
                     language: lan,
                     api_key: '918db8a56b9718d2cbd865ab99818bbc' },
                json: true,

                body:'{}'
             };

        request(options, function (error, response, body) {
               if (error) throw new Error(error);
              // console.log("release date -body result"+JSON.stringify( body.results[0]));
              // console.log("release date -body"+JSON.stringify( body));
               if(!error && body.results[0]!=undefined)
          {
              movie.push({
                    name: mname ,
                    title: body.results[0].original_title,
                    release:body.results[0].release_date,
                   overview: body.results[0].overview,
                   // sett image
                    image: 'https://image.tmdb.org/t/p/w185'+body.results[0].poster_path
                });

            // complete promise with a timer to simulate async response
           
             console.log(body);
          }
         else{
             console.log("inside else");
              movie=null;
          }
           setTimeout(function () { resolve(movie); }, 1000);
 });

});//promise
    },

      MoviesList: function (gCategory,dCategory,lCategory,laCategory) {
          return new Promise(function (resolve) {

            // Filling the review results manually just for demo purposes
        
         var chunks = [];
         var sort=0;
         var lan='en';
    console.log("g"+gCategory);
    console.log("d"+dCategory);
    console.log("l"+lCategory);
   console.log("lan"+laCategory);


         if(laCategory!=null)
        { 
            lan=languagetype[laCategory];
            console.log("language in store"+lan);
        }
         
         var loc='IN';
         if(gCategory!=null)
         { 
             var gen=genretype[gCategory];
         console.log("genre in store"+gen);
         }
      
       if(lCategory!=null)  
       {  
           switch(lCategory)
    {
        case 'germany':{
            loc='DE';
            break;
        }
         case 'usa':{
            loc='US';
            break;
        }
         case 'canada':{
            loc='CA';
            break;
        }
         case 'australia':{
            loc='AU';
            break;
        }
         case 'france':{
            loc='FR';
            break;
        }
         case 'delhi':{
            loc='IN';
            break;
        }
        
          default:{
            loc='IN';
            break;
        }
    }
    console.log("location"+loc);
    }
        
            console.log("sort value:"+sort);

         if (dCategory!==null)
         { 
             console.log("day"+dCategory);
             if(dCategory=='today'|| dCategory=='tomorrow')
             {
                        var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/movie/now_playing',
                                               qs: 
                                               { 
                                                      region:loc,
                                                      api_key: '918db8a56b9718d2cbd865ab99818bbc' 
                                                },
                                               json: true,
                                               body:'{}'
                                         };

                           if(gCategory!==null&& laCategory!==null){
                              sort=3;
                           } else{
                               if(laCategory!==null) {
                                   sort=2;
                               }else if(gCategory!=null){
                                   sort=1;
                               }else{
                                   sort=4;
                               }
                                       
                         }
             }
             else{
                             var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/movie/upcoming',
                                               qs: 
                                               { 
                                                      region:loc,
                                                    
                                                      api_key: '918db8a56b9718d2cbd865ab99818bbc' 
                                                },
                                               json: true,
                                               body:'{}'
                                         }; 
             
                           if(gCategory!=null && laCategory!=null)
                           {
                              sort=3;
                           }
                           else{
                                if(laCategory!=null)
                               {
                                   sort=2;
                               }
                               else if(gCategory!=null)
                               {
                                   sort=1;
                               }
                               else{
                                   sort=4;
                               }
                                       
                         }
            }
        }
        
          else if(gCategory!=null)
             {//dicover
                 sort=4;
var d=new Date();
var m=d.getMonth();
var y=d.getFullYear();
console.log("m:"+m);
var pm=m;
var py=y;
var fy=y;
var fm=m+2;
if(m==1)
{
    py=y-1;
    pm=12;
}
else if(m==12)
{
    fy=y+1;
    fm=1;
}
console.log("past date:"+py+pm);
console.log("future date:"+fy+'-'+fm+'-'+'1');
                           if(lCategory!=null&& laCategory!=null)
                           {
                               var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/discover/movie',
                                               qs: 
                                                   { with_original_language: lan,
                                                    with_genres: gen,
                                                    'release_date.lte': fy+'-'+fm+'-'+'1',
                                                    'release_date.gte': py+'-'+pm+'-'+'1',
                                                      page: '1',
                                                      
                                                      include_video: 'false',
                                                     include_adult: 'false',
                                                      sort_by: 'popularity.desc',
                                                      region:loc,
                                                      api_key: '918db8a56b9718d2cbd865ab99818bbc' },

                                               json: true,
                                               body:'{}'
                                         }; 
                           }
                           else{
                               if(laCategory!=null)
                               {
                                    var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/discover/movie',
                                                qs: 
                                               { with_original_language: lan,
                                                 with_genres: gen,
                                               'release_date.lte': fy+'-'+fm+'-'+'1',
                                                'release_date.gte': py+'-'+pm+'-'+'1',
                                                 page: '1',
                                                 include_video: 'false',
                                                include_adult: 'false',
                                                 sort_by: 'popularity.desc',
                                                  api_key: '918db8a56b9718d2cbd865ab99818bbc' },

                                               json: true,
                                               body:'{}'
                                         }; 
                               }
                               else if(lCategory!=null)
                               {
                                    var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/discover/movie',
                                                qs: 
                                               { 
                                                  with_genres: '28',
                                                'release_date.lte': fy+'-'+fm+'-'+'1',
                                                'release_date.gte': py+'-'+pm+'-'+'1',
                                                 page: '1',
                                                 include_video: 'false',
                                                  include_adult: 'false',
                                                 sort_by: 'popularity.desc',
                                                 region:loc,
                                                  api_key: '918db8a56b9718d2cbd865ab99818bbc' },

                                               json: true,
                                               body:'{}'
                                         }; 
                               }
                               else{
                                    var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/discover/movie',
                                             qs: 
                                             {   
                                                  with_genres: gen,
                                                 'release_date.lte': fy+'-'+fm+'-'+'1',
                                                 'release_date.gte': py+'-'+pm+'-'+'1',
                                                 page: '1',
                                                 include_video: 'false',
                                                 include_adult: 'false',
                                                  sort_by: 'popularity.desc',
                                                api_key: '918db8a56b9718d2cbd865ab99818bbc' },

                                               json: true,
                                               body:'{}'
                                         }; 
                               }
                                       
                         }

                
             }
             else
             {
                 if(laCategory!=null)
                 {
                     sort=2;
                 }
                 else{
                     sort=4;
                 }

                  var options = {
                                               method: 'GET',
                                               url: 'https://api.themoviedb.org/3/movie/upcoming',
                                               qs: 
                                               { 
                                                      region:loc,
                                                    
                                                      api_key: '918db8a56b9718d2cbd865ab99818bbc' 
                                                },
                                               json: true,
                                               body:'{}'
                                         }; 
             }
             
         console.log("sort value:"+sort);
                                        
             request(options, function (error, response, body) {
                     if (error) throw new Error(error);
                     console.log()
                     if(!error && body.results!=undefined)
                    {
                                            var mlist = [];
                                            var k=body.results.length;
                                               for (var i = 0; i < body.results.length; i++) {
                                                   var s;
                                                   switch(sort)
                                                   {
                                                       case 1:{
                                                           for(var j=0;j<body.results[i].genre_ids.length;j++)
                                                         {  if(genretype[gCategory]==body.results[i].genre_ids[j])
                                                                         { s= body.results[i].title;
                                                                                  mlist.push({
                                                                                    title: body.results[i].title,
                                                                                    subtitle:body.results[i].release_date,
                                                                                     text: body.results[i].original_language ,
                                                                                    image: 'https://image.tmdb.org/t/p/w185'+body.results[i].poster_path
                                                                                  });
                                                                         }
                                                                         
                                
                                                         }
                                                         if(j==body.results[i].genre_ids.length && i== body.results.length){
                                                             mlist=null;
                                                         }
                                                        
                                                           
                                                           break;}

                                                       case 2:{
                                                            if(body.results[i].original_language==lan)
                                                                        {s= body.results[i].title;
                                                                                    mlist.push({
                                                                                          title: body.results[i].title,
                                                                                           subtitle:body.results[i].release_date,
                                                                                            text:body.results[i].original_language  ,
                                                                                            image: 'https://image.tmdb.org/t/p/w185'+body.results[i].poster_path
                                                                                     });
                                                                           } 
                                                                            else if( i==k){
                                                             mlist=null;
                                                             break;
                                                         }
                                                                          
                                                           
                                                           
                                                           break;}
                                                       case 3:{
                                                            if(body.results[i].original_language==lan)
                                                             {

                                                                 for(var j=0;j<body.results[i].genre_ids.length;j++)
                                                                 { console.log( JSON.stringify(body.results[i]));
                                                                   if(genretype[gCategory]==body.results[i].genre_ids[j])
                                                                         { s= body.results[i].title;
                                                                             console.log( body.results[i].title);
                                                                                      mlist.push({
                                                                                           title: body.results[i].title,
                                                                                            subtitle:body.results[i].release_date,
                                                                                     text: body.results[i].original_language,
                                                                                               image: 'https://image.tmdb.org/t/p/w185'+body.results[i].poster_path
                                                                                      });
                                                                          }
                                                                   
                                                                         }
                                                             } 
                                                           else   if(j==body.results[i].genre_ids.length && i== body.results.length){
                                                                     mlist=null;
                                                             }

                                                           
                                                           break;}
                                                       case 4: {
                                                           s= body.results[i].title;
                                                           mlist.push({
                                                                                    title: body.results[i].title,
                                                                                    subtitle:body.results[i].release_date,
                                                                                     text: body.results[i].original_language ,
                                                                                    image: 'https://image.tmdb.org/t/p/w185'+body.results[i].poster_path
                                                                                  });
                                                           break;}
                                                       
                                                   }
                                               }  //for
                    
                                                             

          
              console.log(body);
         }
         else{
                     mlist=null;
                     console.log("471"+mlist);
         }
           setTimeout(function () { resolve(mlist); }, 1000);
     });
   });
}
    ,

    Reviews: function (MName) {
        return new Promise(function (resolve) {

            // Filling the review results manually just for demo purposes
            var reviews = [];
            var movieid=256040;
             var chunks = [];
            var options = {
                 method: 'GET',
                 url: 'https://api.themoviedb.org/3/movie/' +movieid,
                 qs: 
                 { 
                     language: 'en-US',
                     api_key: '918db8a56b9718d2cbd865ab99818bbc' },
                json: true,
 
                body:'{}'
             };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
if(!error &&  body.results[0]!=undefined)
{
     for (var i = 0; i < 5; i++) {
                reviews.push({
                    title: ReviewsOptions[Math.floor(Math.random() * ReviewsOptions.length)],
                    text: body.overview,
                    image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif'
                });
     }

            // complete promise with a timer to simulate async response
  
  console.log(body);
}else{
    reviews=null;
}
   setTimeout(function () { resolve(reviews); }, 1000);
});

});//promise
    }// review
};//module.export