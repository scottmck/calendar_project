"use strict";

// Makes sure the document is ready before executing scripts
jQuery(function($){

// A quick check to make sure the script loaded properly
console.log("init.js was loaded successfully.");

// File to which AJAX requests should be sent
var processFile = "assets/inc/ajax.inc.php",

// Functions to manipulate the modal window
    fx = {

        // Checks for a modal window and returns it, or
        // else creates a new one and returns that
        "initModal" : function() {
                // If no elements are matched, the length
                // property will be 0
                if ( $(".modal-window").length==0 )
                {
                    // Creates a div, adds a class, and
                    // appends it to the body tag
                    return $("<div>")
                            .hide()
                            .addClass("modal-window")
                            .appendTo("body");
                }
                else
                {
                    // Returns the modal window if one
                    // already exists in the DOM
                    return $(".modal-window");
                }
            },

        // Adds the window to the markup and fades it in
        "boxin" : function(data, modal) {
                // Creates an overlay for the site, adds
                // a class and a click event handler, then
                // appends it to the body element
                $("<div>")
                    .hide()
                    .addClass("modal-overlay")
                    .click(function(event){
                            // Removes event
                            fx.boxout(event);
                        })
                    .appendTo("body");

                // Loads data into the modal window and
                // appends it to the body element
                modal
                    .hide()
                    .append(data)
                    .appendTo("body");

                // Fades in the modal window and overlay
                $(".modal-window,.modal-overlay")
                    .fadeIn("slow");
            },

        // Fades out the window and removes it from the DOM
        "boxout" : function(event) {
                // If an event was triggered by the element
                // that called this function, prevents the
                // default action from firing
                if ( event!=undefined )
                {
                    event.preventDefault();
                }

                // Removes the active class from all links
                $("a").removeClass("active");

                // Fades out the modal window and overlay,
                // then removes both from the DOM entirely
                $(".modal-window,.modal-overlay")
                    .fadeOut("slow", function() {
                            $(this).remove();
                        }
                    );
            },
            
            //Adds a new event to the markup after saving
            "addevent" : function(data, formData){
            	//Converts the query string to an object
            	var entry = fx.deserialize(formData),
            	
            	//Makes a date object for the current month
            		cal = new Date(NaN),
            		
            	//Makes a date object for a new event
            		event = new Date(NaN),
            		
            	//Extracts the calendar month from the H2 ID
            		cdata = $("h2").attr("id").split('-')[0],
            		
            	//Extracts the event day, month and year
            		date = entry.event_start.split(' ')[0],
            		
            	//Splits the event data into pieces
            		edata = date.split('-');
            		
            	//Sets the date foir the calendar date object
            	cal.setFullYear(cdata[1], cdata[2],1);
            	
            	//Sets the date for the event date object
            	event.setFullYear(edata[0], edata[1], edata[2]);
            	
            	//Since the date object is created using
            	//GMT, then adjusted for the local time zone,
            	//adjust the local offset to ensure a proper date
            	event.setMinutes(event.getTimeOffset());
            	
            	//If the year and month match, start the process
            	//of adding the new event to the calendar
            	if (cal.getFullYear()==event.getFullYear()
            			&& cal.getMonth()==event.getMonth() )
            	{
            		//Gets the day of the month for event
            		var day = String(event.getDate());
            		
            		//Adds a leading zero to 1 digit days
            		day = day.length==1 ? "0"+day : day;
            		
            		//Adds the new date link
            		$("<a>")
            			.hide()
            			.attr("href", "view.php?event_id="+data)
            			.text(entry.event_title)
            			.insertAfter($("strong:contains("+day+")"))
            			.delay(1000)
            			.fadeIn("slow");
            	}
            },
            
            //Deserializes the query string and returns
            //an event object
            "deserialize" : function(str){
            	//Breaks apart each name-value pair
            	var data = str.split("&"),
            	
            	//Declares variables for use in the loop
            		pairs=[], entry={}, key, val;
            	
            	//loops through each name-value pair
            	for(var x in data)
            		{
            			//Splits each pair into an array
            			pairs = data[x].split("=");
            			
            			//The first element is the name
            			key = pairs[0];
            			
            			//Second element is the value
            			val = pairs[1];
            			
            			//Reverses the URL encoding and stores
            			//each value as an object property
            			entry[key] = fx.urldecode(val);
            		}
            		return entry;            	
            },
          //Decodes a query string value
          "urldecode" : function(str){
          	//Converts plus sign to spaces
          	var converted = str.replace(/\+/g, ' ');
          	
          	//Converts and encoded entities back
          	return decodeURIComponent(converted);
          }
    };

// Pulls up events in a modal window
$("body").on("click", "li>a", function(event){

        // Stops the link from loading view.php
        event.preventDefault();

        // Adds an "active" class to the link
        $(this).addClass("active");

        // Gets the query string from the link href
        var data = $(this)
                        .attr("href")
                        .replace(/.+?\?(.*)$/, "$1");

        // Logs the query string
        console.log( data );

        // Checks if the modal window exists and
        // selects it, or creates a new one
        var modal = fx.initModal();

        // Creates a button to close the window
        $("<a>")
            .attr("href", "#")
            .addClass("modal-close-btn")
            .html("&times;")
            .click(function(event){
                        // Removes modal window
                        fx.boxout(event);
                    })
            .appendTo(modal);

        // Loads the event data from the DB
        $.ajax({
                type: "POST",
                url: processFile,
                data: "action=event_view&" + data,
                success: function(data){
                        fx.boxin(data, modal);
                    },
                error: function(msg) {
                        modal.append(msg);
                    }
            });

    });

//displays the edit form as a modal window
$("body").on("click", ".admin", function(event){
		
//Makes the cancel button on editing forms behave like the
//close button and fade out modal windows and overlays
$("body").on("click", ".edit-form a:contains(cancel)", function(event){
		fx.boxout(event);
});

//Edits events without reloading
$("body").on("click", ".edit-form input[type=submit]", function(event){
		
		//Prevents the form from submitting
		event.preventDefault();
		
		//Serializes the form data for use with $.ajax()
		var formData = $(this).parents("form").serialize();
		
		//Sends the data to the processing file
		$.ajax({
				type: "POST",
				url: processFile,
				data: formData,
				success: function(data){
					//Fades out the modal window
					fx.boxout();
						
					//Adds the event to the calendar
					fx.addevent(data, formData);
				},
				error: function(msg){
					alert(msg);
				}
		});
		
		//Logs a message to prove the handler was triggered
		console.log(formData);
		
});
		
		//Prevents the form from submitting
		event.preventDefault();
		
		//Loads the action for thew processing file
		var action = "edit_event";
		
		//Loads the editing form and displays it
		$.ajax({
				type: "POST",
				url: processFile,
				data: "action="+action,
				success: function(data){
						//Hides the form
						var form = $(data).hide(),
				
				//Make sure the modal window exists
				modal = fx.initModal();
		
				//Call the boxin function to create the
				//modal overlay and fade it in
				fx.boxin(null, modal);
				
				//Load the form into the window,
				//Fades in the content, and adds
				//a class to the form
					form
						.appendTo(modal)
						.addClass("edit-form")
						.fadeIn("slow");
				},
				error: function(msg){
					alert(msg);
				}
		});
		
	});

});

