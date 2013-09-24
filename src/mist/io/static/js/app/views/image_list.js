define('app/views/image_list', [
    'app/views/mistscreen',
    'text!app/templates/image_list.html','ember'],
    /**
     *
     * Images page
     *
     * @returns Class
     */
    function(MistScreen, image_list_html) {
        return MistScreen.extend({
	        template: Ember.Handlebars.compile(image_list_html),
	        
	        advancedSearch: false,
	        
	        init: function(){
	        	this._super();
	        	var that=this;
	            Ember.run.next(function(){
					$('.ui-input-search input').on('keypress', that.filterImages);
					//add this $('ul#images-list li.node:visible').length	        
	            });
	            $(window).on('scroll', this.didScroll);	

			},
	       
            willDestroyElement: function(){
            	$(window).off('scroll');
   			},
   			// this is called every time we scroll
			didScroll: function(){
			/**
			 * If the search field is empty we load the next 20 random images,
			 * if it contains a string we append the next 20 who have the string 
			 * in the name of the image
			 */
				if ($('.ui-input-search input').val() == ""){
				    if (Mist.isScrolledToBottom()) {
				  	    var items = Mist.backendsController.content;
				  	   
				  	   //We loop through the images of every backend and append 20 at a time 
				  	   var counter = 0;
				  	    for (var i = 0; i < items.length; i++) {
				  	    	for (var j = 0; j < items[i].images.content.length; j ++) {
				  	    		if(!(items[i].images.content[j].star) &&  Mist.renderedImages.content.indexOf(items[i].images.content[j]) == -1 && counter < 20) {
				  	    			Mist.renderedImages.pushObject(items[i].images.content[j]);
				  	    			counter++;
	
				  	    		}
				  	    	}
				  	    }
				    }
			   }else {
			  	   var items = Mist.backendsController.content;
			  	   var counter = 0;
     			   var term = $('.ui-input-search input').val();
			  	    for (var i = 0; i < items.length; i++) {
			  	    	for (var j = 0; j < items[i].images.content.length; j ++) {
			  	    		if(!(items[i].images.content[j].star) &&  Mist.renderedImages.content.indexOf(items[i].images.content[j]) == -1 && counter < 20 && items[i].images.content[j].name.indexOf(term) > -1) {
			  	    			Mist.renderedImages.pushObject(items[i].images.content[j]);
			  	    			counter++;

			  	    		}
			  	    	}
			  	    }
		   		}
			},
			
			isScrolledToBottom: function() {
    			var distanceToTop = $(document).height() - $(window).height(),
     		    top = $(document).scrollTop();

    			return top === distanceToTop;
  			},
  			
  			//This is called every time we type a search term and makes sure to always have at least 10
  			//results to choose from if possible
  			filterImages: function(){
  				if ($('.ui-input-search input').val()){
  					$("#images-advanced-search").css("display", "block");
  				}else {
  					$("#images-advanced-search").css("display", "none");  					
  				}
  				if ($('ul#images-list li.node:visible').length < 10) {
			  	   var items = Mist.backendsController.content;
			  	   var counter = 0;
     			   var term = $('.ui-input-search input').val();
			  	    for (var i = 0; i < items.length; i++) {
			  	    	for (var j = 0; j < items[i].images.content.length; j ++) {
			  	    		if(!(items[i].images.content[j].star) &&  Mist.renderedImages.content.indexOf(items[i].images.content[j]) == -1 && counter < 20 && items[i].images.content[j].name.indexOf(term) > -1) {
			  	    			Mist.renderedImages.pushObject(items[i].images.content[j]);
			  	    			counter++;

			  	    		}
			  	    	}
			  	    }  					
  				}
  			},
  			
  			advancedSearchClicked: function() {
  				var term = $('.ui-input-search input').val();
			  	var items = Mist.backendsController.content;
			  	var counter = 0;
		  	    for (var i = 0; i < items.length; i++) {
		  	    	for (var j = 0; j < items[i].images.content.length; j ++) {
		  	    		if((items[i].images.content[j].name.indexOf(term) > -1 || items[i].images.content[j].id.indexOf(term) > -1) && counter <20) {
		  	    			Mist.renderedImages.unshiftObject(items[i].images.content[j]);
		  	    		}
		  	    	}warn(9);
		  	    }    				
  			}
        });
    }
);
