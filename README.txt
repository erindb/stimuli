long tailfeathers

RANDOMIZATION:


IN THE HTML:

<svg id="fep1"></svg>

IN THE JAVASCRIPT:

var fep = new Stimuli.Tree();
fep1 = fep.draw("fep1", true, false, 0.7);

DOCUMENTATION OF CLASSES AND METHODS

--------TreeToken----------
TreeToken.berryColor
  berry color of that drawn tree
TreeToken.leafColor
  leaf color of that drawn tree
TreeToken.trunkColor
  trunk color of that drawn tree
TreeToken.width
  width of that drawn tree
TreeToken.height
  height of that drawn tree
TreeToken.label
  label of that drawn tree
TreeToken.berries
  whether that drawn tree has berries
TreeToken.leaves
  whether that drawn tree has leaves

--------Tree-------
Tree.baseBerryColor
  latent mean color of berries for trees of that category
Tree.baseLeafColor
  latent mean color of leaves for trees of that category
Tree.baseTrunkColor
  latent mean color of trunk for trees of that category
Tree.baseWidth
  latent mean width for trees of that category
Tree.baseHeight
  latent mean height for trees of that category
Tree.draw(label, berries, leaves, scale)
  a function that draws a token tree and returns a TreeToken object with
  information about the tree that was drawn.
  parameters:
  berries - boolean that says whether this tree token has berries
  leaves - boolean that says whether this tree token has leaves
  label - string that matches the id for an svg tag in the html
  scale - a number that scales the whole image

--------BugToken----------
BugToken.bodyColor
  body color of that drawn tree
BugToken.wingsColor
  wings color of that drawn tree
BugToken.antennaeColor
  antennae color of that drawn tree
BugToken.bodyFatness
  body fatness of that drawn tree (0 is thinnest, 1 is fattest)
BugToken.headFatness
  head fatness of that drawn tree (0 is thinnest, 1 is fattest)
BugToken.label
  label of that drawn tree
BugToken.wings
  whether that drawn tree has wings
BugToken.stripes
  whether that drawn tree has stripes - NOT YET IMPLEMENTED

--------Bug-------
Bug.baseBodyColor
  latent mean color of bodies for bugs of that category
Bug.baseWingsColor
  latent mean color of wings for bugs of that category
Bug.baseAntennaeColor
  latent mean color of antennae for bugs of that category
Bug.baseBodyFatness
  latent mean fatness of body for bugs of that category (0 is thinnest,
  1 is fattest)
Bug.baseHeadFatness
  latent mean fatness of head for bugs of that category (0 is thinnest,
  1 is fattest)
Bug.draw(label, wings, stripes, scale)
  a function that draws a token tree and returns a BugToken class with
  information about the bug that was drawn.
  parameters:
  wings - boolean that says whether this tree token has wings
  stripes - boolean that says whether this tree token has stripes
  label - string that matches the id for an svg tag in the html
  scale - a number that scales the whole image

--------BirdToken-------
BirdToken.color - rgb hex code for color of bird
BirdToken.headStretch - 0 is min stretch, 1 is max
BirdToken.bodyStretch - 0 is min stretch, 1 is max
BirdToken.label - string that matches the id for an svg tag in the html
BirdToken.crest - boolean that says whether this bird has a plumed crest
BirdToken.tail - boolean that says whether this bird has a long tail

--------Bird-------
Bird.baseColor
  latent mean color of birds of that category
Bird.headStretch
  latent mean horizontal stretch of head for birds of that category
Bird.bodyStretch
  latent mean vertical stretch of body for birds of that category
Bird.draw(label, crest, tail, scaleFactor)
  a function that draws a token bird and returns a BirdToken object with
  information about the bird that was drawn.
  parameters:
  label - string that matches the id for an svg tag in the html
  crest - boolean that says whether this bird has a plumed crest
  tail - boolean that says whether this bird has a long tail

--------MicrobeToken-------
MicrobeToken.color
  rgb hex code for color of microbe (some systematic variation
  around this color for different parts of the microbe)
MicrobeToken.xRadius
  0 is min radius (not actually 0), 1 is max (not actually 1)
MicrobeToken.yRadius
  0 is min radius (not actually 0), 1 is max (not actually 1)
MicrobeToken.label
  string that matches the id for an svg tag in the html
MicrobeToken.spikes
  boolean that says whether this bird has spikes
MicrobeToken.bumps
  boolean that says whether this bird has bumps

--------Microbe-------
Microbe.baseColor
  latent mean color of microbes of that category
Microbe.xRadius
  latent mean horizontal radius. 0 is min radius (not actually 0, the real min
  radius is specified in the code), 1 is max (not actually 1)
Bug.yRadius
  latent mean vertical radius. 0 is min radius (not actually 0, the read min
  radius is specified in the code), 1 is max (not actually 1)
Microbe.draw(label, spikes, bumps, scaleFactor)
  a function that draws a token microbe and returns a MicrobeToken object with
  information about the microbe that was drawn.
  parameters:
  label - string that matches the id for an svg tag in the html
  spikes - boolean that says whether this bird has spikes
  bumps - boolean that says whether this bird has bumps
