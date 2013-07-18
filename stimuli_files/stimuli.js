//to document: ./jsdoc ~/Code/cocolab/Stimuli/stimuli_files/stimuli.js
//http://usejsdoc.org/

var ErinTools = {
  shuffle: function(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;}, // non-destructive.

  ColorRandomizer: function(nSteps) {
    var nSteps = nSteps || 10;
    function hues(n) {
      var h = [];
      var offset = Math.random() * .99 / n;
      for (var i=0;i<n-1;i++) {
        h.push((i/n)+offset);
      }
      return ErinTools.shuffle(h);
    }
    var myHues = hues(nSteps);
    
    this.get = get;
    function get(something, saturation, value) {
      if (myHues.length < 1) {
        myHues = hues(nSteps);
      }
      var h = myHues.shift();
      var s = ErinTools.uniformAroundMean(.99, .1);
      var v = ErinTools.uniformAroundMean(.99, .1);
      return Raphael.hsb2rgb(h, s, v).hex;
    }
  },
  
  uniformAroundMean: function(mean, radius) {
    var radius = radius || 0.2;
    if (mean + radius < 1) {
      var upper = mean + radius;
    } else {
      var upper = 1;
    }
    if (mean - radius > .1) {
      var lower = mean - radius;
    } else {
      var lower = .1;
    }
    var interval = upper - lower;
    return Math.random() * interval + lower;
  },
  
  // creates an image partway between two other images, as in the animations
  // by Raphael.js
  intermediate: function(from, to, pos) {
    var fromCurve = Raphael.path2curve(from);
    var toCurve = Raphael.path2curve(to);
    var diff = [];
    var attr = "path";
    //compute difference between paths and store in diff
    for (i = 0, ii = fromCurve.length; i < ii; i++) {
      diff[i] = [0];
      for (var j = 1, jj = fromCurve[i].length; j < jj; j++) {
        diff[i][j] = (toCurve[i][j] - fromCurve[i][j]);
      }
    }
    var S = " ";
    now = [];
    //compute new path string for intermediate image
    for (var i = 0, ii = fromCurve.length; i < ii; i++) {
      now[i] = [fromCurve[i][0]];
      for (var j = 1, jj = fromCurve[i].length; j < jj; j++) {
        now[i][j] = +fromCurve[i][j] + pos * diff[i][j];
      }
      now[i] = now[i].join(S);
    }
    return now.join(S);
  }
}

