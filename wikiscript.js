//use opensearch for bonus story of input doing autocomplete

$(document).ready(function(){
    var search = '';
  var num = 0;
  
  //make tags empty, fill variable up with ajax call
  var tags = [];
  
  $('#search').on('input', function(){
    

    //-----------------------------
    var timer;

    $("#searching").fadeIn();
    // clear the timer if it's already set:
    clearTimeout(timer);
    timer = setTimeout(function () {
        $("#searching").fadeOut();
    }, 400);
    $("#searching").hover(function(){
    // clear the timer on hover, so that the box won't disapear:
    clearTimeout(timer);
}, function(){
    // set the timer again when mouse is outside of the box:
    timer = setTimeout(function () {
        $("#searching").fadeOut();
          }, 400);
});
    
    //---------------------------
    //do get request for tags
    $.get('https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $('#search').val() + '&limit=10&namespace=0&format=json', function( data ) {
  

 




      //make tags the correct array
      tags = data[1];
      //update source
      $('#search').autocomplete( "option", { source: tags } );
    //search to refresh autocomplete
      $('#search').autocomplete( "search");
      
}, "jsonp" );
    
  });
  
  $('#search').autocomplete({
     source: tags,
     messages: {
       noResults: '',
       results: function(){}
     },
    minChars: 0,
    select: function (event, ui) {
      //use value you are selecting instead of one currently in input
      $('#search').val(ui.item.value);
      //then do same function you would do on normal enter press
    search = $('#search').val();
      //reset container
        $('.container');
        searchFun();
}
    });
  
  function searchFun(){
  
    console.log(search);
     $.ajax({
                      url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch='  + search + '&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max',
                      type: 'GET',
                      contentType: 'application/json',
                      dataType: 'jsonp',
                      success: function(data) {
                        
                        $.each(data.query.pages, function(index, value) {
     
    //make new a, value.id to end of wiki for clickthrough                 //make a new div, append search results into div
    //use regex replace for words with spaces and brackets so we can make id name for them
                        $('<div/>', {
                                    class: 'items',
                                    id: search.replace(/ /g,"-").replace(/\(/g,"-").replace(/\)/g,"-") + num,
                                   }).prependTo('.container');
                          
                          console.log(search.replace(" ","-") + num);
                        
                        $('#' + search.replace(/ /g,"-").replace(/\(/g,"-").replace(/\)/g,"-") + num).html('<a href="http://en.wikipedia.org/?curid=' + value.pageid + '" target="_blank"><h3>' + value.title + '</h3>'  + '<p>' + value.extract + '</p></a>');
                          console.log(search.replace(" ","-") + num);
                        num++;
                        
}); 
                      
                      }
        });
  }
  //on enter in id search, take input value and feed it into api get request
  $('#search').keypress(function(e) {
    if(e.which == 13) {
        search = $('#search').val();
      //reset container
        $('.container').empty();
        searchFun();
    }
  });
  
  
});



