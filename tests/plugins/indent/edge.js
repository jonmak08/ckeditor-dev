/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,indentblock,indentlist */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P,
		allowedContent: true // Disable filter.
	}
};

var tests = {};

// These tests simply set the input and ouput HTML expected for the
// indent or outdent command exection.

// #7566
addTests( 'test indent on list item with text direction', 'indent', [
	[ '<ol dir="rtl"><li>a<ol dir="ltr"><li dir="ltr">b</li></ol></li><li>[c]</li></ol>',
	  '<ol dir="rtl"><li>a<ol dir="ltr"><li>b</li><li dir="rtl">c</li></ol></li></ol>' ]
] );

// #7907
addTests( 'test outdent on list item with direction', 'outdent', [
	[ '<ul dir="rtl"><li><p>^foo</p></li></ul>',
	  '<p dir="rtl">foo</p>' ],

	[ '<ul dir="rtl"><li>^foo<br /><strong>bar</strong></li></ul>',
	  '<p dir="rtl">foo<br /><strong>bar</strong></p>' ],

	[ '<ul dir="rtl"><li><h1>^foo</h1><div dir="ltr">bar</div></li></ul>',
	  '<h1 dir="rtl">foo</h1><div dir="ltr">bar</div>' ],

	[ '<ul dir="rtl"><li><h1>^foo</h1><br /><strong>bar</strong></ul>',
	  '<h1 dir="rtl">foo</h1><p dir="rtl"><br /><strong>bar</strong></p>' ],

	[ '<ul><li>foo</li><ul dir="rtl"><li>^bar</li></ul></ul>',
	  '<ul><li>foo</li><li dir="rtl">bar</li></ul>' ]
] );

// #7907
addTests( 'test outdent on list item with styles', 'outdent', [
	[ '<ul><li style="text-align:left;" class="alignleft"><p>^foo</p></li></ul>',
	  '<p class="alignleft" style="text-align:left;">foo</p>' ],

	[ '<ul><li style="text-align:left;" class="alignleft"><p class="foo" style="margin-left:20px;">^foo</p></li></ul>',
	  '<p class="foo alignleft" style="margin-left:20px;text-align:left;">foo</p>' ],

	[ '<ul><li class="alignleft" dir="rtl" style="text-align:left;">^foo<br /><strong>bar</strong></li></ul>',
	  '<p class="alignleft" dir="rtl" style="text-align:left;">foo<br /><strong>bar</strong></p>' ],

	[ '<ul><li class="alignleft" style="text-align:left;"><h1>^foo</h1><div>bar</div></li></ul>',
	  '<h1 class="alignleft" style="text-align:left;">foo</h1><div class="alignleft" style="text-align:left;">bar</div>' ],

	[ '<ul><li class="alignleft" dir="rtl" style="text-align:left;"><h1>^foo</h1><br /><strong>bar</strong></ul>',
	  '<h1 class="alignleft" dir="rtl" style="text-align:left;">foo</h1><p class="alignleft" dir="rtl" style="text-align:left;"><br /><strong>bar</strong></p>' ]
] );

// #8087
addTests( 'test indent list items in RLT list', 'indent', [
	[ '<ul dir="rtl"><li>1</li><li>[2</li><li>3]</li><li>4</li></ul>',
	  '<ul dir="rtl"><li>1<ul><li>2</li><li>3</li></ul></li><li>4</li></ul>' ]
] );

// #9057
addTests( 'test decrease nest list keeps inline style on list element', 'outdent', [
	[ '<ul><li>foo<ul><li style="text-align:right">^bar</li></ul></li></ul>',
	  '<ul><li>foo</li><li style="text-align:right;">bar</li></ul>' ]
] );


// #9063
addTests( 'test outdent nest list keeps styles on list root', 'outdent', [
	[ '<ul style="font-size:10px"><li>[foo <ul style="font-size:24px"><li>bar]</li></ul></li></ul>',
	  '<p>foo</p><ul style="font-size:24px;"><li>bar</li></ul>' ]
] );

// ### Finished adding tests.

function addTests( title, command, testsToAdd ) {
	for ( var i = 0 ; i < testsToAdd.length ; i++ ) {
		var testTitle = title + ( testsToAdd.length > 1 ? ' [' + i + ']' : '' );
		add( testTitle, command, testsToAdd[ i ][ 0 ], testsToAdd[ i ][ 1 ] );
	}

	function add( title, command, input, output ) {
		tests[ testTitle ] = function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( input );
			bot.execCommand( command );
			assert.areSame( output, bot.getData( true, true ) );
		};
	}
}

bender.test( tests );