/** Contains methods for creating experimental stimuli. These stimuli are 
dynamic svg images of (10) different domains: trees, birds, bugs, flowers,
fish, planets, microbes, islands, monsters, and crystals. These domains are
meant to be naturally occuring kinds of things that might be seen in an alien
planetary system. For each domain, the user can create arbitrarily many
categories. Within each category, three non-target continuous properties (e.g.
size, shape, and color) vary around the category mean. The user can then draw
arbitrarily many token elements from that category, specifying whether they have
or do not have each of two binary target properties. */
var Stimuli = {

  strokeColor: "#000000",
  strokeWidth: 2,
  containerWidth: 250,
  containerHeight: 270,
  colorScheme: new ErinTools.ColorRandomizer(),
  
  viewBox: function(label, scaleFactor) {
    var svgContainer = document.getElementById(label);
    svgContainer.setAttribute("width", (scaleFactor*Stimuli.containerWidth).toString() + "px");
    svgContainer.setAttribute("height", (scaleFactor*Stimuli.containerHeight).toString() + "px");
    svgContainer.setAttribute("viewBox", "0 0 " +
                              Stimuli.containerWidth.toString() +
                              " " + Stimuli.containerHeight.toString());
  },
  
  flipY: function(y) {
    return (Stimuli.containerHeight - y);
  },
  
  lighten: function(origColor, saturation) {
    var saturation = saturation || false;
    var eps = 0.3;
    var c = Raphael.color(origColor);
    if (c.v + eps < 1) {
      var value = c.v + eps;
    } else {
      var value = 1;
    }
    if (saturation) {
      var saturationEps = 0.4;
      if (c.s - saturationEps > 0) {
        var sat = c.s - saturationEps;
      } else {
        var sat = 0;
      }
    } else {sat = c.s;}
    var newColor = Raphael.hsb2rgb(c.h, sat, value);
    return newColor.hex;
  },
  
  stroke: function(object, color) {
    object.attr("stroke", Stimuli.strokeColor);
    object.attr("stroke-width", Stimuli.strokeWidth);
    object.attr("fill", color);
  },
  
  darken: function(origColor) {
    var eps = 0.3;
    var c = Raphael.color(origColor);
    if (c.v - eps < 1) {
      var value = c.v - eps;
    } else {
      var value = 1;
    }
    var newColor = Raphael.hsb2rgb(c.h, c.s, value);
    return newColor.hex;
  },

  makeGradient: function(intro, origColor) {
    var light = Stimuli.lighten(origColor);
    var dark = Stimuli.darken(origColor);
    var grad = intro + light + "-" + dark;
    return grad;
  },

  myColor: function(meanColor, hVar, sVar, vVar) {
    var hVar = hVar || 0.01;
    var sVar = sVar || 0.1;
    var vVar = vVar || 0.1;
    var c = Raphael.color(meanColor);
    var hue = ErinTools.uniformAroundMean(c.h, hVar);
    var saturation = ErinTools.uniformAroundMean(c.s, sVar);
    var value = ErinTools.uniformAroundMean(c.v, vVar);
    var newColor = Raphael.hsb2rgb(hue, saturation, value);
    return newColor.hex;
  },

  /** Represents a tree category. Has 3 mean colors (baseTrunkColor,
      baseBerryColor, baseLeafColor), mean baseWidth, and mean baseHeight.
      @constructor*/
  Tree: function() {
  
    var baseBerryColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseLeafColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseTrunkColor = Stimuli.colorScheme.get(true, .5, .8);
    var baseWidth = Math.random();
    var baseHeight = Math.random();
    /** A string. The hex code for the latent mean color of the berries.
    E.g. "#FF0000". */
    this.baseBerryColor = baseBerryColor;
    /** A string. The hex code for the latent mean color of the leaves.
    E.g. "#FF0000". */
    this.baseLeafColor = baseLeafColor;
    /** A string. The hex code for the latent mean color of the trunk.
    E.g. "#FF0000". */
    this.baseTrunkColor = baseTrunkColor;
    /** latent mean "width" of trunk - actually a number between 0 and 1 where
        0 represents the minimum width and 1 represents the maximum width.
        E.g. 0.13984732927294. */
    this.baseWidth = baseWidth;
    /** latent mean "height" of trunk - actually a number between 0 and 1 where
        0 represents the minimum height and 1 represents the maximum height.
        E.g. 0.13984732927294. */
    this.baseHeight = baseHeight;

    //-----------HEIGHT AND WIDTH OF TREE----------//
    //for x values, distance from 101.5 should multiply by 1+ uniform(0,1)
    //for y values, ......
    var locs = {"bottom left": 0, "small lower": 3, "lower left": 9,
                "upper left": 15, "upper right": 24, "lower right": 30,
                "bottom right": 36};
    var origTrunkX = [96, 101, 105, 109, 113, 114, 113, 112, 110, 107, 110, 114,
                      113, 114, 114, 114, 114, 114, 116, 121, 124, 125, 126, 128,
                      127, 125, 123, 123, 124, 131, 131, 128, 126, 133, 136, 141,
                      147, 130, 113, 96];
    var origTrunkY = [1, 10, 20, 30, 44, 59, 73, 79, 85, 90, 85, 93, 97,
                      100, 107, 109, 103, 97, 92, 90, 95, 98, 99, 106,
                      101, 92, 84, 75, 70, 75, 74, 56, 36, 18, 11, 5, 1,
                      1, 1, 1].map(function(y) {return Stimuli.containerHeight - y;});
    var xCenter = (origTrunkX[locs["bottom left"]] +
                   origTrunkX[locs["bottom right"]])/2;

    //-----------TRUNK--------------//
    function drawTrunk(paper, trunkX, trunkY) {
      var trunkColor = Stimuli.myColor(baseTrunkColor);
      var trunkGradient = Stimuli.makeGradient("0-", trunkColor);
      var trunkPath = "M " + trunkX[0] + "," + trunkY[0] + " C";
      for (var i=1; i < trunkX.length; i++) {
        trunkPath += (" " + trunkX[i] + "," + trunkY[i]);
      }
      trunkPath += " z";
      var trunk = paper.path(trunkPath);
      Stimuli.stroke(trunk, trunkGradient);
      return trunkColor;
    }

    //-----------BRANCHES-----------//
    function drawBranches(paper, trunkX, trunkY) {
      var branchPathStrings = [
                           "M " + trunkX[locs["small lower"]] + "," + 
                           trunkY[locs["small lower"]] + " c 0,-3 0,-6 -1,-9 " +
                           "-1,-5 -4,-9 -8,-12 -4,-2 -9,-2 -12,1 -3,2 -4,7 " +
                           "-2,10 1,3 4,4 7,3 3,-1 5,-5 3,-7 -1,-2 -3,-2 -5,-1" +
                           " -1,1 -1,3 1,4 1,1 2,-3 0,-2", //small lower branch

                           "M "+trunkX[locs["lower left"]] + "," +
                           trunkY[locs["lower left"]] + " c -9,-12 -32,-13 " +
                           "-44,-6 -4,3 -11,0 -16,-2 -3,-2 -6,-5 -7,-9 0,-4 " +
                           "2,-8 6,-9 2,-1 5,0 7,2 2,2 2,6 0,8 -1,2 -4,2 -6,0" +
                           " -1,-1 -1,-4 0,-5 1,-1 3,0 3,1 1,1 " + 
                           "-2,2 -1,1", //upper tendril off of lower left branch

                           "M " + trunkX[locs["lower left"]] + "," +
                           trunkY[locs["lower left"]] + " c -11,-12 -27,-14 " +
                           "-40,-8 -5,2 -10,6 -13,11 -7,11 -9,24 -8,37 1,9 " +
                           "8,17 17,17 8,0 16,-7 16,-15 1,-7 -5,-15 -13,-15 " +
                           "-7,0 -12,6 -11,13 1,5 6,9 11,8 4,-1 7,-7 4,-11 " +
                           "-2,-4 -9,-2 -8,2 " +
                           "0,3 6,3 4,0", //main part of lower left branch

                           "M " + trunkX[locs["lower left"]] + "," +
                           trunkY[locs["lower left"]]+" c -3,-3 -6,-7 -10,-8 " +
                           "-8,-3 -17,0 -22,6 -4,6 -5,15 0,21 3,3 8,5 12,4 " +
                           "4,-1 7,-6 6,-10 0,-3 -3,-6 -6,-5 -2,0 -4,3 -3,5 " +
                           "0,1 3,2 3,0", //lower tendril off of lower left branch

                           "M " + trunkX[locs["upper left"]] + "," +
                           trunkY[locs["upper left"]]+" c 0,-2 -1,-5 -2,-7 " +
                           "-4,-8 -10,-15 -18,-17 -6,-2 -13,-1 -18,2 -4,2 -8,7" +
                           " -8,12 0,5 5,10 10,9 4,0 8,-5 7,-9 0,-4 -5,-7 " +
                           "-9,-5 -3,1 -4,5 -2,8 2,2 5,2 6,-1 1,-2 -1,-4 -3,-4" +
                           " -2,0 -2,4 0,3", //tendril #1 of upper left branch

                           "M " + trunkX[locs["upper left"]] + "," +
                           trunkY[locs["upper left"]] + " c 1,-12 -2,-24 " +
                           "-10,-33 -9,-9 -23,-12 -35,-9 -5,1 -10,4 -15,7 -3,4" +
                           " -4,10 0,14 5,5 15,3 18,-4 1,-3 -1,-7 -5,-8 -3,0 " +
                           "-7,2 -6,6 0,4 7,2 5,-1 0,-1 " +
                           "-3,0 -1,1", //tendril #2 of upper left branch

                           "M " + trunkX[locs["upper left"]] + "," +
                           trunkY[locs["upper left"]] + " c 2,-24 -15,-45 " +
                           "-10,-53 1,-2 4,-3 8,-3 4,0 7,5 6,9 -1,3 -4,5 -7,4" +
                           " -2,-1 -4,-3 -3,-5 0,-2 2,-3 4,-2 1,0 2,2 1,3 0,1" +
                           " -1,1 -2,1 0,0 -1,-1 0,-1 " +
                           "0,0 0,0 1,0", //tendril #3 of upper left branch

                           "M " + trunkX[locs["upper left"]] + "," +
                           trunkY[locs["upper left"]] + " c -1,-15 1,-35 13,-44" +
                           " 4,-3 11,-6 17,-5 8,2 15,8 13,17 -1,7 -8,12 " +
                           "-15,11 -5,-1 -9,-6 -8,-11 1,-4 5,-7 9,-6 3,1 5,3 " +
                           "4,6 -1,2 -2,3 -4,3 -1,0 -2,-2 -1,-3 0,-1 " +
                           "1,-1 2,-1", //tendril #4 of upper left branch

                           "M " + trunkX[locs["upper right"]] + "," +
                           trunkY[locs["upper right"]] + " c 5,-8 13,-16 " +
                           "23,-19 17,-6 37,2 44,18 4,8 3,19 -2,26 -3,5 -10,7" +
                           " -16,4 -6,-2 -11,-9 -9,-15 1,-5 8,-9 13,-6 4,2 " +
                           "7,8 3,11 -3,3 -8,1 -8,-3 -1,-4 " +
                           "6,-3 4,0", //upper tendril of upper right branch

                           "M " + trunkX[locs["upper right"]] + "," +
                           trunkY[locs["upper right"]] + " c 2,-5 6,-8 10,-11 " +
                           "6,-4 12,-8 20,-10 2,0 4,1 6,1 6,1 11,5 13,10 1,4 " +
                           "0,10 -4,12 -3,2 -8,0 -9,-3 -1,-3 0,-7 3,-8 3,-1 " +
                           "5,2 4,4 0,2 -5,2 -4,0 " +
                           "0,-1 2,-1 1,0", //lower tendril of upper right branch

                           "M " + trunkX[locs["lower right"]] + "," +
                           trunkY[locs["lower right"]]+" c 22,-19 40,-3 40,20" +
                           " -2,11 -11,20 -22,18 -8,-1 -15,-10 -13,-19 1,-7 " +
                           "8,-13 14,-11 5,1 9,6 8,12 -1,4 -5,7 -8,6 -2,-1 " +
                           "-4,-3 -3,-6 1,-1 2,-3 4,-2" //lower right branch
                          ];
      for (var i=0; i<branchPathStrings.length; i++) {
        var pathString = branchPathStrings[i];
        var myPath = paper.path(pathString);
        Stimuli.stroke(myPath, ""); 
      }
    }

    //------------LEAVES------------//
    function drawLeaves(paper, trunkX, trunkY) {
      /*xposition and yposition of where stem attaches to tree, direction leaves
      curve toward: either clockwise or counterclockwise, and then what branch the
      berry is on, and then the angle of rotation.*/
      var leafYs = [152, 148, 154, 158, 152, 116, 106, 96, 98, 75, 65, 82, 65].map(function(x) {return Stimuli.containerHeight - x;});
      var leafPositions = [ [75, leafYs[0], "clock", "upper left", -20],
                            [95, leafYs[1], "clock", "upper left", 0],
                            [128, leafYs[2], "counter", "upper left", 0],
                            [145, leafYs[3], "counter", "upper left", 10],
                            [155, leafYs[4], "counter", "upper left", 60],
                            [180, leafYs[5], "counter", "upper right", 0],
                            [192, leafYs[6], "counter", "upper right", 25],
                            [195, leafYs[7], "counter", "upper right", 60],
                            [97, leafYs[8], "clock", "lower left", 20],
                            [49, leafYs[9], "clock", "lower left", -40],
                            [46, leafYs[10], "clock", "lower left", -100],
                            [145, leafYs[11], "counter", "lower right", -5],
                            [170, leafYs[12], "counter", "lower right", 80] ];
      var leafColor = Stimuli.myColor(baseLeafColor);
      function drawLeaf(pos) {
        var direction = pos[2];
        var branch = pos[3];
        var angle = pos[4];
        var index = locs[branch];
        var changeX = trunkX[index] - origTrunkX[index];
        var changeY = trunkY[index] - origTrunkY[index];
        var xpos = pos[0] + changeX;
        var ypos = pos[1] + changeY;
        if (direction == "clock") {
          var stemPath = "M " + xpos.toString() + "," + ypos.toString() +
                     "c -4.66532,-5.31951 -8.13198,-12.67083 -8.09411,-19.20008";
          var leafPath = "M " + (xpos - 9).toString() + "," + (ypos-29).toString() +
                     " c 7.88487,4.26057 10.52989,11.20663 10.52989,11.20663 0.32771,12.87926 -8.71699,17.94538 -15.71952,8.05647 -0.86462,-4.4842 0.51588,-14.34595 5.18963,-19.2631 z";
        } else {
          var stemPath = "M " + xpos.toString() + "," + ypos.toString() +
                     "c 4.46508,-4.3145 8.59388,-12.94298 8.52128,-19.01436";
          var leafPath = "M " + (xpos+10).toString() + "," + (ypos-29).toString() +
                     " c -7.97815,4.08324 -10.77777,10.96844 -10.77777,10.96844 0.44351,4.6407 0.50774,7.66519 4.207,11.9888 3.95476,2.09474 8.30737,0.62026 11.3285,-3.58295 0.96464,-4.46375 -0.19507,-14.3539 -4.75773,-19.37429 z";
        }
        var leaf = paper.path(leafPath);
        Stimuli.stroke(leaf, leafColor);
        leaf.rotate(angle, xpos, ypos);

        var stem = paper.path(stemPath);
        Stimuli.stroke(stem, "");
        stem.rotate(angle, xpos, ypos);
        //stem.transorm("r" + angle.toString + "," + xpos.toString() + "," +
        //              ypos.toString());
      }
      leafPositions.map(drawLeaf);
      return leafColor;
    }

    //------------BERRIES------------//
    function drawBerries(paper, trunkX, trunkY) {
      /*xposition and yposition of upper left-hand corner, direction berries "fall":
      either out to the left or out to the right, and then what branch the berry
      is on.*/
      var berriesYs = [140, 153, 166, 136, 149, 119, 101, 83, 83, 55, 57].map(function(x) {return Stimuli.containerHeight - x;});
      var berryPositions = [ [51, berriesYs[0], "left", "upper left"],
                             [83, berriesYs[1], "left", "upper left"],
                             [115, berriesYs[2], "right", "upper left"],
                             [116, berriesYs[3], "right", "upper left"],
                             [157, berriesYs[4], "right", "upper left"],
                             [182, berriesYs[5], "right", "upper right"],
                             [70, berriesYs[6], "left", "lower left"],
                             [90, berriesYs[7], "right", "lower left"],
                             [143, berriesYs[8], "right", "lower right"],
                             [54, berriesYs[9], "left", "lower left"],
                             [172, berriesYs[10], "right", "lower right"] ];
      var berryColor = Stimuli.myColor(baseBerryColor);
      function drawBerryClumps(positions) {
        var berryRadius = 4.5;
        /* drawBerryClump takes in the position where the stem connects to the
        branch and draws two joined berries there */
        function drawBerryClump(pos) {
          // drawBerry draws one berry as a circle with paperCenter at x,y
          function drawBerry(p) {
            var berry = paper.circle(p[0], p[1], berryRadius);
            Stimuli.stroke(berry, berryColor);  
          }
          var branch = pos[3];
          var index = locs[branch];
          var changeX = trunkX[index] - origTrunkX[index];
          var changeY = trunkY[index] - origTrunkY[index];
          var xpos = pos[0] + changeX;
          var ypos = pos[1] + changeY;
          var direction = pos[2];
          if (direction == "right") {
            var rightBerryPos = [xpos+13, ypos+14];
            var leftBerryPos = [xpos+1, ypos+19];
            var stemXPos = (xpos+12).toString();
            var stemYPos = (ypos+10).toString();
            var stem = paper.path("M" + stemXPos + " " + stemYPos +
                                  "c -0.3 -7 -6 -7 -11 -8, 2 4 4 8 -1 13");
          } else {
            var rightBerryPos = [xpos-13, ypos+14];
            var leftBerryPos = [xpos-1, ypos+19];
            var stemXPos = (xpos-12).toString();
            var stemYPos = (ypos+10).toString();
            var stem = paper.path("M" + stemXPos + " " + stemYPos +
                                  "c 0.3 -7 6 -7 11 -8, -2 4 -4 8 1 13");
          }
          Stimuli.stroke(stem, "");
          drawBerry(rightBerryPos);
          drawBerry(leftBerryPos);
        }
        positions.map(drawBerryClump);
      }
      drawBerryClumps(berryPositions);
      return berryColor;
    }

    //-------DRAW TREE------//
    /** Draws a tree token from a tree category and returns an object with
        information about the tree that was drawn.
    
        @param {string} label - matches the id for an svg tag in the html
        @param {boolean} berries - whether this tree token has berries
        @param {boolean} leaves - whether this tree token has leaves
        @param {number} scaleFactor - scales the whole image
        @returns {object} treeProperties - */
    this.draw = function(label, berries, leaves, scaleFactor) {
      var w = ErinTools.uniformAroundMean(baseWidth);
      var h = ErinTools.uniformAroundMean(baseHeight);
      var widthFactor = w * 1.5 + 0.7;
      var heightFactor = h + 0.7;
      function randWidth(x) {
        return (xCenter + (x-xCenter)*widthFactor).toString();
      }
      function randHeight(y) {
        var lowest = origTrunkY[locs["bottom left"]];
        return lowest + heightFactor * (y - lowest);
      }
      var trunkX = origTrunkX.map(randWidth);
      var trunkY = origTrunkY.map(randHeight);

      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight); //apparently can't put var here
      var trunkColor = drawTrunk(paper, trunkX, trunkY);
      drawBranches(paper, trunkX, trunkY);
      if (leaves) {
        var leafColor = drawLeaves(paper, trunkX, trunkY)
      } else {
        var leafColor = null;
      };
      if (berries) {
        var berryColor = drawBerries(paper, trunkX, trunkY)
      } else {
        var berryColor = null;
      };
      var svgContainer = document.getElementById(label);
      svgContainer.setAttribute("width", (scaleFactor*Stimuli.containerWidth).toString() + "px");
      svgContainer.setAttribute("height", (scaleFactor*Stimuli.containerHeight).toString() + "px");
      svgContainer.setAttribute("viewBox", "0 0 " + Stimuli.containerWidth.toString() + " " + Stimuli.containerHeight.toString());
      return {
        berryColor: berryColor,
        leafColor: leafColor,
        trunkColor: trunkColor,
        width: w,
        height: h,
        label: label,
        berries: berries,
        leaves: leaves
      };
    }
  },

  Bug: function() {
    var paperCenter = [(Stimuli.containerWidth/2), (Stimuli.containerHeight/2)];
    var baseBodyColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseWingsColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseAntennaeColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseBodyFatness = Math.random();
    var baseHeadFatness = Math.random();
    this.baseBodyColor = baseBodyColor;
    this.baseWingsColor = baseWingsColor;
    this.baseAntennaeColor = baseAntennaeColor;
    this.baseBodyFatness = baseBodyFatness;
    this.baseHeadFatness = baseHeadFatness;
    
    //eyes
    function drawEyes(paper, bodyXRadius, headYRadius) {
      var eyeRadius = 10;
      var eyeOffset = [15, 10];
      var leftEye = paper.circle(paperCenter[0]-bodyXRadius-eyeOffset[0],
                             paperCenter[1]-headYRadius+eyeOffset[1],
                             eyeRadius);
      leftEye.attr("fill", "#000000");
      var rightEye = paper.circle(paperCenter[0]-bodyXRadius-eyeOffset[0],
                              paperCenter[1]+headYRadius-eyeOffset[1],
                              eyeRadius);
      rightEye.attr("fill", "#000000");
    }
    
    function drawLegs(paper, bodyYRadius) {
      //legs (lower left ordering)
      var offsets = [[43, -14], [50, -4], [57, 6],
                 [30, -10], [32, 0], [34, 10], [36, 20],
                 [15, -3], [15, 7], [15, 17] ];
      var legSets = [ ["back","left"], ["front","left"], ["back","right"], ["front","right"] ];
      var legPieceRadius = 8;
      for (var j=0; j<legSets.length; j++) {
        legSet = legSets[j];
        for (var i=0; i< offsets.length; i++) {
          if (legSet[0] == "back") {
            var x = paperCenter[0] + offsets[i][0];
          } else {
            var x = paperCenter[0] - offsets[i][0];
          }
          if (legSet[1] == "left") {
            var y = paperCenter[1] + bodyYRadius + offsets[i][1];
          } else {
            var y = paperCenter[1] - bodyYRadius - offsets[i][1];
          }
          var legPiece = paper.circle(x, y, legPieceRadius);
          legPiece.attr("fill", "#666666");
          legPiece.attr("stroke-width", "0");
          legPiece.attr("stroke", "#666666");
        }
      }
    }
    
    function drawAntennae(paper, bodyXRadius, headXRadius, headYRadius) {
      //antennae
      //antennaeXPos = paperCenter[0]-bodyXRadius-headXRadius+(eyeRadius/3);
      var antennaeColor = Stimuli.myColor(baseAntennaeColor);
      var antennaeXPos = paperCenter[0]-bodyXRadius-headXRadius+(10/3);
      var leftAntennaYPos = paperCenter[1] + (headYRadius/3);
      var rightAntennaYPos = paperCenter[1] - (headYRadius/3);
      var leftAntennaStroke = paper.path("M " + antennaeXPos.toString() + "," + 
                                   leftAntennaYPos.toString() +
                                   "c -23,-7 -22,12 -42,9");
      leftAntennaStroke.attr("stroke-width", 8);
      leftAntennaStroke.attr("stroke", Stimuli.strokeColor);
      var leftAntenna = paper.path("M " + antennaeXPos.toString() + "," + 
                                   leftAntennaYPos.toString() +
                                   "c -23,-7 -22,12 -41,9");
      leftAntenna.attr("stroke-width", 6);
      leftAntenna.attr("stroke", antennaeColor);
      var rightAntennaStroke = paper.path("M " + antennaeXPos.toString() + "," + 
                                    rightAntennaYPos.toString() + " c -6,2" +
                                    " -12,2 -17,0 -10,-5 -13,-10 -25,-9");
      rightAntennaStroke.attr("stroke-width", 8);
      rightAntennaStroke.attr("stroke", Stimuli.strokeColor);
      var rightAntenna = paper.path("M " + antennaeXPos.toString() + "," + 
                                    rightAntennaYPos.toString() + " c -6,2" +
                                    " -12,2 -17,0 -10,-5 -13,-10 -24,-9");
      rightAntenna.attr("stroke-width", 6);
      rightAntenna.attr("stroke", antennaeColor);
      return antennaeColor;
    }
    
    function drawWings(paper, bodyYRadius, wings) {
      //wings
      var wingsColor = Stimuli.myColor(baseWingsColor);
      if (wings) {
        var frontLeftWing = paper.path("M " + paperCenter[0].toString() + "," + 
                                    (paperCenter[1]+(bodyYRadius/2)).toString() +
                                    "c -16,9 -28,42 -33,58 -9,37 3,63 45,8 " +
                                    "14,-18 11,-41 11,-61 z");
        Stimuli.stroke(frontLeftWing, Stimuli.makeGradient("0-",wingsColor));
        var frontRightWing = paper.path("M " + paperCenter[0].toString() + "," + 
                                    (paperCenter[1]-(bodyYRadius/2)).toString() +
                                    "c -16,-9 -28,-42 -33,-58 -9,-37 3,-63 45,-8 " +
                                    "14,18 11,41 11,61 z");
        Stimuli.stroke(frontRightWing, Stimuli.makeGradient("0-",wingsColor));
        var backLeftWing = paper.path("M " + (paperCenter[0]+35).toString() + "," + 
                                    (paperCenter[1]+(bodyYRadius/2)).toString() +
                                    "c 11,8 20,34 23,47 6,30 -2,50 -31,6 -10,-15" +
                                    " -8,-33 -8,-49 z");
        Stimuli.stroke(backLeftWing, Stimuli.makeGradient("180-",wingsColor));
        var backRightWing = paper.path("M " + (paperCenter[0]+35).toString() + "," + 
                                    (paperCenter[1]-(bodyYRadius/2)).toString() +
                                    "c 11,-8 20,-34 23,-47 6,-30 -2,-50 -31,-6 -10,15" +
                                    " -8,33 -8,49 z");
        Stimuli.stroke(backRightWing, Stimuli.makeGradient("180-",wingsColor));
      }
      return wingsColor;
    }
    
    function drawBody(paper, bodyXRadius, bodyYRadius) {
      //body
      var bodyColor = Stimuli.myColor(baseBodyColor);
      var body = paper.ellipse(paperCenter[0], paperCenter[1], bodyXRadius, bodyYRadius);
      Stimuli.stroke(body, Stimuli.makeGradient("r",bodyColor));
      return bodyColor;
    }
    
    function drawHead(paper, bodyXRadius, headXRadius, headYRadius) {
      //head
      var headXPos = paperCenter[0]-bodyXRadius;
      var headYPos = paperCenter[1];
      var head = paper.ellipse(headXPos, headYPos,
                           headXRadius, headYRadius);
      Stimuli.stroke(head, "r#777777-#555555");
      drawEyes(paper, bodyXRadius, headYRadius);
    }
    
    this.draw = function(label, wings, antennae, scaleFactor) {
      var bodyFatness = ErinTools.uniformAroundMean(baseBodyFatness);
      var headFatness = ErinTools.uniformAroundMean(baseHeadFatness);
      var headYRadius = (headFatness)*30 + 20;
      var headXRadius = 25;
      var bodyYRadius = (bodyFatness)*30 + 20;
      var bodyXRadius = 50;
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      drawLegs(paper, bodyYRadius);
      if (antennae) {
        var antennaeColor = drawAntennae(paper, bodyXRadius, headXRadius, headYRadius);
      } else {
        var antennaeColor = null;
      }
      var wingsColor = drawWings(paper, bodyYRadius, wings);
      var bodyColor = drawBody(paper, bodyXRadius, bodyYRadius);
      drawHead(paper, bodyXRadius, headXRadius, headYRadius);
      //rotate
      var angle = 120;
      paper.forEach(function (el) {
                      el.transform("r"+angle+","+paperCenter[0].toString()+","+paperCenter[1].toString());
                    });
      //resize
      var svgContainer = document.getElementById(label);
      svgContainer.setAttribute("width", (scaleFactor*Stimuli.containerWidth).toString() + "px");
      svgContainer.setAttribute("height", (scaleFactor*Stimuli.containerHeight).toString() + "px");
      svgContainer.setAttribute("viewBox", "0 0 " + Stimuli.containerWidth.toString() + " " + Stimuli.containerHeight.toString());
      return {
        bodyColor: bodyColor,
        wingsColor: wingsColor,
        antennaeColor: antennaeColor,
        bodyFatness: bodyFatness,
        headFatness: headFatness,
        label: label,
        wings: wings,
        antennae: antennae
      };
    }
  },
  
  Bird: function() {
    var paperCenter = [(Stimuli.containerWidth/2), ((Stimuli.containerHeight/2)-25)];
    var baseColor = Stimuli.colorScheme.get();
    this.baseCrestColor = Stimuli.colorScheme.get();
    this.baseTailColor = Stimuli.colorScheme.get();
    var baseHeadStretch = Math.random();
    var baseBodyStretch = Math.random();
    this.baseColor = baseColor;
    this.baseHeadStretch = baseHeadStretch;
    this.baseBodyStretch = baseBodyStretch;
    function drawHead(paper, color, crest, gradColor, crestColor) {
      var headCenter = [paperCenter[0], paperCenter[1]-35];
      var headStretch = ErinTools.uniformAroundMean(baseHeadStretch) * 2 + .7;
      var head = paper.ellipse(headCenter[0], headCenter[1], 25*headStretch, 25);
      Stimuli.stroke(head, gradColor);
      if (crest) {
        var crest = paper.path("M "+headCenter[0].toString()+","+(headCenter[1]-16).toString()+" c -3,-13 -3,-27 -2,-41 0,-5 0,-10 2,-15 2,1 2,6 2,9 1,14 2,29 2,44 1,-14 1,-29 5,-43 0,-2 3,-7 4,-2 1,10 0,20 -1,30 -1,5 -1,10 -2,14 3,-11 5,-23 8,-33 1,-3 2,-2 2,1 0,12 -2,24 -4,36 0,1 1,-3 1,-5 2,-9 4,-18 7,-27 3,-4 2,4 2,6 -1,10 -4,20 -7,30 2,-9 5,-18 9,-26 1,-3 4,-2 3,1 -1,10 -5,19 -9,28 -1,2 -1,2 0,0 2,-5 5,-11 9,-15 3,-1 0,5 0,7 -2,5 -5,10 -8,15 3,-4 6,-8 10,-10 3,1 -1,6 -2,7 -1,2 -5,6 -5,6 4,0 8,-2 12,-1 0,3 -5,4 -7,5 -2,1 -6,3 -7,2 4,1 9,2 12,5 -1,3 -6,1 -8,1 -2,0 -5,-1 -5,-2 3,2 7,3 9,7 -2,2 -7,0 -10,0 -2,-1 -5,-1 -2,-3 3,-4 4,-9 4,-14 -1,-7 -5,-14 -11,-18 -4,-3 -9,-1 -12,2 -2,1 -3,6 -4,5 -5,-10 -8,-21 -8,-32 -1,-3 2,-6 4,-2 4,8 5,17 7,26 0,1 0,3 1,4 z");
        crest.transform("s"+headStretch.toString()+",1,"+headCenter[0].toString()+","+headCenter[1].toString());
        Stimuli.stroke(crest, crestColor);
      }
      var leftEyePatch = paper.path("M "+(headCenter[0]-20).toString() +","+(headCenter[1]+5).toString() +" c 2,1 12,0 12,0 4,0 1,-8 -2,-12 -9,-10 -15,8 -11,12 z");
      leftEyePatch.attr("fill", "#000000");
      leftEyePatch.transform("s"+headStretch.toString()+",1,"+headCenter[0].toString()+","+headCenter[1].toString());
      var rightEyePatch = paper.path("M "+(headCenter[0]+9).toString() +","+(headCenter[1]+7).toString() +" c -2,1 -4,0 -5,0 -1,0 -2,0 -3,-1 -1,-1 -1,-3 0,-4 1,-2 2,-5 3,-7 1,-1 3,-2 5,-2 3,0 6,0 9,1 2,1 3,3 3,5 0,2 -2,4 -4,5 -2,1 -5,2 -7,3 z");
      var leftEyeDot = paper.circle(headCenter[0]-(13*headStretch), headCenter[1], 4);
      leftEyeDot.attr("fill","#ffffff");
      rightEyePatch.attr("fill", "#000000");
      rightEyePatch.transform("s"+headStretch.toString()+",1,"+headCenter[0].toString()+","+headCenter[1].toString());
      var rightEyeDot = paper.circle(headCenter[0]+(8*headStretch), (headCenter[1]+1), 4);
      rightEyeDot.attr("fill","#ffffff");
      var beak = paper.path("M "+(headCenter[0]-(6*headStretch)).toString()+","+(headCenter[1]+5).toString()+" c 0.0805,5.09883 -0.02228,10.30964 4,13 5.55789,-1.10878 6.47702,-6.85631 9,-11 -2.24042,-1.18583 -4.85841,-1.61651 -6.5,-4 -3.148068,2.13877 -4.594123,1.72452 -6.5,2 z");
      Stimuli.stroke(beak, "#ffff00");
      return headStretch;
    }
    function drawBody(paper, color, tail, gradColor, tailColor) {
      var bodyStretch = ErinTools.uniformAroundMean(baseBodyStretch) * 1 + 0.5;
      if (tail) {
        //var tail = paper.path("m "+(paperCenter[0]+40).toString()+","+(paperCenter[1]+30*(bodyStretch)).toString()+" c  93.041702,66.6439 62.708612,55.1315 0.566359,6.6972 24.219543,16.1729 127.541683,98.4836 -2.315079,6.5466 70.203552,48.3289 71.370392,57.77 -4.801623,3.2366 31.342565,20.6587 80.305665,60.7674 -7.288272,-0.073 60.818577,41.2828 21.46453,21.8232 -8.136197,-2.2717 z");
        var tail = paper.path("m "+(paperCenter[0]+40).toString()+","+(paperCenter[1]+30*(bodyStretch)).toString()+" c 137.26897,150.89247 82.32553,110.54987 0.30161,10.02344 46.18326,48.1754 176.28904,249.77883 -3.11677,7.44872 92.78521,131.08631 86.30285,142.69291 -5.89011,0.6876 37.68329,59.04719 107.18694,190.15081 -8.66356,-6.07301 65.48223,117.84362 17.00792,63.34319 -9.54987,-9.90587");
        Stimuli.stroke(tail, tailColor);
      }
      var feetPositions = [[paperCenter[0]-6, paperCenter[1]+(47*bodyStretch)],
                           [paperCenter[0]+9, paperCenter[1]+(52*bodyStretch)]];
      function drawFeet(footPos) {
        var foot = paper.path("M "+footPos[0].toString()+","+footPos[1].toString()+" c   -4.399089,0.11316 -7.038982,4.87269 -10.212137,8.224 4.826226,-2.61036 8.926115,-5.61798 10.461214,-3.94752 -1.485313,6.67276 -0.358531,8.74561 0,12.17151 l 3.487071,-12.17151 c 5.224559,2.71563 6.202493,7.26752 9.215831,10.52671 -1.077715,-3.29906 -2.116802,-8.64624 -4.711083,-10.91146 0.779699,-1.28702 4.098125,-1.19294 4.581633,-1.11636 -0.273048,-0.92977 -5.365348,-1.37347 -6.844693,-1.78849 z");
        Stimuli.stroke(foot, "#999999");
      }
      feetPositions.map(drawFeet);
      
      var leftLeg = paper.path("M "+(paperCenter[0]-14).toString()+","+(paperCenter[1]+20).toString()+" c   0,2.96064 7.472295,25.98784 7.472295,25.98784 l 5.977836,1.31584 c 2.371438,-4.19555 4.387931,-8.67243 3.487072,-15.46112 z");
      Stimuli.stroke(leftLeg, color);
      leftLeg.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      
      var rightLeg = paper.path("M "+(paperCenter[0]).toString()+","+(paperCenter[1]+25).toString()+" c 0,2.96064 7.472295,25.98785 7.472295,25.98785 l 5.977836,1.31584 c 2.371438,-4.19569 4.387931,-8.67258 3.487071,-15.46113 z");
      rightLeg.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      Stimuli.stroke(rightLeg, color);
      
      var body = paper.path("m "+(paperCenter[0]+30).toString()+","+(paperCenter[1]+5).toString()+" c 2,8 6,15 6,24 0,4 -3,8 -7,9 -7,2 -15,0 -22,-2 -9,-2 -17,-7 -23,-14 -4,-6 -8,-12 -10,-19 -2,-7 1,-14 6,-18 7,-6 16,-8 25,-7 8,1 15,7 18,14 3,5 5,10 6,15 z");
      //body.attr("fill", color);
      Stimuli.stroke(body, Stimuli.makeGradient("r",color));
      body.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      var wing = paper.path("m "+(paperCenter[0]).toString()+","+(paperCenter[1]-15).toString()+" c -4,13 -7,28 -3,42 22,24 45,48 67,72 -8,-23 -11,-48 -18,-72 -4,-14 -8,-28 -17,-40 -4,-6 -12,-10 -20,-7 -3,1 -6,3 -9,5 z");
      Stimuli.stroke(wing, Stimuli.makeGradient("0-", color));
      wing.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      return bodyStretch;
    }
    this.draw = function(label, crest, tail, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(baseColor);
      var crestColor = Stimuli.myColor(this.baseCrestColor);
      var tailColor = Stimuli.myColor(this.baseTailColor);
      var gradColor = Stimuli.makeGradient("r",color);
      var bodyStretch = drawBody(paper, color, tail, gradColor, tailColor);
      var headStretch = drawHead(paper, color, crest, gradColor, crestColor);
      var svgContainer = document.getElementById(label);
      svgContainer.setAttribute("width", (scaleFactor*Stimuli.containerWidth).toString() + "px");
      svgContainer.setAttribute("height", (scaleFactor*Stimuli.containerHeight).toString() + "px");
      svgContainer.setAttribute("viewBox", "0 0 " + Stimuli.containerWidth.toString() + " " + Stimuli.containerHeight.toString());
      return {
        color: color,
        headStretch: headStretch,
        bodyStretch: bodyStretch,
        label: label,
        crest: crest,
        tail: tail
      };
    }
  },
  
  Microbe: function() {
    var paperCenter = [(Stimuli.containerWidth/2), (Stimuli.containerHeight/2)+30];
    var baseColor = Stimuli.colorScheme.get();
    var baseBumpsColor = Stimuli.colorScheme.get();
    var baseSpikesColor = Stimuli.colorScheme.get();
    this.baseColor = baseColor;
    this.baseSpikesColor = baseSpikesColor;
    this.baseBumpsColor = baseBumpsColor;
    var baseXRadius = Math.random();
    this.baseXRadius = baseXRadius;
    var baseYRadius = Math.random();
    this.baseYRadis = baseYRadius;
    this.draw = function(label, spikes, bumps, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(baseColor);
      var bumpsColor = Stimuli.myColor(baseBumpsColor);
      var spikesColor = Stimuli.myColor(baseSpikesColor);
      var xRadius = ErinTools.uniformAroundMean(baseXRadius);
      var yRadius = ErinTools.uniformAroundMean(baseYRadius);
      var xRad = getRadius(xRadius);
      var yRad = getRadius(yRadius);
      function getRadius(r) {
        var minRad = 50;
        var maxRad = 75;
        return (r*(maxRad-minRad))+minRad;
      }
      function drawMicrobe() {
        var microbe = paper.ellipse(paperCenter[0], paperCenter[1], xRad, yRad);
        Stimuli.stroke(microbe, Stimuli.lighten(color));
        var microbe = paper.ellipse(paperCenter[0], paperCenter[1],
                                    xRad-10, yRad-10);
        microbe.attr("stroke", Stimuli.makeGradient("r",color));
      }
      function drawSpikes() {
        var numSpikes = 10;
        var path = " c -7.37145,8.60285 -4.92803,15.10123 -3.4763,20.33065 1.74961,-5.96315 15.17277,-6.52157 35.23965,-6.63636 -19.99246,-3.3422 -30.94628,-9.42435 -31.76335,-13.69429 z";
        for (var i=0; i<numSpikes; i++) {
          var angle = (360/numSpikes*i);
          if (0 <= angle && angle < 90) {
            var xPos = ((xRad*yRad)/Math.sqrt( Math.pow((xRad*Math.tan(angle*Math.PI/180)),2) + Math.pow(yRad,2)));
            var yPos = xPos*Math.tan(angle*Math.PI/180);
          } else if (angle == 90) {
            xPos = 0;
            yPos = yRad;
          } else if (90 < angle && angle < 180) {
            var xPos = -((xRad*yRad)/Math.sqrt( Math.pow((xRad*Math.tan(angle*Math.PI/180)),2) + Math.pow(yRad,2)));
            var yPos = xPos*Math.tan(angle*Math.PI/180);
          } else if (180 <= angle && angle < 270) {
            var xPos = -((xRad*yRad)/Math.sqrt( Math.pow((xRad*Math.tan(angle*Math.PI/180)),2) + Math.pow(yRad,2)));
            var yPos = xPos*Math.tan(angle*Math.PI/180);
          } else if (angle == 270) {
            var xPos = 0;
            var yPos = yRad;
          } else {
            var xPos = ((xRad*yRad)/Math.sqrt( Math.pow((xRad*Math.tan(angle*Math.PI/180)),2) + Math.pow(yRad,2)));
            var yPos = xPos*Math.tan(angle*Math.PI/180);
          }
          var newX = xPos + paperCenter[0];
          var newY = yPos + paperCenter[1];
          var spike = paper.path("M "+newX+","+newY+path);
          Stimuli.stroke(spike, spikesColor);
          spike.transform("r"+angle.toString()+","+newX+","+newY+"s1.2");
        }
      }
      function drawBumps() {
        var bumps = [[0, -yRad*0.9, 0, 2], //check
                     [xRad*.8, -yRad*0.7, 30, 1.5], //check
                     [xRad*1.1, yRad*.2, 90, 2],
                     [xRad*.8, yRad*.9, 140, 1],
                     [-xRad*.7, -yRad*.3, -70, 1],
                     [-xRad*.5, yRad*.7, 220, 1.5]];
        var path = " c -3.29329,-14.55549 -17.85423,-14.47568 -19.45361,0.82595 6.11244,2.81268 12.61909,2.35379 19.45361,-0.82595 z";
        for (var i=0; i<bumps.length; i++) {
          var xPos = (bumps[i][0] + paperCenter[0]).toString();
          var yPos = (bumps[i][1] + paperCenter[1]).toString();
          var angle = bumps[i][2];
          var size = bumps[i][3];
          var bump = paper.path("M "+xPos+","+yPos+path);
          Stimuli.stroke(bump, bumpsColor);
          bump.transform("r"+angle+"s"+size);
        }
      }
      function drawFlagella() {
        var flagella = [ [xRad*.2, -yRad*.9, " c 3.63199,-9.70735 8.13447,-19.86075 6.99736,-30.45549 -0.81137,-7.26636 -9.65889,-7.75067 -15.0405,-5.49436 -17.5309,6.1243 -32.53766,17.54047 -47.55821,28.15115 -28.24648,20.54551 -54.48065,43.6724 -82.28697,64.78072 -2.02735,1.48837 -8.77238,6.29091 -4.02481,1.63709 21.09873,-21.94014 44.86865,-41.14737 69.06383,-59.54326 19.36709,-14.09234 39.05179,-28.43461 61.41722,-37.4175 6.60964,-2.1808 15.41193,-5.51324 21.39878,-0.2241 4.99149,6.38653 2.18554,15.17709 0.34754,22.26835 -2.33082,5.542 -3.98891,15.24678 -8.0284,17.70407 -0.76195,-0.46889 -1.52389,-0.93778 -2.28584,-1.40667 z"],
                          [xRad*.3, -yRad*.8, " c 8.6416,-12.09471 18.7184,-24.4765 21.04587,-39.5903 1.39892,-7.98292 -6.66683,-13.16609 -13.80245,-12.89431 -20.50163,-0.32744 -40.08092,7.16019 -59.21385,13.67196 -48.96154,17.95524 -95.54355,41.55548 -142.58505,63.8921 32.35928,-20.78225 67.07364,-37.66666 102.15075,-53.31518 28.27954,-11.91918 57.08493,-24.0268 87.67825,-28.35165 9.44332,-0.8289 21.76232,-1.94872 28.04348,6.73337 5.01662,9.7003 -0.55912,20.70415 -4.7912,29.65228 -4.42595,7.45577 -9.05812,17.71781 -15.04432,22.34571 -1.1605,-0.71466 -2.32099,-1.42932 -3.48148,-2.14398 z"  ],
                          [xRad*.4, -yRad*.7, " c 21.82031,-17.02996 42.59717,-35.71303 60.47897,-56.90115 5.00136,-6.83302 11.78436,-14.08678 11.36241,-23.08394 -3.96862,-9.2495 -16.80227,-5.10142 -24.54251,-4.40734 -55.28113,8.02775 -112.65691,11.37662 -167.28102,-2.65548 -17.95941,-5.05159 -36.21285,-11.59004 -50.6643,-23.76149 10.73077,12.68042 27.31082,18.22714 42.56441,23.4585 51.33072,15.31823 105.93258,14.83581 158.69805,8.70295 10.57185,-0.44473 21.66861,-5.56666 31.9327,-1.22406 6.73119,7.46573 -3.06372,16.84186 -7.51747,23.15804 -16.59201,19.26412 -36.12298,35.80519 -56.19262,51.31663 -2.40088,0.67623 0.99244,3.86371 1.16138,5.39734 z"]];
        for (var i=0; i<flagella.length; i++) {
          var xPos = (flagella[i][0] + paperCenter[0]).toString();;
          var yPos = (flagella[i][1] + paperCenter[1]).toString();;
          var path = flagella[i][2];
          var flagellum = paper.path("M "+xPos+","+yPos+path);
          Stimuli.stroke(flagellum, Stimuli.darken(color));
        }
      }
      drawFlagella();
      if (spikes) {drawSpikes()};
      drawMicrobe();
      if (bumps) {drawBumps()};
      Stimuli.viewBox(label, scaleFactor);
      return {
        color: color,
        bumpsColor: bumpsColor,
        spikesColor: spikesColor,
        xRadius: xRadius, //a number from 0 to 1
        yRadius: yRadius, //0 means min, 1 means max
        label: label,
        spikes: spikes,
        bumps: bumps
      };
    }
  },
  
  Monster: function() {
    this.baseTallness = Math.random();
    this.baseFatness = Math.random();
    this.baseColor = Stimuli.colorScheme.get();
    this.baseAccentColor = Stimuli.colorScheme.get();
    
    var data = $.csv.toObjects(Stimuli.images.monster);

    var endpoints = { shortSkinny: data[0],
                      shortFat: data[1],
                      tallSkinny: data[2],
                      tallFat: data[3] };
    var pieces = ["body", "left eye", "left pupil", "right eye", "right pupil",
                  "mouth", "left arm", "right arm", "left foot",
                  "right foot", "left toe1", "left toe2", "left toe3",
                  "right toe1", "right toe2", "right toe3",
                  "left pad", "right pad"];
    var teethPieces = ["left tooth", "right tooth"];
    var hornsPieces = ["left horn", "right horn", "left horn line1",
                       "left horn line2", "right horn line1",
                       "right horn line2" ];
    function getPathString(p, tallness, fatness) {
      var ss = endpoints.shortSkinny[p];
      var sf = endpoints.shortFat[p];
      var shortFatEnough = ErinTools.intermediate(ss, sf, fatness);
      var ts = endpoints.tallSkinny[p];
      var tf = endpoints.tallFat[p];
      var tallFatEnough = ErinTools.intermediate(ts, tf, fatness);
      return ErinTools.intermediate(shortFatEnough, tallFatEnough, tallness);
    }
    this.draw = function(label, horns, teeth, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var tallness = ErinTools.uniformAroundMean(this.baseTallness);
      var fatness = ErinTools.uniformAroundMean(this.baseFatness);
      var color = Stimuli.myColor(this.baseColor);
      var accentColor = Stimuli.myColor(this.baseAccentColor);
      var lightAccent = Stimuli.lighten(accentColor, true);
      var colors = {"left eye": "#ffffff",
                    "left pupil": "#000000",
                    "right eye": "#ffffff",
                    "right pupil": "#000000",
                    "mouth": color,
                    "body": Stimuli.makeGradient("r", color),
                    "left arm": color,
                    "right arm": color,
                    "left foot": accentColor,
                    "right foot": accentColor,
                    "left toe1": lightAccent,
                    "left toe2": lightAccent,
                    "left toe3": lightAccent,
                    "right toe1": lightAccent,
                    "right toe2": lightAccent,
                    "right toe3": lightAccent,
                    "left pad": lightAccent,
                    "right pad": lightAccent,
                    "left tooth": "#ffffff",
                    "right tooth": "#ffffff",
                    "left horn": accentColor,
                    "right horn": accentColor,
                    "left horn line1": accentColor,
                    "left horn line2": accentColor,
                    "right horn line1": accentColor,
                    "left horn line2": accentColor };
      var paperCenter = [(Stimuli.containerWidth/2), (Stimuli.containerHeight/2)];
      for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        var pathString = getPathString(piece, tallness, fatness);
        var drawnPath = paper.path(pathString);
        Stimuli.stroke(drawnPath, colors[piece]);
        drawnPath.transform("s0.8,"+paperCenter[0]+","+paperCenter[1]);
      }
      if (teeth) {
        for (var i = 0; i < teethPieces.length; i++) {
          var piece = teethPieces[i];
          var pathString = getPathString(piece, tallness, fatness);
          var drawnPath = paper.path(pathString);
          Stimuli.stroke(drawnPath, colors[piece]);
          drawnPath.transform("s0.8,"+paperCenter[0]+","+paperCenter[1]);
        }
      }
      if (horns) {
        for (var i = 0; i < hornsPieces.length; i++) {
          var piece = hornsPieces[i];
          var pathString = getPathString(piece, tallness, fatness);
          var drawnPath = paper.path(pathString);
          Stimuli.stroke(drawnPath, colors[piece]);
          drawnPath.transform("s0.8,"+paperCenter[0]+","+paperCenter[1]);
        }
      }
      Stimuli.viewBox(label, scaleFactor);
      return {
        color: color,
        accentColor: accentColor,
        tallness: tallness, //a number from 0 to 1
        fatness: fatness, //0 means min, 1 means max
        label: label,
        teeth: teeth,
        horns: horns
      };
    }
  },

  Fish: function() {
    this.baseTailSize = Math.random();
    this.baseTallness = Math.random();
    this.baseColor = Stimuli.colorScheme.get();
    this.baseFinColor = Stimuli.colorScheme.get();
    
    var data = $.csv.toObjects(Stimuli.images.fish);

    var endpoints = { smallShort: data[0],
                      smallTall: data[1],
                      bigShort: data[2],
                      bigTall: data[3] };
                      
    var pieces = ["body", "eye", "pupil", "lower fin", "upper fin"];
    var fangsPieces = ["fang"];
    var whiskersPieces = ["whisker1", "whisker2", "whisker3" ];
    
    this.draw = function(label, fangs, whiskers, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var tailSize = ErinTools.uniformAroundMean(this.baseTailSize);
      var tallness = ErinTools.uniformAroundMean(this.baseTallness);
      var color = Stimuli.myColor(this.baseColor);
      var finColor = Stimuli.myColor(this.baseFinColor);
      var gradColor = Stimuli.makeGradient("r", color);
      var colors = {"eye": "#ffffff",
                    "pupil": "#000000",
                    "body": gradColor,
                    "lower fin": finColor,
                    "upper fin": finColor,
                    "fang": "#ffffff",
                    "whisker1": "",
                    "whisker2": "",
                    "whisker3": "" };
      var getPathString = function(p) {
        var ss = endpoints.smallShort[p];
        var st = endpoints.smallTall[p];
        var smallTallEnough = ErinTools.intermediate(ss, st, tallness);
        var bs = endpoints.bigShort[p];
        var bt = endpoints.bigTall[p];
        var bigTallEnough = ErinTools.intermediate(bs, bt, tallness);
        return ErinTools.intermediate(smallTallEnough, bigTallEnough, tailSize);
      }
      var paperCenter = [(Stimuli.containerWidth/2), (Stimuli.containerHeight/2)];
      Stimuli.drawPaths(paper, pieces, colors, getPathString);
      if (fangs) {
        Stimuli.drawPaths(paper, fangsPieces, colors, getPathString);
      }
      if (whiskers) {
        Stimuli.drawPaths(paper, whiskersPieces, colors, getPathString);
      }
      Stimuli.viewBox(label, scaleFactor);
      return {
        color: color,
        finColor: finColor,
        tallness: tallness,
        tailSize: tailSize,
        label: label,
        fangs: fangs,
        whiskers: whiskers
      };
    }
  },
  
  Flower: function() {
    this.basePetalColor = Stimuli.colorScheme.get();
    this.baseCenterColor = Stimuli.colorScheme.get();
    this.baseSpotsColor = Stimuli.colorScheme.get();
    this.baseStemColor = Stimuli.colorScheme.get();
    this.baseCenterSize = Math.random();
    this.basePetalLength = Math.random();
    
    var data = $.csv.toObjects(Stimuli.images.flower);

    var endpoints = { smallShort: data[0],
                      smallLong: data[1],
                      bigShort: data[2],
                      bigLong: data[3] };
    
    this.draw = function(label, spots, thorns, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      
      var petalColor = Stimuli.myColor(this.basePetalColor);
      var centerColor = Stimuli.myColor(this.baseCenterColor);
      var spotsColor = Stimuli.myColor(this.baseSpotsColor);
      var stemColor = Stimuli.myColor(this.baseStemColor);
      var centerSize = ErinTools.uniformAroundMean(this.baseCenterSize);
      var petalLength = ErinTools.uniformAroundMean(this.basePetalLength);
      
      var colors = {"stem":stemColor,
                    "thorny stem":stemColor,
                    "light petals":Stimuli.makeGradient("r", Stimuli.lighten(petalColor)),
                    "dark petals":Stimuli.makeGradient("r", Stimuli.darken(petalColor)),
                    "center":Stimuli.makeGradient("r", centerColor),
                    "spot11":spotsColor,
                    "spot12":spotsColor,
                    "spot13":spotsColor,
                    "spot21":spotsColor,
                    "spot22":spotsColor,
                    "spot23":spotsColor,
                    "spot31":spotsColor,
                    "spot32":spotsColor,
                    "spot33":spotsColor,
                    "spot41":spotsColor,
                    "spot42":spotsColor,
                    "spot43":spotsColor,
                    "spot51":spotsColor,
                    "spot52":spotsColor,
                    "spot53":spotsColor,
                    "spot61":spotsColor,
                    "spot62":spotsColor,
                    "spot63":spotsColor,
                    "spot71":spotsColor,
                    "spot72":spotsColor,
                    "spot73":spotsColor};
      
      var getPathString = function(p) {
        var ss = endpoints.smallShort[p];
        var sl = endpoints.smallLong[p];
        var smallLongEnough = ErinTools.intermediate(ss, sl, petalLength);
        var bs = endpoints.bigShort[p];
        var bl = endpoints.bigLong[p];
        var bigLongEnough = ErinTools.intermediate(bs, bl, petalLength);
        return ErinTools.intermediate(smallLongEnough, bigLongEnough, centerSize);
      }
                        
      var pieces = ["dark petals", "light petals", "center"];
      var spotsPieces = ["spot11", "spot12", "spot13", "spot21", "spot22",
                         "spot23", "spot31", "spot32", "spot33", "spot41",
                         "spot42", "spot43", "spot51", "spot52", "spot53",
                         "spot61", "spot62", "spot63", "spot71",
                         "spot72", "spot73"];
      var thornsPieces = ["thorny stem"];
      var noThornsPieces = ["stem"];
      
      if (thorns) {
        Stimuli.drawPaths(paper, thornsPieces, colors, getPathString);
      } else {
        Stimuli.drawPaths(paper, noThornsPieces, colors, getPathString);
      }
      Stimuli.drawPaths(paper, pieces, colors, getPathString);
      if (spots) {
        Stimuli.drawPaths(paper, spotsPieces, colors, getPathString);
      }
      
      Stimuli.viewBox(label, scaleFactor);
      return {
        petalColor: petalColor,
        centerColor: centerColor,
        spotsColor: spotsColor,
        stemColor: stemColor,
        petalLength: petalLength,
        centerSize: centerSize,
        label: label,
        spots: spots,
        thorns: thorns
      };
    }
  },
  
  Crystal: function() {
    var data = $.csv.toObjects(Stimuli.images.crystal);
    this.color = Stimuli.colorScheme.get();
    this.bubblesColor = Stimuli.colorScheme.get();
    this.streaksColor = Stimuli.colorScheme.get();
    this.outsideSize = Math.random();
    this.centerSize = Math.random();
    function reflection(c) {
      return "0-"+c+"-#ffffff-"+c;
    }
    var pieces = ["center", "face1", "face2", "face3", "face4", "face5",
                  "face6", "face7", "face8", "face9", "face10", "face11"];
    var bubblesPieces = ["bubble1", "reflect1", "bubble2", "reflect2",
                         "bubble3", "reflect3", "bubble4", "reflect4",
                         "bubble5", "reflect5"];
    var streaksPieces = ["streak11", "streak12", "streak13", "streak14"];
    var endpoints = { smallSmall: data[0],
                      smallBig: data[1],
                      bigSmall: data[2],
                      bigBig: data[3] };
    this.draw = function(label, bubbles, streaks, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(this.color);
      var bubblesColor = Stimuli.myColor(this.bubblesColor);
      var streaksColor = Stimuli.myColor(this.streaksColor);
      var centerSize = ErinTools.uniformAroundMean(this.centerSize);
      var outsideSize = ErinTools.uniformAroundMean(this.outsideSize);
      var getPathString = function(p) {
        var ss = endpoints.smallSmall[p];
        var sb = endpoints.smallBig[p];
        var smallCenter = ErinTools.intermediate(ss, sb, outsideSize);
        var bs = endpoints.bigSmall[p];
        var bb = endpoints.bigBig[p];
        var bigCenter = ErinTools.intermediate(bs, bb, outsideSize);
        return ErinTools.intermediate(smallCenter, bigCenter, centerSize);
      }
      grad = reflection(color);
      streaksGrad = reflection(streaksColor);
      var colors = { "center":grad,
                     "face1":grad,
                     "face2":grad,
                     "face3":grad,
                     "face4":grad,
                     "face5":grad,
                     "face6":grad,
                     "face7":grad,
                     "face8":grad,
                     "face9":grad,
                     "face10":grad,
                     "face11":grad,
                     "bubble1":bubblesColor,
                     "reflect1":"#ffffff",
                     "bubble2":bubblesColor,
                     "reflect2":"#ffffff",
                     "bubble3":bubblesColor,
                     "reflect3":"#ffffff",
                     "bubble4":bubblesColor,
                     "reflect4":"#ffffff",
                     "bubble5":bubblesColor,
                     "reflect5":"#ffffff",
                     "streak11":streaksGrad, 
                     "streak12":streaksGrad, 
                     "streak13":streaksGrad, 
                     "streak14":streaksGrad };
      Stimuli.drawPaths(paper, pieces, colors, getPathString);
      if (bubbles) {
        Stimuli.drawPaths(paper, bubblesPieces, colors, getPathString);
      }
      Stimuli.drawPaths(paper, pieces, colors, getPathString, "0.3-0.6-0.3");
      if (streaks) {
        Stimuli.drawPaths(paper, streaksPieces, colors, getPathString);
      }
      Stimuli.drawPaths(paper, pieces, colors, getPathString, "0.01-0.01-0.01");
      Stimuli.viewBox(label, scaleFactor);
      return {
        label: label,
        bubbles: bubbles,
        streaks: streaks
      };
    }
  },
  
  Island: function() {
    var data = $.csv.toObjects(Stimuli.images.crystal);
    //var endpoints = { };
    this.draw = function(label, river, beach, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      Stimuli.viewBox(label, scaleFactor);
      return {
        label: label,
        river: river,
        beach: beach
      };
    }
  },
  
  Planet: function() {
    var data = $.csv.toObjects(Stimuli.images.crystal);
    //var endpoints = { };
    this.draw = function(label, ring, moon, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      Stimuli.viewBox(label, scaleFactor);
      return {
        label: label,
        ring: ring,
        moon: moon
      };
    }
  },
  
  drawPaths: function(paper, pieces, colors, interpolationFunction, opacity) {
    var opacity = opacity || null;
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      var pathString = interpolationFunction(piece);
      var drawnPath = paper.path(pathString);
      Stimuli.stroke(drawnPath, colors[piece]);
      if (opacity != null) {
        drawnPath.attr({"opacityStops": opacity});
      }
    }
  },
  
  /* each element of images is copy-pasted from a csv file, with \n replacing
     new lines. Columns are body parts of the object (if the object is a
     creature, "left" means the creature's left, otherwise "left" means closest
     to the left side of the image) and the rows are the endpoints
     (combinations of short, tall, fat, and skinny). Each cell contains the
     path string for that part of the monster for that endpoint. */
  images: { monster: '"endpoint","left eye","left pupil","right eye","right pupil","mouth","body","left arm","right arm","left foot","right foot","left toe1","left toe2","left toe3","right toe1","right toe2","right toe3","left pad","right pad","left tooth","right tooth","left horn","right horn","left horn line1","left horn line2","right horn line1","right horn line2"\n"short skinny","m 159.5,175.625 c 0,6.69645 -6.10012,12.125 -13.625,12.125 -7.52488,0 -13.625,-5.42855 -13.625,-12.125 0,-6.69645 6.10012,-12.125 13.625,-12.125 7.52488,0 13.625,5.42855 13.625,12.125 z","m 139,181.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 111.5,175.25 c 0,6.62742 -5.87626,12 -13.125,12 -7.248737,0 -13.125,-5.37258 -13.125,-12 0,-6.62742 5.876263,-12 13.125,-12 7.24874,0 13.125,5.37258 13.125,12 z","m 105,181 c -1.07711,14.64565 -21.209492,-5.15625 -6.11054,-5.96632 3.14779,-0.0486 6.36979,2.64659 6.11054,5.96632 z","m 90,194 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 180.00001,199 c 10.73889,13.71279 6.15721,36.05831 -9.38601,44.15746 -24.85449,16.0425 -56.42647,13.06828 -84.073258,7.59996 -13.762129,-3.11226 -30.703856,-11.67588 -30.467578,-27.96589 0.679317,-16.32231 10.876946,-29.99246 16.028475,-45.03857 8.892153,-20.16777 23.632677,-42.19704 47.516051,-44.73994 19.89895,-1.97807 35.18157,14.67587 43.71234,30.77445 6.41914,11.31349 11.08625,23.48988 16.66998,35.21253 z",,,"m 205,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 185.20403,191.26498 206.30351,207.96876 205,227 z","m 102,230.5 c 1.79299,21.60726 -25.909148,39.22267 -44.114816,26.18477 C 37.293689,244.47978 40.550613,208.28271 64.035226,201.30135 82.204032,194.76498 103.30351,211.46876 102,230.5 z","m 156.0807,215.5 c 8.02518,17.85899 15.69247,-16.24875 0.61881,-2.50403 -0.5,0.75315 -0.47787,1.64814 -0.61881,2.50403 z","m 171,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 173.76305,203.31659 170.92094,205.77872 171,209 z","m 186,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 62,225 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 77.000002,214.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 91.919292,221 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 161,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 87.000002,242 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 131.75,200.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.45981,-5.42896 0.72451,-10.76122 0.81791,-13.27823 0.0862,-2.32247 -5.76196,1.98696 -13.06791,2.52823 z","m 99,197.25 c 1.5,5.25 3,10.5 4.5,15.75 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.83333,-2.33333 -13.25,-3.5 z","m 137,135 c 17.9114,1.52532 21.58458,-20.79896 26.04126,-30.95678 12.74526,6.71014 10.65238,27.15296 8.42397,39.37181 -5.66391,17.06286 -27.28644,12.40232 -32.39405,-2.2554 C 138.08665,139.22223 137.36515,137.14491 137,135 z","m 102.81449,137.6467 c -17.911388,1.52531 -21.584578,-20.79896 -26.041258,-30.95678 -12.746593,6.71152 -10.652609,27.1576 -8.422138,39.37761 5.656588,17.04009 27.313168,12.40822 32.384146,-2.26692 0.97923,-1.93868 1.70003,-4.01314 2.07925,-6.15391 z","m 150.89802,129.99287 c 3.47549,7.96431 13.48564,9.85183 21.2132,8.48528","m 157.26198,119.73981 c 3.89994,3.71966 10.3991,5.70549 15.20279,2.47487","m 88.142282,131.4552 c -3.47549,7.96431 -13.48563,9.85183 -21.213196,8.48528","m 81.778322,121.20214 c -3.89995,3.71965 -10.399094,5.70549 -15.202786,2.47487"\n"short fat","m 159.5,175.625 c 0,6.69645 -6.10012,12.125 -13.625,12.125 -7.52488,0 -13.625,-5.42855 -13.625,-12.125 0,-6.69645 6.10012,-12.125 13.625,-12.125 7.52488,0 13.625,5.42855 13.625,12.125 z","m 139,181.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 111.5,175.25 c 0,6.62742 -5.87626,12 -13.125,12 -7.248737,0 -13.125,-5.37258 -13.125,-12 0,-6.62742 5.876263,-12 13.125,-12 7.24874,0 13.125,5.37258 13.125,12 z","m 105,181 c -1.07711,14.64565 -21.209492,-5.15625 -6.11054,-5.96632 3.14779,-0.0486 6.36979,2.64659 6.11054,5.96632 z","m 90,194 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 231.99999,193.99999 c 36.08695,40.64524 -2.92904,60.87795 -41.31031,61.45662 -42.83938,4.1979 -85.7047,-4.573 -128.558913,-0.48455 -35.571432,3.93279 -64.1502383,1.27806 -56.3742294,-39.2093 6.1897904,-16.71923 14.9022284,-30.92929 25.5505904,-42.93419 25.531801,-28.72455 55.104868,-38.94434 90.114572,-41.14621 32.90303,-3.00756 54.98802,12.1456 75.75483,30.18991 12.10406,11.94465 24.97686,20.15634 34.82346,32.12772 z",,,"m 241,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 221.20403,191.26498 242.30351,207.96876 241,227 z","m 70.000002,228.5 c 1.79299,21.60726 -25.90915,39.22267 -44.114818,26.18477 C 5.293689,242.47978 8.550613,206.28271 32.035226,199.30135 50.204032,192.76498 71.303512,209.46876 70.000002,228.5 z","m 192.0807,215.5 c 8.02401,17.85879 15.69367,-16.2473 0.6192,-2.50489 -0.49989,0.75353 -0.47854,1.64857 -0.6192,2.50489 z","m 207,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 209.76305,203.31659 206.92094,205.77872 207,209 z","m 222,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 30,223 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 45.000002,212.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 59.919292,219 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 197,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 55.000002,240 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 131.75,200.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.45981,-5.42896 0.72451,-10.76122 0.81791,-13.27823 0.0862,-2.32247 -5.76196,1.98696 -13.06791,2.52823 z","m 99,197.25 c 1.5,5.25 3,10.5 4.5,15.75 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.83333,-2.33333 -13.25,-3.5 z","m 162.79675,137.65553 c 13.83057,-1.89087 17.29322,-17.77134 17.73267,-29.4664 -0.89317,-17.131773 15.4111,3.96795 14.85141,11.96622 6.31402,12.32285 2.78905,36.36691 -15.30985,32.75418 -7.02283,-3.20542 -14.47695,-7.57893 -17.27423,-15.254 z","M 72.54914,143.02767 C 58.814955,140.5313 56.052971,124.5141 56.127498,112.81102 c 1.644588,-17.076015 -15.570468,3.2874 -15.362529,11.30253 -6.849047,12.03371 -4.383306,36.20936 13.85678,33.39487 7.156815,-2.89394 14.795786,-6.93591 17.927391,-14.48075 z","m 175.32564,129.82908 c 5.11674,7.06002 15.22536,6.75857 22.52588,3.81904","m 179.38332,118.46421 c 4.59317,2.86539 11.38672,3.46119 15.38274,-0.78811","m 59.927607,133.31658 c -5.42182,6.82852 -15.507439,6.08349 -22.671835,2.82622","m 56.372888,121.78449 c -4.71456,2.66093 -11.527716,2.95785 -15.33329,-1.46282"\n"tall skinny","m 155,110.5 c 0,6.90356 -6.04416,12.5 -13.5,12.5 -7.45584,0 -13.5,-5.59644 -13.5,-12.5 0,-6.90356 6.04416,-12.5 13.5,-12.5 7.45584,0 13.5,5.59644 13.5,12.5 z","m 135,116.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 107,110.25 c 0,6.76549 -5.93223,12.25 -13.25,12.25 -7.317773,0 -13.25,-5.48451 -13.25,-12.25 0,-6.76549 5.932227,-12.25 13.25,-12.25 7.31777,0 13.25,5.48451 13.25,12.25 z","m 101,116 c -1.05428,15.09255 -21.092549,-4.94572 -6,-6 3.19473,-0.0963 6.09624,2.80529 6,6 z","m 86,129 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 183.12272,181.9729 c -1.27868,25.82012 -6.31535,53.2175 -28.30421,66.56187 -20.38503,9.76551 -43.34353,8.02907 -61.868155,-0.93401 C 66.242315,231.08411 54.546987,208.3034 57.621976,180.071 c 3.941758,-18.75168 7.879959,-34.16772 8.624605,-52.04041 -3.374387,-41.978572 -2.694876,-96.158604 52.241869,-95.329459 52.20398,-0.06014 53.45326,54.43981 54.76442,94.807689 -1.4255,18.93949 8.85818,37.98449 9.86985,54.46408 z",,,"m 205,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 185.20403,191.26498 206.30351,207.96876 205,227 z","m 102,230.5 c 1.79299,21.60726 -25.909148,39.22267 -44.114816,26.18477 C 37.293689,244.47978 40.550613,208.28271 64.035226,201.30135 82.204032,194.76498 103.30351,211.46876 102,230.5 z","m 156.0807,215.5 c 8.02518,17.85899 15.69247,-16.24875 0.61881,-2.50403 -0.5,0.75315 -0.47787,1.64814 -0.61881,2.50403 z","m 171,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 173.76305,203.31659 170.92094,205.77872 171,209 z","m 186,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 62,225 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 77.000002,214.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 91.919292,221 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 161,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 87.000002,242 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 127.75,135.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.13448,-4.764 1.0062,-16.31587 -0.0474,-13.4052 -0.30748,0.84944 -4.23792,1.90381 -12.20263,2.6552 z","m 95.25,132.75 c 1.5,5.25 2.75,10 4.25,15.25 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.58333,-1.83333 -13,-3 z","m 136.6114,37.41027 c 13.91819,1.069462 20.65316,-13.723082 23.54998,-25.062223 2.74115,-16.9346175 14.22712,7.129868 11.99266,14.830045 3.57222,13.377546 -4.94587,36.136809 -21.87527,28.787139 C 144.09017,51.350468 137.7266,45.502663 136.6114,37.41027 z","M 97.42589,38.05697 C 83.5077,39.126434 76.77273,24.333889 73.87591,12.994745 71.134762,-3.939873 59.648772,20.124609 61.883237,27.82479 58.311024,41.202339 66.829121,63.961601 83.75852,56.611931 89.94712,51.997168 96.31069,46.149363 97.42589,38.05697 z","m 150.50942,32.40314 c 3.51216,7.980573 13.45685,9.818493 21.2132,8.48528","m 156.87338,22.15008 c 3.88529,3.769897 10.40024,5.785508 15.20278,2.47487","m 82.75368,31.86547 c -3.51216,7.980571 -13.45685,9.818493 -21.2132,8.48528","m 76.38972,21.61241 c -3.88529,3.769905 -10.400247,5.785504 -15.20279,2.47487"\n"tall fat","m 155,110.5 c 0,6.90356 -6.04416,12.5 -13.5,12.5 -7.45584,0 -13.5,-5.59644 -13.5,-12.5 0,-6.90356 6.04416,-12.5 13.5,-12.5 7.45584,0 13.5,5.59644 13.5,12.5 z","m 135,116.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 107,110.25 c 0,6.76549 -5.93223,12.25 -13.25,12.25 -7.317773,0 -13.25,-5.48451 -13.25,-12.25 0,-6.76549 5.932227,-12.25 13.25,-12.25 7.31777,0 13.25,5.48451 13.25,12.25 z","m 101,116 c -1.05428,15.09255 -21.092549,-4.94572 -6,-6 3.19473,-0.0963 6.09624,2.80529 6,6 z","m 86,129 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 246.84146,191.02436 c -0.46247,22.7555 -44.40535,48.58471 -62.33816,54.48631 -37.89852,12.69594 -75.98258,9.52536 -111.081256,0.49967 C 34.838557,237.26932 -1.3059135,224.51467 6.1315782,180.89726 9.9943253,159.74281 35.540356,142.83147 41.528696,124.84004 49.966904,47.770077 79.053663,29.108667 117.65013,27.392656 c 69.00411,4.108983 72.46419,44.828137 83.19432,103.257604 6.32161,24.06101 46.03125,36.87428 45.99701,60.3741 z",,,"m 241,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 221.20403,191.26498 242.30351,207.96876 241,227 z","m 70.000002,228.5 c 1.79299,21.60726 -25.90915,39.22267 -44.114818,26.18477 C 5.293689,242.47978 8.550613,206.28271 32.035226,199.30135 50.204032,192.76498 71.303512,209.46876 70.000002,228.5 z","m 192.0807,215.5 c 8.02401,17.85879 15.69367,-16.2473 0.6192,-2.50489 -0.49989,0.75353 -0.47854,1.64857 -0.6192,2.50489 z","m 207,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 209.76305,203.31659 206.92094,205.77872 207,209 z","m 222,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 30,223 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 45.000002,212.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 59.919292,219 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 197,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 55.000002,240 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 127.75,135.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.13448,-4.764 1.0062,-16.31587 -0.0474,-13.4052 -0.30748,0.84944 -4.23792,1.90381 -12.20263,2.6552 z","m 95.25,132.75 c 1.5,5.25 2.75,10 4.25,15.25 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.58333,-1.83333 -13,-3 z","m 156.6114,39.410268 c 13.91819,1.069459 20.65316,-13.723082 23.54998,-25.062224 2.74115,-16.934616 14.22712,7.12987 11.99266,14.830046 3.57222,13.377546 -4.94587,36.136809 -21.87527,28.787139 -6.19122,-4.618542 -12.54973,-10.457947 -13.66737,-18.554961 z","M 85.895071,36.156536 C 72.160973,38.653413 63.938678,24.632964 59.889712,13.652366 55.419438,-2.909998 46.47232,22.209244 49.487765,29.638423 47.311971,43.312684 58.12822,65.073906 74.210872,56.020149 79.891408,50.792698 85.619042,44.320748 85.895071,36.156536 z","m 170.50942,34.403138 c 3.51216,7.980573 13.45685,9.818493 21.2132,8.48528","m 176.87338,24.150078 c 3.88529,3.769897 10.40024,5.785508 15.20278,2.47487","M 70.663332,31.508682 C 67.991568,39.808471 58.288975,42.660585 50.436577,42.133099","m 63.277481,21.96539 c -3.47647,4.149917 -9.749259,6.825626 -14.867158,4.027085"',
    fish: 'endpoint,body,eye,pupil,lower fin,upper fin,fang,whisker1,whisker2,whisker3\nsmall short,"m 63.355339,104.92888 c -0.989185,7.61102 -3.667437,11.00209 -16.855111,13.28865 3.901225,5.82478 8.736726,9.39811 -10.718259,20.32403 8.955617,8.21885 15.267681,12.13519 10.455639,19.36767 13.833267,1.61989 11.6186,6.30509 14.556816,18.94101 3.168347,-28.29445 19.324665,-29.55311 23.553314,-30.69545 3.623491,7.61778 112.976472,35.99238 150.007652,-8.08122 -0.82904,-1.09604 -18.2764,1.71626 -19.10794,0.6586 -0.64125,-0.81563 18.2938,-6.34392 17.51961,-7.00904 -70.43162,-60.508932 -125.29509,-26.56039 -148.419323,1.80475 -20.485249,-3.44915 -17.156631,-11.11205 -20.992398,-28.599 z","m 199.50513,114.94158 a 13.384521,13.637059 0 1 1 -26.76905,0 13.384521,13.637059 0 1 1 26.76905,0 z","m 197.9899,117.21442 a 9.5964489,8.8388348 0 1 1 -19.1929,0 9.5964489,8.8388348 0 1 1 19.1929,0 z","m 147,142.5 c -2.37009,5.27411 -3.18117,9.40731 -4.5,14 -3.3982,-9.56182 -5.067,-9.12288 -10.77208,-11.22703 C 137.41341,143.36346 138.35161,143.22284 140,141 z","m 189.25,104.5 c -6.7477,-5.069429 -11.85116,-9.01194 -12,-22 -31.21541,24.25694 -52.15291,-1.836192 -91,49.5 25.30878,-26.68424 61.78582,-42.225361 103,-27.5 z","m 220.22087,136.45491 6.81853,-2.25254 c 0.57697,22.03278 -2.82062,45.16585 -7.8363,63.4702 3.19194,-21.68019 6.0638,-45.94478 1.01777,-61.21766 z","m 206.07111,135.54818 c -32.28674,23.34556 -51.60559,60.7522 -38.89087,107.07617","m 208.09142,138.57864 c -30.52433,36.14586 -40.99373,68.74778 -24.74873,111.11677","m 211.62695,139.58879 c -14.29361,23.85879 -34.75106,44.10429 -11.61675,89.90358"\nsmall tall,"m 63.355339,104.92888 c -0.489185,9.61102 -8.667437,12.50209 -15.855111,13.28865 3.901225,5.82478 9.736726,9.89811 -10.718259,20.32403 8.955617,8.21885 14.267681,13.63519 9.955639,18.86767 15.833267,2.61989 12.1186,17.30509 14.556816,20.44101 0.168347,-13.29445 1.824665,-26.05311 23.053314,-31.69545 33.166032,48.78218 78.063582,196.58518 150.007652,-8.08122 -0.82904,-1.09604 -18.2764,1.71626 -19.10794,0.6586 -0.64125,-0.81563 18.00415,-6.11073 17.51961,-7.00904 C 151.39883,-19.129659 118.63641,78.708188 84.347737,133.52788 60.362488,126.57873 67.691106,118.41583 63.355339,104.92888 z","m 199.50513,114.94158 a 13.384521,13.637059 0 1 1 -26.76905,0 13.384521,13.637059 0 1 1 26.76905,0 z","m 197.9899,117.21442 a 9.5964489,8.8388348 0 1 1 -19.1929,0 9.5964489,8.8388348 0 1 1 19.1929,0 z","m 147,142.5 c -2.37009,5.27411 -3.18117,9.40731 -4.5,14 -3.3982,-9.56182 -5.067,-9.12288 -10.77208,-11.22703 C 137.41341,143.36346 138.35161,143.22284 140,141 z","M 176.5,58 C 168.2523,49.930571 159.64884,53.988058 155,32.5 139.28459,64.256942 97.847091,71.163808 91,122 109.80878,87.81576 133.78582,40.274639 176.5,58 z","m 220.22087,136.45491 6.81853,-2.25254 c 0.57697,22.03278 -2.82062,45.16585 -7.8363,63.4702 3.19194,-21.68019 6.0638,-45.94478 1.01777,-61.21766 z","m 206.07111,135.54818 c -32.28674,23.34556 -51.60559,60.7522 -38.89087,107.07617","m 208.09142,138.57864 c -30.52433,36.14586 -40.99373,68.74778 -24.74873,111.11677","m 211.62695,139.58879 c -14.29361,23.85879 -34.75106,44.10429 -11.61675,89.90358"\nbig short,"m 53.855339,48.92888 c -0.489185,9.611017 -24.667437,49.502087 -38.855111,53.28865 3.901225,5.82478 15.236726,21.89811 -5.2182588,32.32403 8.9556168,8.21885 7.7676808,31.13519 3.4556388,36.36767 15.833267,2.61989 47.1186,42.30509 48.556816,63.94101 0.168347,-29.29445 1.324665,-83.05311 22.553314,-88.69545 3.623491,7.61778 112.976472,35.99238 150.007652,-8.08122 -0.82904,-1.09604 -18.2764,1.71626 -19.10794,0.6586 -0.64125,-0.81563 18.2938,-6.34392 17.51961,-7.00904 C 162.33544,71.214198 107.47197,105.16274 84.347737,133.52788 60.362488,126.57873 61.191106,83.41583 53.855339,48.92888 z","m 199.50513,114.94158 a 13.384521,13.637059 0 1 1 -26.76905,0 13.384521,13.637059 0 1 1 26.76905,0 z","m 197.9899,117.21442 a 9.5964489,8.8388348 0 1 1 -19.1929,0 9.5964489,8.8388348 0 1 1 19.1929,0 z","m 147,142.5 c -35.90562,27.60514 -41.03212,66.20281 -40,107 -9.398199,-23.29162 -29.918841,-36.57304 -52.5,-48 33.831931,-1.16947 64.55091,-33.56485 85.5,-60.5 z","m 189.25,104.5 c -1.2477,-10.569429 -18.85116,-28.511942 -18,-47.5 -36.21541,44.75694 -45.15291,13.663808 -85,75 25.30878,-26.68424 61.78582,-42.225361 103,-27.5 z","m 220.22087,136.45491 6.81853,-2.25254 c 0.57697,22.03278 -2.82062,45.16585 -7.8363,63.4702 3.19194,-21.68019 6.0638,-45.94478 1.01777,-61.21766 z","m 206.07111,135.54818 c -32.28674,23.34556 -51.60559,60.7522 -38.89087,107.07617","m 208.09142,138.57864 c -30.52433,36.14586 -40.99373,68.74778 -24.74873,111.11677","m 211.62695,139.58879 c -14.29361,23.85879 -34.75106,44.10429 -11.61675,89.90358"\nbig tall,"m 53.355339,46.92888 c -0.489185,9.611017 -24.167437,51.502087 -38.355111,55.28865 3.901225,5.82478 15.236726,21.89811 -5.2182588,32.32403 8.9556168,8.21885 7.7676808,31.13519 3.4556388,36.36767 15.833267,2.61989 48.1186,42.30509 49.556816,63.94101 0.168347,-29.29445 0.324665,-83.05311 21.553314,-88.69545 33.166032,48.78218 78.063582,196.58518 150.007652,-8.08122 -0.82904,-1.09604 -18.2764,1.71626 -19.10794,0.6586 -0.64125,-0.81563 18.00415,-6.11073 17.51961,-7.00904 C 151.39883,-19.129659 118.63641,78.708188 84.347737,133.52788 60.362488,126.57873 60.691106,81.415828 53.355339,46.92888 z","m 199.50513,114.94158 a 13.384521,13.637059 0 1 1 -26.76905,0 13.384521,13.637059 0 1 1 26.76905,0 z","m 197.9899,117.21442 a 9.5964489,8.8388348 0 1 1 -19.1929,0 9.5964489,8.8388348 0 1 1 19.1929,0 z","m 147,142.5 c -35.90562,27.60514 -41.03212,66.20281 -40,107 -9.398199,-23.29162 -29.918841,-36.57304 -52.5,-48 33.831931,-1.16947 64.55091,-33.56485 85.5,-60.5 z","M 176.5,58 C 175.2523,47.430571 158.14884,32.988058 153.5,11.5 129.78459,66.756942 94.347091,84.663808 91,122 109.80878,87.81576 133.78582,40.274639 176.5,58 z","m 220.22087,136.45491 6.81853,-2.25254 c 0.57697,22.03278 -2.82062,45.16585 -7.8363,63.4702 3.19194,-21.68019 6.0638,-45.94478 1.01777,-61.21766 z","m 206.07111,135.54818 c -32.28674,23.34556 -51.60559,60.7522 -38.89087,107.07617","m 208.09142,138.57864 c -30.52433,36.14586 -40.99373,68.74778 -24.74873,111.11677","m 211.62695,139.58879 c -14.29361,23.85879 -34.75106,44.10429 -11.61675,89.90358"',
    flower: 'endpoint,stem,thorny stem,light petals,dark petals,center,spot11,spot12,spot13,spot21,spot22,spot23,spot31,spot32,spot33,spot41,spot42,spot43,spot51,spot52,spot53,spot61,spot62,spot63\nsmall short,"m 117.10683,111.77192 c -22.640084,26.82137 -35.523684,62.95613 -15.35954,113.20287 l 11.00001,0 c -21.786149,-37.46083 -11.86365,-87.81551 12.69291,-107.24364 -0.53083,0.0169 -7.46071,-5.48137 -8.33338,-5.95923 z","m 116.49251,112.39856 c -7.93531,9.67384 -14.73211,20.08698 -19.36667,31.675 -0.238071,0.59526 -27.84544,-13.68137 -28.071963,-13.07985 -0.171601,0.45568 27.035152,15.78818 26.87032,16.24751 -1.173093,3.26901 -3.298254,12.00615 -4.103738,15.47067 -0.204563,0.87986 -30.64688,-8.35793 -30.826609,-7.46319 -0.207524,1.03311 30.351734,10.20127 30.178301,11.25476 -0.885192,5.37694 -0.06947,6.14793 0.01725,12.10079 0.01564,1.07379 -33.70176,1.40757 -33.65181,2.50154 0.05595,1.22528 33.633687,0.71337 33.73378,1.96457 0.456869,5.71104 2.004567,16.94532 3.448042,23.23253 0.285417,1.24316 -29.283805,9.24816 -28.957242,10.51524 0.299005,1.16015 30.115436,-7.16958 30.449618,-5.98901 1.345531,4.75335 2.978832,9.67363 4.921191,14.77231 l 11,0 c -6.36047,-10.79671 -10.24585,-20.97466 -12.12091,-30.65002 -0.1217,-0.62797 34.26507,-8.75383 34.16018,-9.3776 -0.13256,-0.78832 -34.751795,5.92669 -34.857965,5.14497 -0.931753,-6.86045 -0.85713,-13.46932 0.05049,-19.86992 0.07221,-0.50921 30.774685,3.23291 30.857345,2.72632 0.0885,-0.5423 -30.442075,-5.33312 -30.341808,-5.87248 1.252888,-6.73957 3.416768,-13.25138 6.282698,-19.58769 0.26004,-0.57493 28.02587,10.85158 28.29731,10.2795 0.27957,-0.58918 -26.93491,-13.17687 -26.64359,-13.76312 4.49767,-9.05088 10.37653,-17.75646 17.00916,-26.2736 -0.53082,0.0169 -7.46071,-5.48137 -8.33338,-5.95923 z","m 119.50105,107.54221 c -12.16137,-9.899496 -3.49776,-22.097086 -4.5962,-31.99658 5.00504,8.371804 19.27627,11.965432 14.84925,29.34493 4.87259,-18.293957 18.26786,-13.048756 27.75393,-18.738329 -6.37693,9.07046 -2.09812,25.890549 -22.27386,24.925509 17.54732,-0.71603 19.00155,9.83311 28.1075,15.02603 -10.38551,-1.68582 -18.99496,8.2561 -31.46626,-5.83364 12.47063,13.49214 1.51845,22.64673 2.12132,33.94114 -4.40272,-10.19683 -19.81591,-12.71969 -10.42981,-32.52691 -4.47604,17.15195 -19.95525,12.29756 -30.052038,18.208 7.400338,-8.43318 2.800372,-20.50281 24.030808,-24.74504 -19.204388,6.95571 -22.256279,-9.04212 -33.223206,-13.79227 11.740705,1.65594 23.858926,-7.258727 35.178566,6.18716 z","m 123.58303,106.36281 c -5.86747,-14.542069 7.60991,-21.03818 11.42943,-30.236975 0.33906,9.747952 11.09965,19.787468 -1.17087,32.867225 13.10235,-13.665276 22.29823,-2.60268 33.35248,-3.00296 -9.96473,4.86236 -14.342,21.65709 -31.54232,11.06743 15.71074,7.84818 11.88899,17.78766 17.35428,26.73279 -8.2796,-6.49223 -20.62009,-1.94509 -24.73512,-20.30593 4.40307,17.83725 -9.60851,20.56347 -14.53569,30.74434 1.06981,-11.05508 -11.20788,-20.70856 6.5775,-33.51891 -12.20353,12.85683 -23.412928,1.12991 -35.108619,1.42862 10.553062,-3.81004 12.354702,-16.60026 32.993589,-10.06081 -20.175405,-3.1849 -15.12095,-18.667051 -22.42962,-28.123309 9.48067,7.120611 24.39739,5.167652 27.81496,22.408489 z","m 136.70807,114.52993 c -0.61786,3.74351 -3.88406,6.83586 -7.65838,7.24572 -3.64335,0.49454 -7.45631,-1.53657 -9.04978,-4.85882 -1.77085,-3.40652 -0.95888,-7.89952 1.89226,-10.47076 2.65549,-2.55439 6.93816,-3.12247 10.17798,-1.38402 3.40439,1.72717 5.36174,5.72022 4.63792,9.46788 z","m 99.348502,108.95643 c -0.256698,3.10349 -4.726701,0.14594 -1.96469,-1.30308 0.88883,-0.41239 1.999826,0.32372 1.96469,1.30308 z","m 107.48023,104.36024 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 113.84419,110.81258 c 0.006,3.78454 -6.16778,1.91357 -4.04204,-1.23547 1.11707,-1.80477 4.12469,-0.887 4.04204,1.23547 z","m 122.50626,89.776161 c 0.007,4.390077 -7.15464,2.219752 -4.68877,-1.433144 1.2958,-2.093536 4.78463,-1.028917 4.68877,1.433144 z","m 120.20814,98.349831 c 0.005,3.027649 -4.93422,1.530858 -3.23362,-0.988375 0.89365,-1.443816 3.29974,-0.709602 3.23362,0.988375 z","m 128.33988,97.996277 c 0.006,3.633173 -5.92107,1.837033 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.851518 3.88035,1.18605 z","m 147.78532,94.372353 c 0.005,3.179023 -5.18094,1.607402 -3.39531,-1.037795 0.93834,-1.516007 3.46473,-0.74508 3.39531,1.037795 z","m 148.84598,102.68085 c 0.008,4.69284 -7.64806,2.37283 -5.01212,-1.53198 1.38516,-2.237924 5.1146,-1.09988 5.01212,1.53198 z","m 138.41616,102.85764 c 0.006,3.78455 -6.16779,1.91358 -4.04204,-1.23547 1.11707,-1.804772 4.12469,-0.887 4.04204,1.23547 z","m 152.02795,120.71208 c 0.005,3.17903 -5.18094,1.60741 -3.39531,-1.03779 0.93834,-1.516 3.46473,-0.74508 3.39531,1.03779 z","m 145.84077,122.92179 c 0.005,3.3304 -5.42765,1.68395 -3.55699,-1.08721 0.98301,-1.5882 3.62972,-0.78056 3.55699,1.08721 z","m 141.95169,115.40878 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93895 0.84897,-1.37164 3.13475,-0.67412 3.07195,0.93895 z","m 134.52706,139.80397 c -0.27274,3.29745 -5.02211,0.15506 -2.08748,-1.38452 0.94438,-0.43815 2.12481,0.34395 2.08748,1.38452 z","m 128.87021,134.94261 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 133.64318,127.25282 c 0.007,4.08732 -6.66121,2.06666 -4.36539,-1.33431 1.20643,-1.94914 4.45465,-0.95796 4.36539,1.33431 z","m 105.18213,128.49025 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93896 0.84897,-1.37162 3.13476,-0.67412 3.07195,0.93896 z","m 115.25841,128.31348 c 0.005,3.17902 -5.18094,1.6074 -3.39531,-1.0378 0.93834,-1.51601 3.46473,-0.74507 3.39531,1.0378 z","m 117.37973,120.88885 c 0.007,4.08731 -6.66121,2.06666 -4.3654,-1.33431 1.20643,-1.94916 4.45466,-0.95795 4.3654,1.33431 z"\nsmall long,"M 84.579916,141.82395 C 61.939835,168.64532 49.056235,204.78008 69.220381,255.02682 l 11.000005,0 C 58.43424,217.56599 68.356742,167.21131 92.913296,147.78318 c -0.53083,0.0169 -7.46071,-5.48137 -8.33338,-5.95923 z","m 84.359535,141.29713 c -7.935319,9.67384 -14.732112,20.08698 -19.366675,31.675 -0.238071,0.59526 -27.84544,-13.68137 -28.071963,-13.07985 -0.171601,0.45568 27.035152,15.78818 26.87032,16.24751 -1.173093,3.26901 -3.298254,12.00615 -4.103738,15.47067 -0.204563,0.87986 -30.64688,-8.35793 -30.826609,-7.46319 -0.207524,1.03311 30.351734,10.20127 30.178301,11.25476 -0.885192,5.37694 -0.06947,6.14793 0.01725,12.10079 0.01564,1.07379 -33.70176,1.40756 -33.65181,2.50154 0.05595,1.22528 33.633687,0.71337 33.73378,1.96457 0.456869,5.71104 2.004567,16.94532 3.448042,23.23253 0.285417,1.24316 -29.283805,9.24816 -28.957242,10.51524 0.299005,1.16015 30.115436,-7.16958 30.449618,-5.98901 C 65.42434,244.48104 67.057641,249.40132 69,254.5 l 11,0 c -6.360467,-10.79671 -10.245848,-20.97466 -12.12091,-30.65002 -0.1217,-0.62797 34.26507,-8.75383 34.16018,-9.3776 -0.13256,-0.78832 -34.751795,5.92669 -34.857965,5.14497 -0.931753,-6.86045 -0.85713,-13.46932 0.05049,-19.86993 0.07221,-0.5092 30.774683,3.23292 30.857346,2.72633 0.08849,-0.5423 -30.442076,-5.33312 -30.341809,-5.87248 1.252887,-6.73957 3.416765,-13.25138 6.282696,-19.58769 0.260044,-0.57493 28.025872,10.85158 28.297312,10.2795 0.27957,-0.58918 -26.934911,-13.17687 -26.643586,-13.76312 4.497662,-9.05088 10.376531,-17.75646 17.009159,-26.2736 -0.530825,0.0169 -7.460709,-5.48137 -8.333378,-5.95923 z","m 119.50105,107.54221 c -26.469456,-22.6532 -10.4698,-38.677539 -17.15166,-63.804189 10.46954,24.161584 38.12333,26.171744 27.40471,61.152539 4.57303,-32.218143 30.35096,-26.339321 49.59187,-42.667258 -17.02952,18.71832 -5.79685,46.500688 -44.1118,48.854438 38.53372,-4.63641 36.28749,16.23804 59.59189,27.84405 -24.58754,-8.00952 -44.43858,11.22955 -62.95065,-18.65166 22.57365,22.63362 4.90772,31.11505 6.20711,52.56677 -7.12792,-19.6449 -24.06505,-18.40399 -14.5156,-51.15254 -5.4504,34.34276 -26.166665,19.53673 -45.79899,32.6066 15.933771,-17.0982 2.457429,-36.30315 39.77776,-39.14364 -34.732247,6.86701 -33.828524,-12.36638 -57.788177,-22.25674 24.914512,6.239748 34.829025,-15.557016 59.743537,14.65163 z","m 121.15255,103.43352 c -9.93879,-33.391914 12.19612,-38.168354 20.21987,-62.899208 -4.31863,25.975812 17.81775,42.671727 -10.16899,66.236268 21.3256,-24.579273 39.78689,-5.65196 64.80898,-8.9244 -24.46192,6.4803 -30.10455,35.91147 -63.56383,17.0952 34.88181,17.01771 21.66672,33.3318 34.94231,55.72719 -16.30513,-20.07094 -43.41955,-14.68446 -42.75209,-49.82899 6.67721,31.26124 -12.76377,28.79788 -23.31407,47.52102 4.67419,-20.36864 -10.225268,-28.51802 15.56802,-50.84213 -23.215535,25.88766 -32.580642,2.20905 -56.16337,2.53251 22.662344,-5.71416 21.765537,-29.158515 54.65356,-11.29085 C 82.483565,95.679 93.680456,80.014721 78.923427,58.704763 c 17.540207,18.76189 37.696663,5.834646 42.229123,44.728757 z","m 136.70807,114.52993 c -0.61786,3.74351 -3.88406,6.83586 -7.65838,7.24572 -3.64335,0.49454 -7.45631,-1.53657 -9.04978,-4.85882 -1.77085,-3.40652 -0.95888,-7.89952 1.89226,-10.47076 2.65549,-2.55439 6.93816,-3.12247 10.17798,-1.38402 3.40439,1.72717 5.36174,5.72022 4.63792,9.46788 z","m 99.348502,108.95643 c -0.256698,3.10349 -4.726701,0.14594 -1.96469,-1.30308 0.88883,-0.41239 1.999826,0.32372 1.96469,1.30308 z","m 107.48023,104.36024 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 113.84419,110.81258 c 0.006,3.78454 -6.16778,1.91357 -4.04204,-1.23547 1.11707,-1.80477 4.12469,-0.887 4.04204,1.23547 z","m 122.50626,89.776161 c 0.007,4.390077 -7.15464,2.219752 -4.68877,-1.433144 1.2958,-2.093536 4.78463,-1.028917 4.68877,1.433144 z","m 120.20814,98.349831 c 0.005,3.027649 -4.93422,1.530858 -3.23362,-0.988375 0.89365,-1.443816 3.29974,-0.709602 3.23362,0.988375 z","m 128.33988,97.996277 c 0.006,3.633173 -5.92107,1.837033 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.851518 3.88035,1.18605 z","m 147.78532,94.372353 c 0.005,3.179023 -5.18094,1.607402 -3.39531,-1.037795 0.93834,-1.516007 3.46473,-0.74508 3.39531,1.037795 z","m 148.84598,102.68085 c 0.008,4.69284 -7.64806,2.37283 -5.01212,-1.53198 1.38516,-2.237924 5.1146,-1.09988 5.01212,1.53198 z","m 138.41616,102.85764 c 0.006,3.78455 -6.16779,1.91358 -4.04204,-1.23547 1.11707,-1.804772 4.12469,-0.887 4.04204,1.23547 z","m 152.02795,120.71208 c 0.005,3.17903 -5.18094,1.60741 -3.39531,-1.03779 0.93834,-1.516 3.46473,-0.74508 3.39531,1.03779 z","m 145.84077,122.92179 c 0.005,3.3304 -5.42765,1.68395 -3.55699,-1.08721 0.98301,-1.5882 3.62972,-0.78056 3.55699,1.08721 z","m 141.95169,115.40878 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93895 0.84897,-1.37164 3.13475,-0.67412 3.07195,0.93895 z","m 134.52706,139.80397 c -0.27274,3.29745 -5.02211,0.15506 -2.08748,-1.38452 0.94438,-0.43815 2.12481,0.34395 2.08748,1.38452 z","m 128.87021,134.94261 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 133.64318,127.25282 c 0.007,4.08732 -6.66121,2.06666 -4.36539,-1.33431 1.20643,-1.94914 4.45465,-0.95796 4.36539,1.33431 z","m 105.18213,128.49025 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93896 0.84897,-1.37162 3.13476,-0.67412 3.07195,0.93896 z","m 115.25841,128.31348 c 0.005,3.17902 -5.18094,1.6074 -3.39531,-1.0378 0.93834,-1.51601 3.46473,-0.74507 3.39531,1.0378 z","m 117.37973,120.88885 c 0.007,4.08731 -6.66121,2.06666 -4.3654,-1.33431 1.20643,-1.94916 4.45466,-0.95795 4.3654,1.33431 z"\nbig short,"M 94.501671,129.8517 C 71.86159,156.67307 58.97799,192.80783 79.142135,243.05457 l 11,0 C 68.355994,205.59374 78.278497,155.23906 102.83506,135.81093 c -0.53083,0.0169 -7.460719,-5.48137 -8.333389,-5.95923 z","m 94.056238,129.36821 c -7.935323,9.67384 -14.732116,20.08698 -19.366679,31.675 -0.238071,0.59526 -27.84544,-13.68137 -28.071963,-13.07985 -0.171601,0.45568 27.035152,15.78818 26.87032,16.24751 -1.173093,3.26901 -3.298254,12.00615 -4.103738,15.47067 -0.204563,0.87986 -30.64688,-8.35793 -30.826609,-7.46319 -0.207524,1.03311 30.351734,10.20127 30.178301,11.25476 -0.885192,5.37694 -0.06947,6.14793 0.01725,12.10079 0.01564,1.07379 -33.70176,1.40756 -33.65181,2.50154 0.05595,1.22528 33.633687,0.71337 33.73378,1.96457 0.456869,5.71104 2.004567,16.94532 3.448042,23.23253 0.285417,1.24316 -29.283805,9.24816 -28.957242,10.51524 0.299005,1.16015 30.115436,-7.16958 30.449618,-5.98901 1.345531,4.75335 2.978832,9.67363 4.921191,14.77231 l 11,0 c -6.360467,-10.79671 -10.245848,-20.97466 -12.12091,-30.65002 -0.1217,-0.62797 34.265071,-8.75383 34.160181,-9.3776 -0.13256,-0.78832 -34.751796,5.92669 -34.857966,5.14497 -0.931753,-6.86045 -0.85713,-13.46932 0.05049,-19.86993 0.07221,-0.5092 30.774686,3.23292 30.857346,2.72633 0.0885,-0.5423 -30.442076,-5.33312 -30.341809,-5.87248 1.252887,-6.73957 3.416765,-13.25138 6.282696,-19.58769 0.260044,-0.57493 28.025873,10.85158 28.297313,10.2795 0.27957,-0.58918 -26.934912,-13.17687 -26.643587,-13.76312 4.497662,-9.05088 10.376535,-17.75646 17.009157,-26.2736 -0.53082,0.0169 -7.460712,-5.48137 -8.333372,-5.95923 z","M 103.9447,92.516192 C 74.170841,74.171585 96.714678,43.370383 93.34939,18.738021 c 15.13204,21.117534 51.0554,31.34438 41.35446,65.469669 4.51737,-35.043138 43.26399,-28.522174 65.14212,-42.484388 -14.09755,22.296105 -9.68958,60.920618 -44.1057,65.288578 36.40075,-9.805682 42.72735,29.60089 64.08579,44.40991 -24.60389,-5.43123 -57.18926,11.25987 -73.80851,-16.30242 23.79501,27.48516 1.56516,43.44384 -3.43503,63.71753 -10.94576,-18.25997 -35.89334,-29.93085 -26.617,-57.7071 -6.83389,34.66801 -39.675919,23.82177 -60.69759,33.66116 12.163843,-19.57403 8.628671,-51.35841 42.125213,-54.34034 C 47.550978,127.12219 49.461335,93.803181 26.257513,79.89058 52.107399,83.640685 75.672548,64.543428 103.9447,92.516192 z","m 114.51561,85.191757 c -16.772985,-30.686712 18.0703,-46.27146 27.35182,-69.335106 2.68085,25.840703 28.81757,52.523059 3.48292,77.358504 21.28685,-28.201033 51.71209,-3.338839 77.63384,-4.626697 -23.29259,12.381942 -38.60116,48.116112 -70.66,34.857932 36.47698,9.51818 22.44749,46.8823 33.66244,70.3283 -18.68047,-16.90828 -55.25487,-18.5552 -56.03434,-50.73084 7.05071,35.66404 -20.16575,38.51181 -34.554113,53.64454 C 94.937776,175.40402 79.050352,152.90555 100.8704,133.37465 77.757233,160.10207 54.603923,134.40841 31.468859,132.53944 51.73307,121.56386 64.410667,92.20363 94.983998,106.21012 48.384364,87.309708 66.552441,59.314586 53.290399,35.732896 73.886123,51.798264 103.81754,46.885864 114.51561,85.191757 z","m 157.10075,113.2093 c 0.16024,11.53862 -7.25616,22.66661 -17.9216,27.03742 -10.58728,4.61562 -23.75978,2.14347 -31.92028,-6.0411 -8.283468,-7.87813 -11.112982,-20.78802 -6.9389,-31.42166 4.01115,-10.921128 15.03336,-18.772517 26.68004,-18.90845 11.54644,-0.458129 22.87406,6.686945 27.50864,17.25792 1.7134,3.77942 2.59683,7.92711 2.5921,12.07587 z","m 77.848502,100.95643 c -0.256698,3.10349 -4.726701,0.14594 -1.96469,-1.30308 0.88883,-0.41239 1.999826,0.32372 1.96469,1.30308 z","m 85.98023,96.36024 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 92.34419,102.81258 c 0.006,3.78454 -6.16778,1.91357 -4.04204,-1.23547 1.11707,-1.80477 4.12469,-0.887 4.04204,1.23547 z","m 114.50626,67.276162 c 0.007,4.390077 -7.15464,2.219752 -4.68877,-1.433144 1.2958,-2.093536 4.78463,-1.028917 4.68877,1.433144 z","m 112.20814,75.849832 c 0.005,3.027648 -4.93422,1.530858 -3.23362,-0.988375 0.89365,-1.443816 3.29974,-0.709602 3.23362,0.988375 z","m 120.33988,75.496278 c 0.006,3.633172 -5.92107,1.837033 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.851518 3.88035,1.18605 z","m 164.78532,76.372354 c 0.005,3.179023 -5.18094,1.607402 -3.39531,-1.037795 0.93834,-1.516007 3.46473,-0.74508 3.39531,1.037795 z","m 165.84598,84.68085 c 0.008,4.69284 -7.64806,2.37283 -5.01212,-1.53198 1.38516,-2.237923 5.1146,-1.09988 5.01212,1.53198 z","m 155.41616,84.85764 c 0.006,3.78455 -6.16779,1.91358 -4.04204,-1.23547 1.11707,-1.804771 4.12469,-0.887 4.04204,1.23547 z","m 172.52795,127.71208 c 0.005,3.17903 -5.18094,1.60741 -3.39531,-1.03779 0.93834,-1.516 3.46473,-0.74508 3.39531,1.03779 z","m 166.34077,129.92179 c 0.005,3.3304 -5.42765,1.68395 -3.55699,-1.08721 0.98301,-1.5882 3.62972,-0.78056 3.55699,1.08721 z","m 162.45169,122.40878 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93895 0.84897,-1.37164 3.13475,-0.67412 3.07195,0.93895 z","m 139.52706,163.30397 c -0.27274,3.29745 -5.02211,0.15506 -2.08748,-1.38452 0.94438,-0.43815 2.12481,0.34395 2.08748,1.38452 z","m 133.87021,158.44261 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 138.64318,150.75282 c 0.007,4.08732 -6.66121,2.06666 -4.36539,-1.33431 1.20643,-1.94914 4.45465,-0.95796 4.36539,1.33431 z","m 89.68213,145.99025 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93896 0.84897,-1.37162 3.13476,-0.67412 3.07195,0.93896 z","m 99.75841,145.81348 c 0.005,3.17902 -5.18094,1.6074 -3.39531,-1.0378 0.93834,-1.51601 3.46473,-0.74507 3.39531,1.0378 z","m 101.87973,138.38885 c 0.007,4.08731 -6.66121,2.06666 -4.3654,-1.33431 1.20643,-1.94916 4.45466,-0.95795 4.3654,1.33431 z"\nbig long,"M 76.359535,155.29713 C 53.719454,182.1185 40.835854,218.25326 61,268.5 l 11,0 C 50.213859,231.03917 60.136361,180.68449 84.692913,161.25636 c -0.530825,0.0169 -7.460709,-5.48137 -8.333378,-5.95923 z","m 76.359535,155.29713 c -7.935319,9.67384 -14.732112,20.08698 -19.366675,31.675 -0.238071,0.59526 -27.84544,-13.68137 -28.071963,-13.07985 -0.171601,0.45568 27.035152,15.78818 26.87032,16.24751 -1.173093,3.26901 -3.298254,12.00615 -4.103738,15.47067 -0.204563,0.87986 -30.64688,-8.35793 -30.826609,-7.46319 -0.207524,1.03311 30.351734,10.20127 30.178301,11.25476 -0.885192,5.37694 -0.06947,6.14793 0.01725,12.10079 0.01564,1.07379 -33.70176,1.40756 -33.65181,2.50154 0.05595,1.22528 33.633687,0.71337 33.73378,1.96457 0.456869,5.71104 2.004567,16.94532 3.448042,23.23253 0.285417,1.24316 -29.283805,9.24816 -28.957242,10.51524 0.299005,1.16015 30.115436,-7.16958 30.449618,-5.98901 C 57.42434,258.48104 59.057641,263.40132 61,268.5 l 11,0 c -6.360467,-10.79671 -10.245848,-20.97466 -12.12091,-30.65002 -0.1217,-0.62797 34.265069,-8.75383 34.160179,-9.3776 -0.132559,-0.78832 -34.751794,5.92669 -34.857964,5.14497 -0.931753,-6.86045 -0.85713,-13.46932 0.05049,-19.86993 0.07221,-0.5092 30.774683,3.23292 30.857346,2.72633 0.08849,-0.5423 -30.442076,-5.33312 -30.341809,-5.87248 1.252887,-6.73957 3.416765,-13.25138 6.282696,-19.58769 0.260044,-0.57493 28.025868,10.85158 28.297317,10.2795 0.279561,-0.58918 -26.934916,-13.17687 -26.643591,-13.76312 4.497662,-9.05088 10.376531,-17.75646 17.009159,-26.2736 -0.530825,0.0169 -7.460709,-5.48137 -8.333378,-5.95923 z","m 103.9447,92.516192 c -14.323803,-10.673255 -0.52975,-29.421033 2.90469,-41.278171 10.49967,7.956293 35.32041,16.629421 27.85446,32.969669 0.83891,-21.557492 28.79445,-12.440035 41.64212,-15.984388 -4.87786,11.924881 0.8985,35.176868 -20.6057,38.788578 18.13311,-7.457989 24.07793,15.55477 35.08579,25.90991 -15.17615,2.41236 -32.01033,16.43098 -44.80851,2.19758 8.74265,13.49854 0.24049,28.43414 -6.43503,43.21753 -9.81851,-11.10492 -28.23369,-16.47872 -23.617,-37.2071 -2.11927,21.72361 -32.96424,14.60867 -46.19759,19.66116 6.379272,-12.55404 7.03277,-40.81504 27.625213,-40.34034 C 76.751858,125.82472 69.34386,102.84889 58.257513,93.89058 71.819909,91.650103 90.382304,79.328682 103.9447,92.516192 z","m 118.85897,84.988886 c -6.50106,-16.638085 15.12673,-25.240046 24.3178,-33.480881 4.78191,12.078697 23.2089,27.373417 6.1757,42.716867 15.33541,-15.982091 31.07894,4.728448 43.78993,8.485768 -10.45147,7.53413 -17.86116,30.31828 -38.01655,21.99751 19.3318,3.27302 12.19168,25.94341 16.04805,40.55608 -14.15197,-5.98804 -35.85516,-3.00761 -39.17713,-21.85828 0.27048,16.08016 -14.84964,24.24967 -28.33953,33.25712 -2.45042,-14.61909 -15.228091,-28.92741 -0.33742,-44.06833 -13.29886,17.30743 -35.699647,-5.0586 -49.601173,-7.77831 12.058296,-7.273 27.574696,-30.902483 44.793154,-19.59767 C 78.155423,98.849968 84.034698,75.436269 79.372228,61.967052 92.06416,67.246557 114.33496,66.620917 118.85897,84.988886 z","m 157.10075,113.2093 c 0.16024,11.53862 -7.25616,22.66661 -17.9216,27.03742 -10.58728,4.61562 -23.75978,2.14347 -31.92028,-6.0411 -8.283468,-7.87813 -11.112982,-20.78802 -6.9389,-31.42166 4.01115,-10.921128 15.03336,-18.772517 26.68004,-18.90845 11.54644,-0.458129 22.87406,6.686945 27.50864,17.25792 1.7134,3.77942 2.59683,7.92711 2.5921,12.07587 z","m 77.848502,100.95643 c -0.256698,3.10349 -4.726701,0.14594 -1.96469,-1.30308 0.88883,-0.41239 1.999826,0.32372 1.96469,1.30308 z","m 85.98023,96.36024 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 92.34419,102.81258 c 0.006,3.78454 -6.16778,1.91357 -4.04204,-1.23547 1.11707,-1.80477 4.12469,-0.887 4.04204,1.23547 z","m 114.50626,67.276162 c 0.007,4.390077 -7.15464,2.219752 -4.68877,-1.433144 1.2958,-2.093536 4.78463,-1.028917 4.68877,1.433144 z","m 112.20814,75.849832 c 0.005,3.027648 -4.93422,1.530858 -3.23362,-0.988375 0.89365,-1.443816 3.29974,-0.709602 3.23362,0.988375 z","m 120.33988,75.496278 c 0.006,3.633172 -5.92107,1.837033 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.851518 3.88035,1.18605 z","m 164.78532,76.372354 c 0.005,3.179023 -5.18094,1.607402 -3.39531,-1.037795 0.93834,-1.516007 3.46473,-0.74508 3.39531,1.037795 z","m 165.84598,84.68085 c 0.008,4.69284 -7.64806,2.37283 -5.01212,-1.53198 1.38516,-2.237923 5.1146,-1.09988 5.01212,1.53198 z","m 155.41616,84.85764 c 0.006,3.78455 -6.16779,1.91358 -4.04204,-1.23547 1.11707,-1.804771 4.12469,-0.887 4.04204,1.23547 z","m 172.52795,127.71208 c 0.005,3.17903 -5.18094,1.60741 -3.39531,-1.03779 0.93834,-1.516 3.46473,-0.74508 3.39531,1.03779 z","m 166.34077,129.92179 c 0.005,3.3304 -5.42765,1.68395 -3.55699,-1.08721 0.98301,-1.5882 3.62972,-0.78056 3.55699,1.08721 z","m 162.45169,122.40878 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93895 0.84897,-1.37164 3.13475,-0.67412 3.07195,0.93895 z","m 139.52706,163.30397 c -0.27274,3.29745 -5.02211,0.15506 -2.08748,-1.38452 0.94438,-0.43815 2.12481,0.34395 2.08748,1.38452 z","m 133.87021,158.44261 c 0.006,3.63317 -5.92107,1.83703 -3.88035,-1.18605 1.07238,-1.73258 3.95969,-0.85152 3.88035,1.18605 z","m 138.64318,150.75282 c 0.007,4.08732 -6.66121,2.06666 -4.36539,-1.33431 1.20643,-1.94914 4.45465,-0.95796 4.36539,1.33431 z","m 89.68213,145.99025 c 0.005,2.87626 -4.68752,1.45432 -3.07195,-0.93896 0.84897,-1.37162 3.13476,-0.67412 3.07195,0.93896 z","m 99.75841,145.81348 c 0.005,3.17902 -5.18094,1.6074 -3.39531,-1.0378 0.93834,-1.51601 3.46473,-0.74507 3.39531,1.0378 z","m 101.87973,138.38885 c 0.007,4.08731 -6.66121,2.06666 -4.3654,-1.33431 1.20643,-1.94916 4.45466,-0.95795 4.3654,1.33431 z"',
    crystal: 'endpoints,center,face1,face2,face3,face4,face5,face6,face7,face8,face9,face10,face11,bubble1,reflect1,bubble2,reflect2,bubble3,reflect3,bubble4,reflect4,streak1,streak2,streak3\nsmall small,"m 79,107.04488 35,-15.437279 21.5,3.026918 23,9.686141 13.5,13.62113 -8,10.29152 -25.5,13.01575 -39,-13.92383 z","M 78,106.74219 16,111.28257 28.5,87.067225 z","M 78,106.74219 28,86.461841 72.5,71.932635 l 42,19.674966 z","m 114,91.30491 -41.5,-19.977659 63,-0.605383 0,23.912651 z","m 135.7645,94.577181 0,-24.186003 63.99317,10.701771 -41.7193,22.687751 z","m 158,103.71527 42,-22.39919 34,12.410364 z","M 158.03837,103.7807 234.4059,93.721039 231.57747,130.10706 172.1805,118.12108 z","m 172.1805,117.90704 59.75052,12.41406 -42.77996,21.83161 -25.10229,-24.18601 z","m 164.40233,128.39478 24.39518,23.75793 -35.70889,11.98598 -14.14214,-23.11582 z","m 139.30004,141.2369 13.78858,22.90179 -74.599767,-8.13334 21.566757,-28.68075 z","M 99.702056,127.11056 78.488853,155.79131 39.951533,143.16322 z","M 99.702056,127.3246 39.59798,143.16322 14.849242,111.05791 79.19596,106.56316 z","m 95.012488,95.004719 c 0.112,7.720731 -5.31375,15.116901 -12.7948,17.396831 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035029 -1.31129,-21.488785 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 74.642118,88.055648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 181.51852,100.75 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 161.14815,93.800929 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 223.01249,118.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.633871 19.33322,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 202.64212,111.55565 c 1.9753,-1.8287 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z","m 117.01249,129.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.039721,2.34223 -15.364531,-0.0187 -20.013511,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.63387 19.333221,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 96.642119,122.55565 c 1.9753,-1.8287 3.950621,-3.65741 5.925931,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614001,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z",,,\nsmall big,"m 95.5,107.5 c 1,-2 18,-43 18,-43 l 8.5,7 11,30 5,35 -3.5,28.5 -12.5,38 -16,-40 z","m 94.5,109.5 -71.5,9 25.5,-80 z","M 94.5,109 48,37.5 104,9.4999999 112.5,64 z","M 112.5,64 104,8.9999999 157,13.5 121.5,70 z","m 121.62237,70.595888 35.00178,-57.982757 34.29468,25.455845 -58.33631,62.225394 z","m 133,100.5 57.5,-63 34,34 z","M 132.93607,100.29437 225.21351,71.302994 221.67798,171.71216 138.59293,136.71037 z","m 138.23938,136.35682 83.79215,35.35534 -42.07285,61.16473 -45.60839,-68.94291 z","m 134.70384,164.28754 45.25484,68.2358 -37.47666,34.29468 -20.85965,-64.34672 z","m 121.97592,202.11775 20.5061,64.70027 -73.185555,-22.62742 36.062445,-81.67083 z","M 105.00536,162.51977 69.650018,244.1906 31.112698,209.54237 z","m 105.35891,162.87332 -74.599765,46.66905 -8.131728,-90.86322 72.478445,-9.54594 z","m 100.51249,65.504719 c 0.112,7.72073 -5.313752,15.1169 -12.794802,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.690772,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 80.142118,58.555648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 157.51249,49.004719 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 137.14212,42.055648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 223.01249,118.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.633871 19.33322,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 202.64212,111.55565 c 1.9753,-1.8287 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z","m 106.04193,204.80981 c 0.112,7.72073 -5.31375,15.1169 -12.794803,17.39683 -7.03972,2.34223 -15.364532,-0.0187 -20.013512,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.016082,-9.63387 19.333222,-8.05898 7.74348,1.45337 14.000963,8.29711 14.690773,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 85.671557,197.86074 c 1.9753,-1.82871 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39766 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.804 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z",,,\nbig small,"m 46,103.15046 44,-23.676185 50.5,1.183809 62.5,14.205713 7.5,29.003333 -29.5,16.27738 -33,8.28666 -66,-10.65428 z","m 45.5,102.55856 -26,9.47047 13,-24.859994 z","M 46,102.85451 32.25,87.169036 76,71.779513 90,79.474275 z","m 89.449008,79.249951 -13.788582,-7.742987 63.639614,0 0.35355,8.789337 z","m 140.00714,80.296301 -0.7071,-9.207877 64.70027,10.882036 -1.41422,12.765465 z","m 202.23254,94.317385 1.76777,-12.137655 33.94112,12.765465 z","m 202.58609,94.526655 36.06245,0.41854 -2.47487,34.529535 -25.45585,-5.65028 z","m 210.01071,123.61517 26.51651,5.85956 -43.48707,22.18261 -11.66726,-11.71911 z","m 181.37289,139.93823 11.66726,11.71911 -35.35534,11.92839 -9.89949,-15.48598 z","M 148.13887,148.30902 157.68481,163.795 82.731493,155.63347 82.37794,137.63626 z","m 82.731493,137.63626 0,18.20648 L 44.194174,142.868 z","m 82.37794,137.63626 -38.183766,5.02248 -25.809398,-30.76268 27.577165,-9.41715 z","m 95.012488,95.004719 c 0.112,7.720731 -5.31375,15.116901 -12.7948,17.396831 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035029 -1.31129,-21.488785 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 74.642118,88.055648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 181.51852,100.75 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 161.14815,93.800929 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 223.01249,118.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.633871 19.33322,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 202.64212,111.55565 c 1.9753,-1.8287 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z","m 117.01249,129.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.039721,2.34223 -15.364531,-0.0187 -20.013511,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.63387 19.333221,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 96.642119,122.55565 c 1.9753,-1.8287 3.950621,-3.65741 5.925931,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614001,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z",,,\nbig big,"m 52.5,86.5 55,-58.5 33,12.5 34,34 13,84 -21.5,55 -30.5,37 -69,-47 z","M 52,86 22.5,115.5 38,56 z","M 52.325901,85.798684 37.476659,55.039538 105.35891,9.0775975 107.48023,27.462374 z","M 107.12668,27.815927 105.00536,8.3704908 157.68481,13.320238 141.0678,40.190296 z","m 141.0678,40.543849 17.32412,-27.577164 33.94112,24.395184 -18.73833,36.415999 z","m 173.94827,73.070761 17.67767,-35.708892 33.58757,33.234019 z","m 173.94827,73.424315 51.26524,-2.828427 -2.82843,101.469822 -34.64823,-14.14213 z","m 187.3833,157.92358 35.70889,14.14213 -43.48707,62.2254 -13.43503,-21.56676 z","m 165.81654,213.0779 14.14214,21.92031 -38.18377,31.46626 -5.65685,-16.61701 z","m 135.7645,250.20101 6.01041,16.26346 -73.185552,-20.15255 -2.474874,-43.48706 z","m 66.468037,203.17841 1.767767,42.77996 -38.890873,-37.47666 z","M 66.114484,203.17841 28.637825,208.12816 21.566757,115.49717 52.325902,85.44513 z","m 100.51249,65.504719 c 0.112,7.72073 -5.313752,15.1169 -12.794802,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.690772,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 80.142118,58.555648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 157.51249,49.004719 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.035028 -1.31129,-21.488784 3.95332,-6.295928 12.01608,-9.633876 19.33322,-8.058982 7.74348,1.453365 14.00096,8.297103 14.69077,16.045767 0.0639,0.621115 0.0956,1.245439 0.0956,1.869739 z","m 137.14212,42.055648 c 1.9753,-1.828703 3.95062,-3.657407 5.92593,-5.486111 1.92043,1.397668 4.56671,2.554696 4.94247,5.178535 0.24496,1.498962 0.58981,4.804003 -0.02,5.101258 -2.01372,-2.717557 -5.12444,-4.740711 -8.614,-4.788912 -0.74382,-0.04674 -1.4903,-0.04235 -2.23443,-0.0048 z","m 223.01249,118.50472 c 0.112,7.72073 -5.31375,15.1169 -12.7948,17.39683 -7.03972,2.34223 -15.36453,-0.0187 -20.01351,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.01608,-9.633871 19.33322,-8.05898 7.74348,1.45337 14.00096,8.29711 14.69077,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 202.64212,111.55565 c 1.9753,-1.8287 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39767 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.80401 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z","m 106.04193,204.80981 c 0.112,7.72073 -5.31375,15.1169 -12.794803,17.39683 -7.03972,2.34223 -15.364532,-0.0187 -20.013512,-5.76457 -5.09025,-5.89294 -5.63064,-15.03503 -1.31129,-21.48879 3.95332,-6.29592 12.016082,-9.63387 19.333222,-8.05898 7.74348,1.45337 14.000963,8.29711 14.690773,16.04577 0.0639,0.62111 0.0956,1.24544 0.0956,1.86974 z","m 85.671557,197.86074 c 1.9753,-1.82871 3.95062,-3.65741 5.92593,-5.48611 1.92043,1.39766 4.56671,2.55469 4.94247,5.17853 0.24496,1.49896 0.58981,4.804 -0.02,5.10126 -2.01372,-2.71756 -5.12444,-4.74071 -8.614,-4.78891 -0.74382,-0.0467 -1.4903,-0.0423 -2.23443,-0.005 z",,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,\n,, ,,,,,,,,,,,,,,,,,,,,,',
    island: 'header\ncell\ncell\ncell\ncell',
    planet: 'header\ncell\ncell\ncell\ncell'
  }
}

/*
python

def manipulate(string, xadd=0, yadd=0):
  points = string.split(" ")
  new_points = []
  for point in points:
    x, y = point.split(",")
    new_x = int(round(float(x)))+xadd
    new_y = int(round(float(y)))+yadd
    new_points.append(str(new_x)+","+str(new_y))
  return " ".join(new_points)
*/
