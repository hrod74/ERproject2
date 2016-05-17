/*
  On document load I want to remove the placeholder content in the HTML with NPR data that I receive in my ajax call.
  NPR will also be the default API for the "feedr" logo
  I need to wire-up the loading spinner on document load
  I need to wire-up the menu items so onclick I can make ajax calls for NPR, NyTimes, and Guardian
  I want to toggle open & close the menu when clickig the search icon
  I want take my NPR response and construct a title, teaser(subtitle), image and URL
  I want take my NYT response and construct a title, teaser(subtitle), image and URL
  I want take my Guardian response and construct a title, teaser(subtitle), image and URL
  I want to put the
  when user click the title I want to take the URL of the article insert it into an iframe and allow the user to close the pop-up by clicking "X"
  NYT and Guardian are restricted and will not load in the iframe, I will open iframe for NPR and a new window for NYT and Guardian

*/

/*--- document ready  ---*/
$( document ).ready(function() {
   nprApiCall();
   $( "#npr"      ).click( function() { nprApiCall();                   } );
   $( "#ny"       ).click( function() { nyTimesApiCall();               } );
   $( "#guardian" ).click( function() { guardianApiCall();              } );
   $( "#logo"     ).click( function() { nprApiCall();                   } );
   $("#search"    ).click( function() { $("#selectSource").fadeToggle() } );
   $(".closePopUp").click( function() { $("#popUp").fadeOut();          } );
});

/*--- nprApiCall ---*/

function nprApiCall()
{
   $("#currentSource").html( "NPR" );
   $("#main").html( "<div id='loading-content'><img src='images/ajax_loader.gif'></div>" );
   var link = "http://api.npr.org/query?id=1091&fields=title,teaser,storyDate,show,byline,text,audio,image,textWithHtml,listText,pullQuote,parent,relatedLink,album,artist,product,transcript,correction&requiredAssets=text,image&startDate=2016-04-29&endDate=2016-05-16&dateType=story&sort=dateAsc&output=JSON&numResults=20&apiKey=MDI0MTg5NjMzMDE0NjI0OTE4MzllMmJkZA000";
   $.ajax(  {  url      :  link,
               method   :  'GET',
               dataType :  'json',
               success  :  function( r ) {
                  var stories = r.list.story;
                  for( var i=0; i<stories.length; i++ )
                  {
                     var link         =  stories[i].link[0].$text;
                     var title        =  stories[i].title.$text;
                     var teaser       =  stories[i].teaser.$text;
                     var   image      =  "images/default-no-image.png";
                     try { image      =  stories[i].image[0].src; } catch(e) {}
                     loadArticle( "npr", i, title, teaser, link, image );
                  }
               },
               error   : function( error ){
                 alert("opps something went wrong!")
               }
            });
}

/*--- nyTimesApiCall ---*/

function nyTimesApiCall()
{
   $("#currentSource").html( "NY Times" );
   $("#main").html( "<div id='loading-content'><img src='images/ajax_loader.gif'></div>" );
   var link  = "https://api.nytimes.com/svc/topstories/v2/national.json";
       link += "?" + $.param({"api-key": "2ac4fad7ca6a4db083dda97addcda91e"});
   $.ajax(  {  url      :  link,
               method   :  'GET',
               success  :  function( r ) {
                  var results    =  r.results;
                  for( var i=0; i<results.length; i++ )
                  {
                     var   title      =  results[i].title;
                     var   teaser     =  results[i].abstract;
                     var   link       =  results[i].url;
                     var   image      =  "images/default-no-image.png";
                     try { image      =  results[i].multimedia[0].url; } catch(e) {}
                     loadArticle( "ny", i, title, teaser, link, image );
                  }
               }
            });
}

/*--- guardianApiCall  ---*/

function guardianApiCall()
{
   $("#currentSource").html( "Guardian" );
   $("#main").html( "<div id='loading-content'><img src='images/ajax_loader.gif'></div>" );
   var link = "http://content.guardianapis.com/search?show-elements=all&q=news&api-key=a13db0b1-fba9-4312-b91d-350962bc3332";
   $.ajax(  {  url      :  link,
               method   :  'GET',
               dataType :  'json',
               success  :  function( r ) {
                  var results    =  r.response.results;
                  for( var i=0; i<results.length; i++ )
                  {
                     var   title      =  results[i].webTitle;
                     var   teaser     =  results[i].sectionName;
                     var   link       =  results[i].webUrl;
                     var   image      =  "images/default-no-image.png";
                     loadArticle( "guardian", i, title, teaser, link, image );
                  }
                },
               error   : function( error ){
                 alert("opps something went wrong!")
               }
            });
}

/*--- loadContent  ---*/
function loadArticle( src, count, title, teaser, link, image )
{
   var html    = "";
       html   += "<article class='article'>";
       html   +=     "<section class='featuredImage'>";
       html   +=        "<img src='" + image + "' alt=''>";
       html   +=     "</section>";
       html   +=     "<section class='articleContent'>";
       html   +=        "<a href='#' onClick='popIt(\"" + link + "\");'><h3 class='" + src + "'>" + title + "</h3></a>";
       html   +=        "<h6>" + teaser + "</h6>";
       html   +=     "</section>";
       html   +=     "<section class='impressions'>" + count + "</section>";
       html   +=     "<div class='clearfix'></div>";
       html   += "</article>";
   var dH = $(html);
   dH.hide();
   $("#main").append( dH );
   dH.fadeIn( "slow" );
   $("#loading-content").hide();
}

/*--- popIt  ---*/

function popIt( link )
{
  if ( link.indexOf("npr.org")!=-1 ){
    $("#content").html( "<iframe frameborder='0' src='" + link + "' width='100%' height='100%'></iframe>" );
    $("#popUp").fadeIn();
  }
  else {
    window.open( link );
  }

}
