/*
 * Photo details module for Picryl app
 * Requires jQuery to run
 */

'use strict';

var PhotoDetails = (function () {

	var selectedItem = null;
	var isDetailsElementVisible = false;

	function showPhotoDetails(item, itemId) {
		selectedItem = item;
		var detailsElement = $('#photo-details');
		var parentElement = $(detailsElement).parent();

		detailsElement.find('.loading').show();

		// New implementation:
		var itemWidth = $(item).width() + parseInt($(item).css('margin')) * 2;
		var itemHeight = $(item).height() + parseInt($(item).css('margin')) * 2;
		var arrowPos = $(item).offset().left + itemWidth / 2 - parentElement.offset().left;
		var top = $(item).offset().top + itemHeight - parentElement.offset().top;
		detailsElement.css('top', top);
		if (arrowPos < 10) {
			arrowPos = 10;
		};
		if (arrowPos > $(detailsElement).width() - 10) {
			arrowPos = $(detailsElement).width() - 10;
		}
		document.styleSheets[0].addRule('#photo-details .arrow-box:before, #photo-details .arrow-box:after', 'left: ' + arrowPos + 'px;');

		// Popup for a grid of images
		var container = $('#search-result .photo-list').parent();
		if (container && container.length > 0) {
			/* Calculate how many photos are in a row */
			var containerWidth = $('#search-result .photo-list').width();
			var itemsPerRow = Math.floor(containerWidth / itemWidth);
			var itemsWidth = itemsPerRow * itemWidth;

			/* Calculate offset for the popover */
			var offset = (container.width() - itemsWidth) / 2 + parseInt(container.css('padding-left'));
			console.log('PhotoDetails container.width() = ', container.width());
			console.log('PhotoDetails itemsWidth = ', itemsWidth);
			console.log('PhotoDetails container.css(\'padding-left\') = ', container.css('padding-left'));
			console.log('PhotoDetails offset = ', offset);

			/* Calculate arrow position */
			var arrowLeft = $(item).offset().left - container.offset().left - offset + itemWidth / 2;

			/* Apply calculations */
			detailsElement.css('width', itemsWidth);
			detailsElement.css('left', offset);
			// detailsElement.css('top', top);
			document.styleSheets[0].addRule('#photo-details .arrow-box:before, #photo-details .arrow-box:after', 'left: ' + arrowLeft + 'px;');
		}

		/* Load data */
		$.ajax({
			url: 'https://api.getarchive.net/v2/photos/' + itemId,
			headers: {
				'x-auth-key': 'ladygaga#1'
			}
		}).done(function (data) {
			var imageUrl = data.images[data.images.length - 1].url;
			var tags = '';

			if (data.tags) {
				data.tags.forEach(function (tag) {
					tags += '<a href="search.html?search=' + tag + '">' + tag + '</a>, ';
				});
			}

			detailsElement.find('.image-name').html(data.name);
			detailsElement.find('.image').css('background-image', 'url(' + imageUrl + ')');
			detailsElement.find('.view-image a').attr('href', imageUrl);
			detailsElement.find('.image-source a').attr('href', data.source_url);
			detailsElement.find('.image-source .caption').html(data.source_name);
			detailsElement.find('.image-tags .caption').html(tags);
			detailsElement.find('.image-location').html(data.location);
			detailsElement.find('.image-data').html(data.max_created_date);

			detailsElement.find('.loading').hide();
		});

		if (!isDetailsElementVisible) {
			detailsElement.fadeIn('fast');
			isDetailsElementVisible = true;
		}
	}

	/* Close the popover logic */
	var photoDetailsClicked = false;
	$('body').click(function () {
		if (!photoDetailsClicked) {
			$('#photo-details').fadeOut('fast');
			isDetailsElementVisible = false;
		}
		photoDetailsClicked = false;
	});
	$('.photo-details').click(function () {
		photoDetailsClicked = true;
	});

	/* Next and Prev photo */
	$('.left-navigation').click(function () {
		$(selectedItem).prev().click();
	});
	$('.right-navigation').click(function () {
		$(selectedItem).next().click();
	});

	return {
		showPhotoDetails: showPhotoDetails
	};
})();