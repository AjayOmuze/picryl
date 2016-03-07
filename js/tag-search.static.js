/*
 * Tag search module for Picryl app
 * Requires jQuery to run
 */

"use strict";

var searchPlaceholder = "Explore a world of public domain media";
var defaultSearchText = "a";

function convertToTagSearch(searchInput, tagClickHandler) {
  var searchElement = $(searchInput);
  var suggestionClass = "tag-suggestions";

  if (searchInput.hasClass("inline")) {
    console.log("it has inline");
    suggestionClass += " inline";
  }

  /* Append tag suggestion window */
  searchElement.parent().append($("<div id=\"tag-suggestions\" class=\"" + suggestionClass + "\"><ul></ul></div>"));

  /* Placeholder logic */
  searchElement.attr("placeholder", searchPlaceholder);
  searchElement.focus(function () {
    this.placeholder = "";
    searchTags(defaultSearchText);
  });
  searchElement.blur(function () {
    this.placeholder = searchPlaceholder;
  });

  /* Search tags when user is changing search text */
  $(searchInput).keypress(function (event) { 
	if(event.which == 13){
		return false;		
	}
  });
  $(searchInput).keyup(function (event) {
    var searchText = $(this).val();
    searchTags(searchText);
	
	if(event.which == 13){
		return false;
	}
	
  });

  /* Search similar tags and show a suggestion dropdown window */
  function searchTags(search) {
	  
    $("#tag-suggestions").hide();

    if (search != "") {
      $.ajax({
        url: "https://api.getarchive.net/v3/tags?starts_with=" + search,
        headers: {
          "x-auth-key": "ladygaga#1"
        }
      }).done(function (data) {
        var tagsElement = $("#tag-suggestions ul");
        tagsElement.html("");
		
		if(data.total_items == 0){			
			tagsElement.append($('<li style="color:RED;">No matching records</li>'));			
		}
		
        data.items.forEach(function (item) {
          tagsElement.append($("<li>" + item.id + "</li>"));
        });
				
        $("#tag-suggestions li").click(function () {
			
			var tag = $(this).html();
			
			if(tag != 'No matching records'){
				
				$("#tag-suggestions").hide();
				  $("#search-input").val("");
			
				  tagClickHandler(tag);
				  
			}else{
				return false;
			}
			
        });
        $("#tag-suggestions").show();
		
      });
    }
  }
  /* Hide the suggestion dropdown window on click outside */
  $(document).click(function () {
    $("#tag-suggestions").hide();
  });
}