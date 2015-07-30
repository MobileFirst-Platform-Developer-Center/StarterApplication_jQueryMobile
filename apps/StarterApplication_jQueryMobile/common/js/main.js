/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function wlCommonInit(){
	loadFeeds();
}

$("#ReloadLink").bind("click", function(){
	loadFeeds();
});

//**************************************
// loadFeedsPage
//**************************************
function loadFeedsPage() {	
	$.mobile.changePage("index.html", {prefetch:"true"});	
}

//**************************************
// loadAboutPage
//**************************************
function loadAboutPage() {
	$.mobile.changePage("about.html", {prefetch:"true"});
}

$(document).on( "pageload", function( event ) { 
	$(".translate").each(function(index, element) {
		  element = $(element);
		  var elementId = element.attr("id");
		  element.text(Messages[elementId]);
		});
});

//**************************************
// Load feeds
//**************************************
function loadFeeds(){	
	$.mobile.loading('show');
	
	var resourceRequest = new WLResourceRequest("/adapters/StarterApplicationAdapter/getEngadgetFeeds", WLResourceRequest.GET, 30000);
	resourceRequest.send().then(
			loadFeedsOK,
			loadFeedsFAIL
	);
}

function loadFeedsOK(data){
	if (!data || !data.responseJSON || !data.responseJSON.items || data.responseJSON.items.length == 0)
		alert("Could not retrieve feeds");	
	feeds = data.responseJSON.items;
	$("#FeedsList").empty();
	// Create the list items
	for (var i=0; i<feeds.length; i++){
		var dataItem = feeds[i];
		var listItem = $("<li class='FeedItem' id='" + i + "'><h3>" + dataItem.title + "</h3><p>"+ dataItem.pubDate+"</p></li>");
		$("#FeedsList").append(listItem);
	}
	// Attach a 'click' event handler to each item in the list
	$(".FeedItem").bind("click", function(){
		displayFeed($(this).attr("id"));
	});
		
	$("#FeedsList").listview('refresh');
	$.mobile.loading('hide');
}

function loadFeedsFAIL(data){
	WL.Logger.debug("Server connectivity error");
	$.mobile.loading('hide');
	WL.SimpleDialog.show("Starter Application", "Service not available. Try again later.", 
		[{
			text : 'Reload',
			handler : WL.Client.reloadApp
		},
		{
			text: 'Close',
			handler : function() {}
		}]
	); 
}

//**************************************
// Display feed
//**************************************
function displayFeed(FeedId){
	WL.App.resetBackButton();
	var item = feeds[FeedId].description;
	$(document).on('pageinit',$('#FeedContentPage'), function(event) {
	    $("#FeedContent").html(item);
	    // Resize images to max width of 260px
	    $("#FeedContent").find("img").each(function(){
	    	if ($(this).attr("src").indexOf("jpg")>=0){
	    		$(this).width(260);
	    	}
	    });
	    // add target='_blank' attribute to all the links
	    $("#FeedContent a").attr("target","_blank");
	});
	$.mobile.changePage("FeedContentPage.html", {prefetch:"true"});
}
