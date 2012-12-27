/*
 * All sites
 */
$(function() {
	// All projects top nav
	$(".toggle-projects").on( "click", function( event ) {
		$("#global-project-select").slideToggle();
		event.preventDefault();
	});

	// CDN auto-select-all
	$( ".cdn input" ).on( "click", function() {
		if ( typeof this.select === "function" ) {
			this.select();
		}
	});
});





/*
 * API sites
 */
$(function() {
	$( ".entry-example" ).each(function() {
		var iframeSrc,
			src = $( this ).find( ".syntaxhighlighter" ),
			output = $( this ).find( ".code-demo" );

		if ( !src.length || !output.length ) {
			return;
		}

		iframeSrc = src.find( "td.code" ).text()
			.replace( /\s+/g, " " )
			.replace( "</head>",
				"<style>" +
					"html, body { border:0; margin:0; padding:0; }" +
					"body { font-family: 'Helvetica', 'Arial',  'Verdana', 'sans-serif'; }" +
				"</style>" +
				"</head>" )
			// IE <10 executes scripts in the order in which they're loaded,
			// not the order in which they're written. So we need to defer inline
			// scripts so that scripts which need to be fetched are executed first.
			.replace( /<script>(.+)<\/script>/,
				"<script>" +
				"window.onload = function() {" +
					"$1" +
				"};" +
				"</script>" );

		var iframe = document.createElement( "iframe" );
		iframe.src = "about:blank";
		iframe.width = "100%";
		iframe.height = output.attr( "data-height" ) || 250;
		iframe.style.border = "1px solid #eee";
		output.append( iframe );

		var doc = iframe.contentDocument ||
			(iframe.contentWindow && iframe.contentWindow.document) ||
			iframe.document ||
			null;

		if ( doc === null ) {
			return true;
		}

		doc.open();
		doc.write( iframeSrc );
		doc.close();
	});
});





/*
 * jquery.org
 */
$(function() {
	$(".flexslider").flexslider({
		controlNav: "false"
	});

	/*
	 * Join page
	 */
	(function() {
		// Enlarged goodies
		$(".enlarge").colorbox();

		// Gift forms
		var gifts = $(".choose-gifts").hide();
		$(".member-level .join").on( "click", function() {
			var gift = $( this ).nextAll(".choose-gifts").slideToggle();
			gifts.not( gift ).slideUp();
		});
	})();
});





/*
 * jqueryui.com
 */
$(function() {
	var demoFrame = $( ".demo-frame" ),
		demoDescription = $( ".demo-description" ),
		sourceView = $( ".view-source pre" ),
		demoList = $( ".demo-list" ),
		currentDemo = location.hash.substring( 1 );

	demoList.on( "click", "a", function( event ) {
		event.preventDefault();

		var filename = "/" + event.target.pathname.replace( /^\//, "" ),
			parts = filename.split( "/" ),
			plugin = parts[ 3 ],
			demo = parts[ 4 ].substring( 0, parts[ 4 ].length - 5 );

		$.getJSON( "/resources/demos/demo-list.json" ).then(function( demoList ) {
			demoDescription.html( $.grep( demoList[ plugin ], function( x ) {
				return x.filename === demo;
			})[ 0 ].description );
			demoFrame.attr( "src", filename );
		});

		$.get( filename.replace( "demos", "demos-highlight" ) ).then(function( content ) {
			sourceView.html( content );
		});

		demoList.find( ".active" ).removeClass( "active" );
		$( this ).parent().addClass( "active" );
		location.hash = "#" + demo;
	});

	$( ".view-source a" ).on( "click", function() {
		sourceView.animate({
			opacity: "toggle",
			height: "toggle"
		});
	});

	if ( currentDemo ) {
		demoList.find( "a" ).filter(function() {
			return this.pathname.split( "/" )[ 4 ] === (currentDemo + ".html");
		}).click();
	}
});





// Filter lists on api sites if on home, category, or search results pages
// if ( location.hostname.indexOf("api.") > -1 &&
// 		/\b(?:home|category|search-results)\b/.test( document.body.className ) ) {
// 	$("form.searchform").find( "input[type=text]" ).liveUpdate( "#body .inner" );
// }
