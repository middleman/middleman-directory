//= require_tree ./libs

$(function(){

  var options = {
    valueNames: [ 'name', 'description', 'category', 'subcategory' ],
    listClass: "listjs-list",
    searchClass: "listjs-search",
    sortClass: "listjs-sort"
  };

  var featureList = new List("listjs", options);

  $('#filter-official').click(function() {
      featureList.filter(function(item) {
          if (item.values().category == "Official") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-community').click(function() {
      featureList.filter(function(item) {
          if (item.values().category == "Community") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-tooling').click(function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Tooling") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-optimization').click(function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Optimization") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-deployment').click(function() {
      featureList.filter(function(item) {
          if (item.values().subcategory == "Deployment") {
              return true;
          } else {
              return false;
          }
      });
      return false;
  });

  $('#filter-none').click(function() {
    featureList.filter();
    return false;
  });

  $('#listjs-search-remove').click(function() {
    $('.listjs-search').val("").keyup();
    featureList.search($('.listjs-search').val());
    return false;
  });

  $('.list-container ul.nav-pills li a').click(function (e) {
    $('.list-container ul.nav-pills li.active').removeClass('active')
    $(this).parent('li').addClass('active')
  })

  $('.tag').click(function() {
    $('.listjs-search').val( $(this).text() ).keyup();
    featureList.search($(this).text());
    return false;
  });

  $('.listjs-search').keyup(function(){
    if($('.listjs-search').val() == ""){
      $('#listjs-search-remove').html("<i class='icon-search icon-white'></i>");
    } else {
      $('#listjs-search-remove').html("<i class='icon-remove icon-white'></i>");
    }
  });

});