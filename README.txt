RANDOMIZATION:
Base color randomization:
  Base colors for ALL categories in the experiment have saturation 0.99, value
  0.1, and hue drawn from a hue bank which is created in the following manner:
    1. at the beginning of the experiment, a randomly ordered bank of hues is
       created where each of the hues is seperated from the other by exactly
       1/10 and offset from 0 by a random number between 0 and 0.1.
    2. hues are taken away from the bank everytime a base color is generated
    3. when the hue bank is empty, it is created again in the same way, this
       time with a different offset between 0 and 0.1.


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

********************************************************************************

--------BirdToken-------
BirdToken.color - rgb hex code for color of bird
BirdToken.headStretch - 0 is min stretch, 1 is max
BirdToken.bodyStretch - 0 is min stretch, 1 is max
BirdToken.label - string that matches the id for an svg tag in the html
BirdToken.crest - boolean that says whether this bird has a plumed crest
BirdToken.tail - boolean that says whether this bird has a long tail

--------Stimuli.Bird-------
Bird.baseColor - latent mean color of birds of that category
Bird.headStretch - latent mean horizontal stretch of head for birds of that category
Bird.bodyStretch - latent mean vertical stretch of body for birds of that category
Bird.draw(label, crest, tail, scaleFactor)
  a function that draws a token bird and returns a BirdToken object with
  information about the bird that was drawn.
  parameters:
  label - string that matches the id for an svg tag in the html
  crest - boolean that says whether this bird has a plumed crest
  tail - boolean that says whether this bird has a long tail

********************************************************************************

--------MicrobeToken-------
MicrobeToken.color - rgb hex code for color of microbe body
MicrobeToken.spikesColor - rgb hex code for color of microbe's spikes
MicrobeToken.bumpsColor - rgb hex code for color of microbe's bumps
MicrobeToken.xRadius - 0 is min horizontal radius, 1 is max horizonal radius
MicrobeToken.yRadius - 0 is min vertical radius, 1 is max vertical radius
MicrobeToken.label - string that matches the id for an svg tag in the html
MicrobeToken.spikes - boolean that says whether this microbe has spikes
MicrobeToken.bumps - boolean that says whether this microbe has bumps

--------Stimuli.Microbe-------
Microbe.baseColor - latent mean color for monsters of that category
Microbe.baseSpikesColor - latent mean spikesColor for microbes of that category
Microbe.baseBumpsColor - latent mean bumpsColor for microbes of that category
Microbe.xRadius - latent mean "xRadius" for monsters of that category
Microbe.yRadius - latent mean "yRadius" for monsters of that category
Microbe.draw(label, spikes, bumps, scaleFactor)
  a function that draws a token microbe and returns a MicrobeToken object with
  information about the microbe that was drawn.
  parameters: label - string that matches the id for an svg tag in the html
              spikes - boolean that says whether this monster has spikes
              bumps - boolean that says whether this monster has bumps

********************************************************************************

--------MonsterToken-------
MonsterToken.color - rgb hex code for color of monster's body
MonsterToken.accentColor - rgb hex code for color of monter's feet and horns
MonsterToken.fatness - 0 is thinnes, 1 is fattest
MonsterToken.tallness - 0 is shortest, 1 is tallest
MonsterToken.label - string that matches the id for an svg tag in the html
MonsterToken.horns - boolean that says whether this monster has horns
MonsterToken.teeth - boolean that says whether this monster has teeth

--------Stimuli.Monster-------
Monster.baseColor - latent mean color for monsters of that category
Monster.baseAccentColor - latent mean accentColor for monsters of that category
Monster.fatness - latent mean fatness for monsters of that category
Monster.tallness - latent mean tallness for monsters of that category
Monster.draw(label, horns, teeth, scaleFactor)
  a function that draws a token monster and returns a MonsterToken object with
  information about the monster that was drawn.
  parameters: label - string that matches the id for an svg tag in the html
              horns - boolean that says whether this monster has horns
              teeth - boolean that says whether this monster has teeth

********************************************************************************
    
--------ErinTools.ColorRandomizer(nSteps)-------
Produces a randomly ordered bank of hues each of which is seperated from the
other by 1/nSteps (nSteps is by default 10) and offset from 0 by a random number
between 0 and 1/nSteps.
ColorRandomizer.get()
  A function that returns an rgb hex color using the next value in the hue bank,
  full saturation, and close to full brightness. When the hue bank becomes
  empty, this function updates the hue bank with the same nSteps but a new offset.
