//= require "_libs/jquery-ajax-css-deprecated-dimensions-effects-event-alias-offset-sizzle-wrap"
//= require "_libs/list"

$(function(){

  var options = {
    valueNames: [ 'name', 'description', 'category', 'subcategory' ],
    listClass: "listjs-list",
    searchClass: "listjs-search",
    sortClass: "listjs-sort"
  };

  var featureList = new List("listjs", options);

  $('#filter-official').on('click', function() {
      featureList.filter(function(item) {
          if (item.values().category == "Official") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-community').on('click', function() {
      featureList.filter(function(item) {
          if (item.values().category == "Community") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-tooling').on('click', function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Tooling") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-optimization').on('click', function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Optimization") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-deployment').on('click', function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Deployment") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-none').on('click', function() {
    featureList.filter();
    return false;
  });

  $('#listjs-search-remove').on('click', function() {
    $('.listjs-search').val("").trigger('keyup');
    featureList.search($('.listjs-search').val());
    return false;
  });

  $('.list-container .sub-nav dd a').on('click', function (e) {
    $('.list-container .sub-nav dd.active').removeClass('active');
    $(this).parent('dd').addClass('active');
  });

  $('.tag').on('click', function() {
    $('.listjs-search').val( $(this).text() ).trigger('keyup');
    featureList.search($(this).text());
    return false;
  });

  $('.listjs-search').on('keyup', function(){
    if($('.listjs-search').val() == ""){
      $('#listjs-search-remove').html("<i class='icon-search icon-white'></i>");
    } else {
      $('#listjs-search-remove').html("<i class='icon-remove icon-white'></i>");
    }
  });

});