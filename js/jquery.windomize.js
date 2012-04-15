/*!
 * windowmize - jQuery Plugin
 * version: 1.0 (11/04/2012)
 * @requires jQuery (v1.7.1 or later)
 * @optional jQuery-ui (v1.8.17 or later) for use with draggable or resizable options set to true
 *
 * Examples at t.b.a.
 * License: 
 *
 * Copyright 2012 Elger Lambert - elger@..
 *
 */
 
//TODO add config param to -not bind- focusOn.
//TODO add config param to -not bind- toggleContent.
//TODO add method/param to "override" focusOn business logic - full control - addFocus/removeFocus.
//TODO store resized width + height in Div's data

(function($) {

	var methods = {
		init: function( config ) {

			var config = $.extend(true,{}, $.windomize.defaults, config);

			return this.each(function() {
				console.log("init", config, $(this));

				var $this = $(this);
				var data = $this.data('windomize');
				// var tooltip = $('<div />', {
				// 	text : $this.attr('title')
				// });

				if ( ! data ) {
					$(this).data('windomize', {
						target : $this,
						moved : false,
						autoSwitchFocus : config.autoSwitchFocus,
						// tooltip : tooltip,
						duration : config.duration,
						title : $this.attr('title')
					});
				}

				data = $this.data('windomize');

				$this
					.addClass("windomized")
					.addClass("windomize-closed")
					.bind('hover.windomize', function(e){
						$this.toggleClass("windomize-hover");
					})
					.bind('mousedown.windomize', function(){
						// clear moved flag in order to distinguish a click from a drag
						data.moved = false;
					})
					.bind('mousemove.windomize', function(){
						data.moved = true;
					})
					.bind('click.windomize', function(){
						console.log("no?")
						$this.windomize('focusOn');
					})
				if ( config.appendTitleBar ) {
					$this
						.prepend('<div class="windomize-titlebar"></div>')
						.find(".windomize-titlebar")
						.bind('click.windomize', function(){
							if ( !data.moved ) {
								$this.windomize('toggleContent');
							}
						})					
						.append('<div class="windomize-restore">+</div>')
						.append('<p></p>')
						.find('p')
						.html(data.title ? data.title : config.title);
				}

				// Remove Title attribute
				if ( config.removeTitle ) {
					$this.removeAttr('title');
				}

				// Make the div $(this) Draggable
				if ( config.draggable ) {
					$this
						.draggable(config.draggableOptions)
				}

				// Make the div $(this) Resizable
				if ( config.resizable ) {					
					$this
						.resizable(config.resizableOptions);
					//disabled set through its setter function to ensure 
					//helper css is hidden. Bug in jquery-ui?
					if (config.resizableOptions.disabled) {
						$this.resizable( 'option', 'disabled', true );
					}
				}

/*				if ( config.autoFocus ) {
					$this
						.bind('click.windomize', function(){
							console.log("no?")
							$this.windomize('focusOn');
						})
				}*/

			});
		},

		destroy: function () {
			console.log("destroy triggered", this);
			return	this.each(function () {
				var $this = $(this);
				var data = $this.data('windomize');

				$this
					.unbind('.windomize')
					.resizable( 'option', 'disabled', false )
					.resizable('destroy')
					.draggable('destroy')
					.removeClass("windomized")
					.removeClass("windomize-closed")
					.removeClass("windomize-open")
					.removeClass("windomize-focus")
					.attr('title', data.title)
					.removeData('windomize')
					.find(".windomize-titlebar").remove();
			});
		},

		toggleContent: function () {

			return this.each(function() {
				var $this = $(this);
				var data = $this.data('windomize');
				console.log(data);

				$this.css('width','');
				$this.css('height','');
				var classChangeDirection = '';
				var fromClass = '';
				var toClass = '';

				if ($this.is(".windomize-open")){
					classChangeDirection = "windomize-closing"
					fromClass = "windomize-open";
					toClass = "windomize-closed";
					$this
						.resizable( 'option', 'disabled', true )
						.find(".windomize-restore").html("+");
				} else {
					classChangeDirection = "windomize-opening";
					fromClass = "windomize-closed";
					toClass = "windomize-open";
					if ( data.width ) {
						$this.animate(	{	width: data.width,
											height: data.height
										}, 	data.duration);
					}
					$this
						.resizable( 'option', 'disabled', false )
						.find(".windomize-restore").html("-");
				}

				$this
					.addClass(classChangeDirection)
					.switchClass(fromClass, toClass, data.duration)
					.removeClass(classChangeDirection, data.duration);
			});
		},

		focusOn: function () {

			return this.each(function() {
				var $this = $(this);
				var data = $this.data('windomize');
				console.log(data.moved);

				if($this.is(".windomize-closing")){
					$this.removeClass("windomize-focus");
					return;
				} 
				if($this.is(".windomize-open") || $this.is(".windomize-opening")){
					if($this.is(".windomize-focus")) {
						if( !data.autoSwitchFocus && !data.moved ){
							$this.removeClass("windomize-focus");
						}
					} else {
						if( data.autoSwitchFocus ) {
							$(".windomize-focus").removeClass("windomize-focus");
						}
						$this.addClass("windomize-focus");
					}
				}
			});
		}

	}

	$.windomize = {

		defaults: {

			removeTitle: true,
			draggable: true,
			resizable: true,
			duration: 200,
			autoFocus: true,
			autoSwitchFocus: true,
			draggableOptions: { addClasses: false },
			resizableOptions: 
			{ 	disabled: true/*,
				stop: 	function () { 
							$(this).data('windomize').width = $(this).css('width');
							$(this).data('windomize').height = $(this).css('height');
						} */
			}, // This only disables resizable when the window is closed.
			title: "",
			appendTitleBar: true

		}
	}

	$.fn.extend({
		windomize: function( method ) {

				if ( methods[method] ) {
					return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
				} else if ( typeof method === 'object' || ! method ) {
					return methods.init.apply( this, arguments );
				} else {
					$.error( 'Method ' +  method + ' does not exist on jQuery.windomize' );
				}
		}
	});

})(jQuery);