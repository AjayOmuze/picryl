/*
 * Tag search module for Picryl app
 * Requires jQuery to run
 */

"use strict";

var searchPlaceholder = "Search millions of images";
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
    var searchText = $(this).val();
    searchTags(searchText);
  });

  /* Search similar tags and show a suggestion dropdown window */
  function searchTags(search) {
    $("#tag-suggestions").hide();

    if (search != "") {
      $.ajax({
        url: "https://api.getarchive.net/v2/tags?starts_with=" + search,
        headers: {
          "x-auth-key": "ladygaga#1"
        }
      }).done(function (data) {
        var tagsElement = $("#tag-suggestions ul");
        tagsElement.html("");
        data.items.forEach(function (item) {
          tagsElement.append($("<li>" + item.id + "</li>"));
        });
        $("#tag-suggestions li").click(function () {
          $("#tag-suggestions").hide();
          $("#search-input").val("");
          var tag = $(this).html();

          tagClickHandler(tag);
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