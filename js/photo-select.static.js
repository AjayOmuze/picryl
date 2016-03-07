/*
 * Photo selection module for Picryl app
 * Requires jQuery and Cookies to run
 */

// FIX: REMOVE
"use strict";

function createCookieCollections() {
	var collections = [{
		id: "local0",
		name: "Local collection #0",
		photos: ["ae7b084ffed14ffce3a1817475a72c9a", "fsa1992000179-PP", "8500215804d0cf3e5560401c5551abca"]
	}, {
		id: "local1",
		name: "Local collection #1",
		photos: ["8500215804d0cf3e5560401c5551abca", "ae7b084ffed14ffce3a1817475a72c9a"]
	}];
	Cookies.set("localCollections", collections);
}

var PhotoSelect = (function () {

	var selectedIds = Cookies.get("selectedIds") || "[]";
	selectedIds = JSON.parse(selectedIds);
	var isSelectionMode = false;
	/* Public settings */
	var photoSelection = "";
	var addButton = null;
	var addLabel = null;
	var extPhotoClickHandler = null;
	var extSelectionChangeHandler = null;

	var setParameters = function setParameters(newPhotoSelection, newAddButton, newExtPhotoClickHandler, newExtSelectionChangeHandler) {
		photoSelection = newPhotoSelection;
		addButton = newAddButton;
		extPhotoClickHandler = newExtPhotoClickHandler;
		extSelectionChangeHandler = newExtSelectionChangeHandler;
		// Initial call
		if (newExtSelectionChangeHandler) {
			newExtSelectionChangeHandler(selectedIds);
		}
		/* Initial add button actions */
		addButton.click(addButtonClickHandler);
		addLabel = addButton.parent().find(".action-label");
		addLabel.html("Add Photos");
	};

	var photoItemRenderer = function photoItemRenderer() {
		if (isSelectionMode) {
			var photoClass = "not-chosen";
			$(this).addClass("selectable");
			$(this).html("");
			/* If photo has been selected already, highlight it */
			if (selectedIds.indexOf($(this).data("id")) > -1) {
				photoClass = "chosen";
			}
			$(this).append($("<span class=\"" + photoClass + "\"></span>"));
		} else {
			$(this).removeClass("selectable");
			$(this).html("");
		}
	};

	var photoClickHandler = function photoClickHandler(event) {
		var itemId = $(this).data("id");
		if (isSelectionMode) {
			var itemIndex = selectedIds.indexOf(itemId);
			if (itemIndex == -1) {
				selectedIds.push(itemId);
			} else {
				selectedIds.splice(itemIndex, 1);
			}
			/* Notify external event handler that selection has been changed */
			if (extSelectionChangeHandler != undefined && extSelectionChangeHandler != null) {
				extSelectionChangeHandler.bind(this)(selectedIds);
			}
			Cookies.set("selectedIds", selectedIds);
			photoItemRenderer.bind(this)();
		} else {
			/* Notify external event handler that photo was clicked in no selection mode */
			if (extPhotoClickHandler != undefined && extPhotoClickHandler != null) {
				extPhotoClickHandler.bind(this)(itemId);
			}
		}
	};

	function addButtonClickHandler() {
		toggleSelectionHandler();
		if (isSelectionMode) {
			addLabel.html("Add to Collection");
		} else {
			addLabel.html("Add Photos");
		}
	}

	var toggleSelectionHandler = function toggleSelectionHandler(event) {
		isSelectionMode = !isSelectionMode;
		refreshSelection();
	};

	var refreshPhotoClickHandler = function refreshPhotoClickHandler() {
		$(document).off("click", photoSelection, photoClickHandler);
		$(document).on("click", photoSelection, photoClickHandler);
	};

	var refreshSelection = function refreshSelection() {
		$(photoSelection).each(function () {
			photoItemRenderer.bind(this)();
		});

		refreshPhotoClickHandler();
	};

	return {
		setParameters: setParameters,
		toggleSelectionHandler: toggleSelectionHandler,
		refreshSelection: refreshSelection
	};
})();