# ecosystem.js

For drawing dynamic stimuli of various species. You can draw a picture directly, or make a category to draw instances of later. Any properties unspecified will be randomly sampled. [Here's an example of the pretty pictures this script can draw](http://www.stanford.edu/~erindb/stimuli/large-ecosystem.html) (refresh the page to see the randomness).

## categories:

* currently available:
	* bird
	* bug
	* fish
	* flower
	* tree (added summer 2016 by Myra Cheng)

* to appear:
	* monster
	* crystal
	* microbe

## example code:

This is the code used in `ecosystem-demo.html` which can be viewed [here](http://www.stanford.edu/~erindb/stimuli/ecosystem-demo.html).

### html:

	<script src="jquery-2.0.3.min.js" type="text/javascript"></script>
	<script src="raphael.js" type="text/javascript"></script>
	<script src="ecosystem.js" type="text/javascript"></script>

	<svg id="svgID"></svg>

### js:

	var scale = 0.5;
	Ecosystem.draw(
		"bird", {"col1":"#ff0000",
				 "col2":"#00ff00",
				 "col3":"#0000ff",
				 "tar1":false,
				 "tar2":true,
				 "prop1":0,
				 "prop2":0},
		"svgID", scale)

This will draw a bug at half the default size (250px x 250px) with a red crest, green body, blue wing, no tail, with a short and skinny body and fat head.

You can specify all of these properties, or only some of them. You can even pass in an empty object `{}` if want *all* of the properties to be randomly sampled:

	var scale = 0.5;
	Ecosystem.draw("bird", {}, "svgID", scale)

You can also make categories by instantiating the `Genus` class with particular means and variances (any of which can be left out, in which case they will be set to defaults or randomly sampled):

	var genus = new Ecosystem.Genus("bird", {
		"col1":{"mean":"#ff0000"},
		"col2":{"mean":"#00ff00"},
		"col3":{"mean":"#0000ff"},
		"tar1":0.1, //almost never has a tail
		"tar2":0.9, //almost always has a crest
		"prop1":{"mean":0, "var":0.05}, //low height variance
		"prop1":{"mean":0, "var":0.5}, //high fatness variance
		"var":0.3 //overall variance (overwritten by any specified variances)
	})

Then to draw a member of this class:

	//var properties = {"tar1":true, "tar2":true}
	var properties = {}

	genus.draw("svg2", properties, scale);

Where `properties` can either be an empty object or an object that specifies some or all of the properties in the first example above.

## properties:

In the list below are all the properties you can specify for the critters that currenly exist. `col` stands for "color", `prop` stands for "proportion" (proportion of the way between two endpoints, e.g. fat and skinny), and `tar` stands for "target" (because originally these binary features were target features, though that doesn't have to be the case for your experiment).

When you instantiate a category, you pass in a *means-and-variances* object. When you draw a critter, you pass in a *properties* object. The property names (listed below) are the same for both kinds of objects (except that *means-and-variances* has one additional specifiable property name), but **the values attached to those property names are not the same**.

For example, when I want to specify a color (col1) for drawing:

	genus.draw({"col1":"#ff0000"}})

But when I want to specify a category mean for col1:

	genus = new Ecosystem("bird", {"col1":{"mean":"#ff0000"}})

For category colors (`col1`, `col2`, `col3`, `col4`, `col5`) and proportions (`prop1`,`prop2`), you can specify just a `mean`, just a `var`, or both. For category target properties (`tar1`, `tar2`), you specify a number between 0 and 1 which gives the probability within that category of having that feature. You can also specify one additional value in the *means-and-vars* object: `var`. `var` is a default variance, which will be overwritten if you explicitly specify a variance (like `col1:{var:0.1}`). Whenever there's a variance for a category and no mean, this program will randomly sample a category mean. Whenever there's a mean and no variance, I've chosen a default variance (which I think is pretty small).

* flower
	* col1=stem
	* col2=spots
	* col3=petals
	* col4=center
	* prop1=centersize
	* prop2=petallength
	* tar1=thorns
	* tar2=spots
* fish
	* col1=body
	* col2=fins
	* prop1=bodysize(short->tall)
	* prop2=tailsize
	* tar1=fangs
	* tar2=whiskers
* bug
	* col1=legs
	* col2=head
	* col3=body
	* col4=antennae
	* col5=wings
	* prop1=headsize(small->wide)
	* prop2=bodysize(narrow->fat)
	* tar1=antennae
	* tar2=wings
* bird
	* col1=crest/tail
	* col2=body
	* col3=wing
	* prop1=height
	* prop2=fatness(fat head & skinny body -> small head & fat body)
	* tar1=tail
	* tar2=crest
* tree
	* tar1=berries
	* tar2=leaves
	* col1=berries
	* col2=leaves
	* col3=trunk

## Additional files

* Inside `concept-art` directory:
	* `categories-fish.svg`: heirarchical categories of fish for Fred Callaway's experiments in 2015. Southern fish: nikfish and hapfish (thin bodies). Northern fish: delfish and wugfish (large bodies).