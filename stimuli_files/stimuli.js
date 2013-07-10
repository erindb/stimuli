var ErinTools = {
  shuffle: function(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;}, // non-destructive.

  ColorRandomizer: function(nSteps) {
    if (nSteps==null) {var nSteps=10}
    this.get = get;
    
    function hues(n) {
      var h = [];
      for (var i=0;i<n-1;i++) {
        var offset = Math.random() * .99 / n;
        h.push((i/n)+offset);
      }
      return ErinTools.shuffle(h);
    }
    
    var myHues = hues(nSteps);
    
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
    if (saturation == null) {saturation = false;}
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
  
  stroke: function(object) {
    object.attr("stroke", Stimuli.strokeColor);
    object.attr("stroke-width", Stimuli.strokeWidth);
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
    return intro + Stimuli.lighten(origColor) + "-" + Stimuli.darken(origColor);
  },

  myColor: function(meanColor, hVar, sVar, vVar) {
    if (hVar == null) {var hVar = 0.01};
    if (sVar == null) {var sVar = 0.1};
    if (vVar == null) {var vVar = 0.1};
    var c = Raphael.color(meanColor);
    var hue = ErinTools.uniformAroundMean(c.h, hVar);
    var saturation = ErinTools.uniformAroundMean(c.s, sVar);
    var value = ErinTools.uniformAroundMean(c.v, vVar);
    var newColor = Raphael.hsb2rgb(hue, saturation, value);
    return newColor.hex;
  },

  Tree: function() {
    this.draw = draw;
    var baseBerryColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseTrunkColor = Stimuli.colorScheme.get(true, .5, .8);
    var baseLeafColor = Stimuli.colorScheme.get(true, .5, .99);
    var baseWidth = Math.random();
    var baseHeight = Math.random();
    this.baseBerryColor = baseBerryColor;
    this.baseLeafColor = baseLeafColor;
    this.baseTrunkColor = baseTrunkColor;
    this.baseWidth = baseWidth;
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
      trunk.attr("fill", trunkGradient);
      Stimuli.stroke(trunk);
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
        Stimuli.stroke(myPath); 
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
        leaf.attr("fill", leafColor);
        Stimuli.stroke(leaf);
        leaf.rotate(angle, xpos, ypos);

        var stem = paper.path(stemPath);
        Stimuli.stroke(stem);
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
            berry.attr("fill", berryColor);
            Stimuli.stroke(berry);  
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
          Stimuli.stroke(stem);
          drawBerry(rightBerryPos);
          drawBerry(leftBerryPos);
        }
        positions.map(drawBerryClump);
      }
      drawBerryClumps(berryPositions);
      return berryColor;
    }

    //-------DRAW TREE------//
    function draw(label, berries, leaves, scaleFactor) {
      var w = ErinTools.uniformAroundMean(baseWidth, 0.1);
      var h = ErinTools.uniformAroundMean(baseHeight, 0.1);
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
    this.draw = draw;
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
        frontLeftWing.attr("fill", Stimuli.makeGradient("0-",wingsColor));
        Stimuli.stroke(frontLeftWing);
        var frontRightWing = paper.path("M " + paperCenter[0].toString() + "," + 
                                    (paperCenter[1]-(bodyYRadius/2)).toString() +
                                    "c -16,-9 -28,-42 -33,-58 -9,-37 3,-63 45,-8 " +
                                    "14,18 11,41 11,61 z");
        frontRightWing.attr("fill", Stimuli.makeGradient("0-",wingsColor));
        Stimuli.stroke(frontRightWing);
        var backLeftWing = paper.path("M " + (paperCenter[0]+35).toString() + "," + 
                                    (paperCenter[1]+(bodyYRadius/2)).toString() +
                                    "c 11,8 20,34 23,47 6,30 -2,50 -31,6 -10,-15" +
                                    " -8,-33 -8,-49 z");
        backLeftWing.attr("fill", Stimuli.makeGradient("180-",wingsColor));
        Stimuli.stroke(backLeftWing);
        var backRightWing = paper.path("M " + (paperCenter[0]+35).toString() + "," + 
                                    (paperCenter[1]-(bodyYRadius/2)).toString() +
                                    "c 11,-8 20,-34 23,-47 6,-30 -2,-50 -31,-6 -10,15" +
                                    " -8,33 -8,49 z");
        backRightWing.attr("fill", Stimuli.makeGradient("180-",wingsColor));
        Stimuli.stroke(backRightWing);
      }
      return wingsColor;
    }
    
    function drawBody(paper, bodyXRadius, bodyYRadius) {
      //body
      var bodyColor = Stimuli.myColor(baseBodyColor);
      var body = paper.ellipse(paperCenter[0], paperCenter[1], bodyXRadius, bodyYRadius);
      body.attr("fill", Stimuli.makeGradient("r",bodyColor));
      Stimuli.stroke(body);
    }
    
    function drawHead(paper, bodyXRadius, headXRadius, headYRadius) {
      //head
      var headXPos = paperCenter[0]-bodyXRadius;
      var headYPos = paperCenter[1];
      var head = paper.ellipse(headXPos, headYPos,
                           headXRadius, headYRadius);
      head.attr("fill", "r#777777-#555555");
      Stimuli.stroke(head);
      drawEyes(paper, bodyXRadius, headYRadius);
    }
    
    function draw(label, wings, antennae, scaleFactor) {
      var bodyFatness = ErinTools.uniformAroundMean(baseBodyFatness, 0.15);
      var headFatness = ErinTools.uniformAroundMean(baseHeadFatness, 0.15);
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
    this.draw = draw;
    function drawHead(paper, color, crest, gradColor, crestColor) {
      var headCenter = [paperCenter[0], paperCenter[1]-35];
      var headStretch = ErinTools.uniformAroundMean(baseHeadStretch, 0.1) * 2 + .7;
      var head = paper.ellipse(headCenter[0], headCenter[1], 25*headStretch, 25);
      head.attr("fill", gradColor);
      Stimuli.stroke(head);
      if (crest) {
        var crest = paper.path("M "+headCenter[0].toString()+","+(headCenter[1]-16).toString()+" c -3,-13 -3,-27 -2,-41 0,-5 0,-10 2,-15 2,1 2,6 2,9 1,14 2,29 2,44 1,-14 1,-29 5,-43 0,-2 3,-7 4,-2 1,10 0,20 -1,30 -1,5 -1,10 -2,14 3,-11 5,-23 8,-33 1,-3 2,-2 2,1 0,12 -2,24 -4,36 0,1 1,-3 1,-5 2,-9 4,-18 7,-27 3,-4 2,4 2,6 -1,10 -4,20 -7,30 2,-9 5,-18 9,-26 1,-3 4,-2 3,1 -1,10 -5,19 -9,28 -1,2 -1,2 0,0 2,-5 5,-11 9,-15 3,-1 0,5 0,7 -2,5 -5,10 -8,15 3,-4 6,-8 10,-10 3,1 -1,6 -2,7 -1,2 -5,6 -5,6 4,0 8,-2 12,-1 0,3 -5,4 -7,5 -2,1 -6,3 -7,2 4,1 9,2 12,5 -1,3 -6,1 -8,1 -2,0 -5,-1 -5,-2 3,2 7,3 9,7 -2,2 -7,0 -10,0 -2,-1 -5,-1 -2,-3 3,-4 4,-9 4,-14 -1,-7 -5,-14 -11,-18 -4,-3 -9,-1 -12,2 -2,1 -3,6 -4,5 -5,-10 -8,-21 -8,-32 -1,-3 2,-6 4,-2 4,8 5,17 7,26 0,1 0,3 1,4 z");
        crest.attr("fill", crestColor);
        crest.transform("s"+headStretch.toString()+",1,"+headCenter[0].toString()+","+headCenter[1].toString());
        Stimuli.stroke(crest);
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
      beak.attr("fill", "#ffff00");
      Stimuli.stroke(beak);
      return headStretch;
    }
    function drawBody(paper, color, tail, gradColor, tailColor) {
      var bodyStretch = ErinTools.uniformAroundMean(baseBodyStretch, 0.1) * 1 + 0.5;
      if (tail) {
        //var tail = paper.path("m "+(paperCenter[0]+40).toString()+","+(paperCenter[1]+30*(bodyStretch)).toString()+" c  93.041702,66.6439 62.708612,55.1315 0.566359,6.6972 24.219543,16.1729 127.541683,98.4836 -2.315079,6.5466 70.203552,48.3289 71.370392,57.77 -4.801623,3.2366 31.342565,20.6587 80.305665,60.7674 -7.288272,-0.073 60.818577,41.2828 21.46453,21.8232 -8.136197,-2.2717 z");
        var tail = paper.path("m "+(paperCenter[0]+40).toString()+","+(paperCenter[1]+30*(bodyStretch)).toString()+" c 137.26897,150.89247 82.32553,110.54987 0.30161,10.02344 46.18326,48.1754 176.28904,249.77883 -3.11677,7.44872 92.78521,131.08631 86.30285,142.69291 -5.89011,0.6876 37.68329,59.04719 107.18694,190.15081 -8.66356,-6.07301 65.48223,117.84362 17.00792,63.34319 -9.54987,-9.90587");
        tail.attr("fill", tailColor);
        Stimuli.stroke(tail);
      }
      var feetPositions = [[paperCenter[0]-6, paperCenter[1]+(47*bodyStretch)],
                           [paperCenter[0]+9, paperCenter[1]+(52*bodyStretch)]];
      function drawFeet(footPos) {
        var foot = paper.path("M "+footPos[0].toString()+","+footPos[1].toString()+" c   -4.399089,0.11316 -7.038982,4.87269 -10.212137,8.224 4.826226,-2.61036 8.926115,-5.61798 10.461214,-3.94752 -1.485313,6.67276 -0.358531,8.74561 0,12.17151 l 3.487071,-12.17151 c 5.224559,2.71563 6.202493,7.26752 9.215831,10.52671 -1.077715,-3.29906 -2.116802,-8.64624 -4.711083,-10.91146 0.779699,-1.28702 4.098125,-1.19294 4.581633,-1.11636 -0.273048,-0.92977 -5.365348,-1.37347 -6.844693,-1.78849 z");
        foot.attr("fill", "#999999");
        Stimuli.stroke(foot);
      }
      feetPositions.map(drawFeet);
      
      var leftLeg = paper.path("M "+(paperCenter[0]-14).toString()+","+(paperCenter[1]+20).toString()+" c   0,2.96064 7.472295,25.98784 7.472295,25.98784 l 5.977836,1.31584 c 2.371438,-4.19555 4.387931,-8.67243 3.487072,-15.46112 z");
      leftLeg.attr("fill", color);
      Stimuli.stroke(leftLeg);
      leftLeg.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      
      var rightLeg = paper.path("M "+(paperCenter[0]).toString()+","+(paperCenter[1]+25).toString()+" c 0,2.96064 7.472295,25.98785 7.472295,25.98785 l 5.977836,1.31584 c 2.371438,-4.19569 4.387931,-8.67258 3.487071,-15.46113 z");
      rightLeg.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      rightLeg.attr("fill", color);
      Stimuli.stroke(rightLeg);
      
      var body = paper.path("m "+(paperCenter[0]+30).toString()+","+(paperCenter[1]+5).toString()+" c 2,8 6,15 6,24 0,4 -3,8 -7,9 -7,2 -15,0 -22,-2 -9,-2 -17,-7 -23,-14 -4,-6 -8,-12 -10,-19 -2,-7 1,-14 6,-18 7,-6 16,-8 25,-7 8,1 15,7 18,14 3,5 5,10 6,15 z");
      body.attr("fill", color);
      //body.attr("fill", color);
      //body.attr("fill", Stimuli.makeGradient("0-",color));
      Stimuli.stroke(body);
      body.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      var wing = paper.path("m "+(paperCenter[0]).toString()+","+(paperCenter[1]-15).toString()+" c -4,13 -7,28 -3,42 22,24 45,48 67,72 -8,-23 -11,-48 -18,-72 -4,-14 -8,-28 -17,-40 -4,-6 -12,-10 -20,-7 -3,1 -6,3 -9,5 z");
      wing.attr("fill", color);
      Stimuli.stroke(wing);
      wing.transform("s1,"+bodyStretch.toString()+","+paperCenter[0].toString()+","+paperCenter[1].toString());
      return bodyStretch;
    }
    function draw(label, crest, tail, scaleFactor) {
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
    this.draw = draw;
    function draw(label, spikes, bumps, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(baseColor);
      var bumpsColor = Stimuli.myColor(baseBumpsColor);
      var spikesColor = Stimuli.myColor(baseSpikesColor);
      var xRadius = ErinTools.uniformAroundMean(baseXRadius, 0.1);
      var yRadius = ErinTools.uniformAroundMean(baseYRadius, 0.1);
      var xRad = getRadius(xRadius);
      var yRad = getRadius(yRadius);
      function getRadius(r) {
        var minRad = 50;
        var maxRad = 75;
        return (r*(maxRad-minRad))+minRad;
      }
      function drawMicrobe() {
        var microbe = paper.ellipse(paperCenter[0], paperCenter[1], xRad, yRad);
        microbe.attr("fill", Stimuli.lighten(color));
        Stimuli.stroke(microbe);
        var microbe = paper.ellipse(paperCenter[0], paperCenter[1],
                                    xRad-10, yRad-10);
        microbe.attr("fill", Stimuli.makeGradient("r",color));
        microbe.attr("stroke", color);
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
          spike.attr("fill", spikesColor);
          Stimuli.stroke(spike);
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
          bump.attr("fill", bumpsColor);
          Stimuli.stroke(bump);
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
          flagellum.attr("fill", Stimuli.darken(color));
          Stimuli.stroke(flagellum);
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
    this.draw = draw;
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
                       "left horn line2" ];
    function getPathString(p, tallness, fatness) {
      var ss = endpoints.shortSkinny[p];
      var sf = endpoints.shortFat[p];
      var shortFatEnough = ErinTools.intermediate(ss, sf, fatness);
      var ts = endpoints.tallSkinny[p];
      var tf = endpoints.tallFat[p];
      var tallFatEnough = ErinTools.intermediate(ts, tf, fatness);
      return ErinTools.intermediate(shortFatEnough, tallFatEnough, tallness);
    }
    function draw(label, horns, teeth, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var tallness = ErinTools.uniformAroundMean(this.baseFatness, 0.1);
      var fatness = ErinTools.uniformAroundMean(this.baseFatness, 0.1);
      var color = Stimuli.myColor(this.baseColor);
      var accentColor = Stimuli.myColor(this.baseAccentColor);
      var lightAccent = Stimuli.lighten(accentColor, true);
      var colors = {"left eye": "#ffffff",
                    "left pupil": "#000000",
                    "right eye": "#ffffff",
                    "right pupil": "#000000",
                    "mouth": color,
                    "body": color,
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
        drawnPath.attr("fill", colors[piece]);
        Stimuli.stroke(drawnPath);
        drawnPath.transform("s0.8,"+paperCenter[0]+","+paperCenter[1]);
      }
      if (teeth) {
        for (var i = 0; i < teethPieces.length; i++) {
          var piece = teethPieces[i];
          var pathString = getPathString(piece, tallness, fatness);
          var drawnPath = paper.path(pathString);
          drawnPath.attr("fill", colors[piece]);
          Stimuli.stroke(drawnPath);
          drawnPath.transform("s0.8,"+paperCenter[0]+","+paperCenter[1]);
        }
      }
      if (horns) {
        for (var i = 0; i < hornsPieces.length; i++) {
          var piece = hornsPieces[i];
          var pathString = getPathString(piece, tallness, fatness);
          var drawnPath = paper.path(pathString);
          drawnPath.attr("fill", colors[piece]);
          Stimuli.stroke(drawnPath);
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
  
  images: { monster: '"endpoint","left eye","left pupil","right eye","right pupil","mouth","body","left arm","right arm","left foot","right foot","left toe1","left toe2","left toe3","right toe1","right toe2","right toe3","left pad","right pad","left tooth","right tooth","left horn","right horn","left horn line1","left horn line2","right horn line1","left horn line2"\n"short skinny","m 159.5,175.625 c 0,6.69645 -6.10012,12.125 -13.625,12.125 -7.52488,0 -13.625,-5.42855 -13.625,-12.125 0,-6.69645 6.10012,-12.125 13.625,-12.125 7.52488,0 13.625,5.42855 13.625,12.125 z","m 139,181.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 111.5,175.25 c 0,6.62742 -5.87626,12 -13.125,12 -7.248737,0 -13.125,-5.37258 -13.125,-12 0,-6.62742 5.876263,-12 13.125,-12 7.24874,0 13.125,5.37258 13.125,12 z","m 105,181 c -1.07711,14.64565 -21.209492,-5.15625 -6.11054,-5.96632 3.14779,-0.0486 6.36979,2.64659 6.11054,5.96632 z","m 90,194 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 180.00001,199 c 10.73889,13.71279 6.15721,36.05831 -9.38601,44.15746 -24.85449,16.0425 -56.42647,13.06828 -84.073258,7.59996 -13.762129,-3.11226 -30.703856,-11.67588 -30.467578,-27.96589 0.679317,-16.32231 10.876946,-29.99246 16.028475,-45.03857 8.892153,-20.16777 23.632677,-42.19704 47.516051,-44.73994 19.89895,-1.97807 35.18157,14.67587 43.71234,30.77445 6.41914,11.31349 11.08625,23.48988 16.66998,35.21253 z",,,"m 205,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 185.20403,191.26498 206.30351,207.96876 205,227 z","m 102,230.5 c 1.79299,21.60726 -25.909148,39.22267 -44.114816,26.18477 C 37.293689,244.47978 40.550613,208.28271 64.035226,201.30135 82.204032,194.76498 103.30351,211.46876 102,230.5 z","m 156.0807,215.5 c 8.02518,17.85899 15.69247,-16.24875 0.61881,-2.50403 -0.5,0.75315 -0.47787,1.64814 -0.61881,2.50403 z","m 171,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 173.76305,203.31659 170.92094,205.77872 171,209 z","m 186,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 62,225 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 77.000002,214.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 91.919292,221 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 161,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 87.000002,242 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 131.75,200.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.45981,-5.42896 0.72451,-10.76122 0.81791,-13.27823 0.0862,-2.32247 -5.76196,1.98696 -13.06791,2.52823 z","m 99,197.25 c 1.5,5.25 3,10.5 4.5,15.75 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.83333,-2.33333 -13.25,-3.5 z","m 137,135 c 17.9114,1.52532 21.58458,-20.79896 26.04126,-30.95678 12.74526,6.71014 10.65238,27.15296 8.42397,39.37181 -5.66391,17.06286 -27.28644,12.40232 -32.39405,-2.2554 C 138.08665,139.22223 137.36515,137.14491 137,135 z","m 102.81449,137.6467 c -17.911388,1.52531 -21.584578,-20.79896 -26.041258,-30.95678 -12.746593,6.71152 -10.652609,27.1576 -8.422138,39.37761 5.656588,17.04009 27.313168,12.40822 32.384146,-2.26692 0.97923,-1.93868 1.70003,-4.01314 2.07925,-6.15391 z","m 150.89802,129.99287 c 3.47549,7.96431 13.48564,9.85183 21.2132,8.48528","m 157.26198,119.73981 c 3.89994,3.71966 10.3991,5.70549 15.20279,2.47487","m 88.142282,131.4552 c -3.47549,7.96431 -13.48563,9.85183 -21.213196,8.48528","m 81.778322,121.20214 c -3.89995,3.71965 -10.399094,5.70549 -15.202786,2.47487"\n"short fat","m 159.5,175.625 c 0,6.69645 -6.10012,12.125 -13.625,12.125 -7.52488,0 -13.625,-5.42855 -13.625,-12.125 0,-6.69645 6.10012,-12.125 13.625,-12.125 7.52488,0 13.625,5.42855 13.625,12.125 z","m 139,181.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 111.5,175.25 c 0,6.62742 -5.87626,12 -13.125,12 -7.248737,0 -13.125,-5.37258 -13.125,-12 0,-6.62742 5.876263,-12 13.125,-12 7.24874,0 13.125,5.37258 13.125,12 z","m 105,181 c -1.07711,14.64565 -21.209492,-5.15625 -6.11054,-5.96632 3.14779,-0.0486 6.36979,2.64659 6.11054,5.96632 z","m 90,194 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 231.99999,193.99999 c 36.08695,40.64524 -2.92904,60.87795 -41.31031,61.45662 -42.83938,4.1979 -85.7047,-4.573 -128.558913,-0.48455 -35.571432,3.93279 -64.1502383,1.27806 -56.3742294,-39.2093 6.1897904,-16.71923 14.9022284,-30.92929 25.5505904,-42.93419 25.531801,-28.72455 55.104868,-38.94434 90.114572,-41.14621 32.90303,-3.00756 54.98802,12.1456 75.75483,30.18991 12.10406,11.94465 24.97686,20.15634 34.82346,32.12772 z",,,"m 241,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 221.20403,191.26498 242.30351,207.96876 241,227 z","m 70.000002,228.5 c 1.79299,21.60726 -25.90915,39.22267 -44.114818,26.18477 C 5.293689,242.47978 8.550613,206.28271 32.035226,199.30135 50.204032,192.76498 71.303512,209.46876 70.000002,228.5 z","m 192.0807,215.5 c 8.02401,17.85879 15.69367,-16.2473 0.6192,-2.50489 -0.49989,0.75353 -0.47854,1.64857 -0.6192,2.50489 z","m 207,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 209.76305,203.31659 206.92094,205.77872 207,209 z","m 222,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 30,223 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 45.000002,212.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 59.919292,219 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 197,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 55.000002,240 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 131.75,200.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.45981,-5.42896 0.72451,-10.76122 0.81791,-13.27823 0.0862,-2.32247 -5.76196,1.98696 -13.06791,2.52823 z","m 99,197.25 c 1.5,5.25 3,10.5 4.5,15.75 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.83333,-2.33333 -13.25,-3.5 z","m 162.79675,137.65553 c 13.83057,-1.89087 17.29322,-17.77134 17.73267,-29.4664 -0.89317,-17.131773 15.4111,3.96795 14.85141,11.96622 6.31402,12.32285 2.78905,36.36691 -15.30985,32.75418 -7.02283,-3.20542 -14.47695,-7.57893 -17.27423,-15.254 z","M 72.54914,143.02767 C 58.814955,140.5313 56.052971,124.5141 56.127498,112.81102 c 1.644588,-17.076015 -15.570468,3.2874 -15.362529,11.30253 -6.849047,12.03371 -4.383306,36.20936 13.85678,33.39487 7.156815,-2.89394 14.795786,-6.93591 17.927391,-14.48075 z","m 175.32564,129.82908 c 5.11674,7.06002 15.22536,6.75857 22.52588,3.81904","m 179.38332,118.46421 c 4.59317,2.86539 11.38672,3.46119 15.38274,-0.78811","m 59.927607,133.31658 c -5.42182,6.82852 -15.507439,6.08349 -22.671835,2.82622","m 56.372888,121.78449 c -4.71456,2.66093 -11.527716,2.95785 -15.33329,-1.46282"\n"tall skinny","m 155,110.5 c 0,6.90356 -6.04416,12.5 -13.5,12.5 -7.45584,0 -13.5,-5.59644 -13.5,-12.5 0,-6.90356 6.04416,-12.5 13.5,-12.5 7.45584,0 13.5,5.59644 13.5,12.5 z","m 135,116.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 107,110.25 c 0,6.76549 -5.93223,12.25 -13.25,12.25 -7.317773,0 -13.25,-5.48451 -13.25,-12.25 0,-6.76549 5.932227,-12.25 13.25,-12.25 7.31777,0 13.25,5.48451 13.25,12.25 z","m 101,116 c -1.05428,15.09255 -21.092549,-4.94572 -6,-6 3.19473,-0.0963 6.09624,2.80529 6,6 z","m 86,129 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 183.12272,181.9729 c -1.27868,25.82012 -6.31535,53.2175 -28.30421,66.56187 -20.38503,9.76551 -43.34353,8.02907 -61.868155,-0.93401 C 66.242315,231.08411 54.546987,208.3034 57.621976,180.071 c 3.941758,-18.75168 7.879959,-34.16772 8.624605,-52.04041 -3.374387,-41.978572 -2.694876,-96.158604 52.241869,-95.329459 52.20398,-0.06014 53.45326,54.43981 54.76442,94.807689 -1.4255,18.93949 8.85818,37.98449 9.86985,54.46408 z",,,"m 205,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 185.20403,191.26498 206.30351,207.96876 205,227 z","m 102,230.5 c 1.79299,21.60726 -25.909148,39.22267 -44.114816,26.18477 C 37.293689,244.47978 40.550613,208.28271 64.035226,201.30135 82.204032,194.76498 103.30351,211.46876 102,230.5 z","m 156.0807,215.5 c 8.02518,17.85899 15.69247,-16.24875 0.61881,-2.50403 -0.5,0.75315 -0.47787,1.64814 -0.61881,2.50403 z","m 171,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 173.76305,203.31659 170.92094,205.77872 171,209 z","m 186,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 62,225 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 77.000002,214.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 91.919292,221 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 161,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 87.000002,242 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 127.75,135.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.13448,-4.764 1.0062,-16.31587 -0.0474,-13.4052 -0.30748,0.84944 -4.23792,1.90381 -12.20263,2.6552 z","m 95.25,132.75 c 1.5,5.25 2.75,10 4.25,15.25 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.58333,-1.83333 -13,-3 z","m 136.6114,37.41027 c 13.91819,1.069462 20.65316,-13.723082 23.54998,-25.062223 2.74115,-16.9346175 14.22712,7.129868 11.99266,14.830045 3.57222,13.377546 -4.94587,36.136809 -21.87527,28.787139 C 144.09017,51.350468 137.7266,45.502663 136.6114,37.41027 z","M 97.42589,38.05697 C 83.5077,39.126434 76.77273,24.333889 73.87591,12.994745 71.134762,-3.939873 59.648772,20.124609 61.883237,27.82479 58.311024,41.202339 66.829121,63.961601 83.75852,56.611931 89.94712,51.997168 96.31069,46.149363 97.42589,38.05697 z","m 150.50942,32.40314 c 3.51216,7.980573 13.45685,9.818493 21.2132,8.48528","m 156.87338,22.15008 c 3.88529,3.769897 10.40024,5.785508 15.20278,2.47487","m 82.75368,31.86547 c -3.51216,7.980571 -13.45685,9.818493 -21.2132,8.48528","m 76.38972,21.61241 c -3.88529,3.769905 -10.400247,5.785504 -15.20279,2.47487"\n"tall fat","m 155,110.5 c 0,6.90356 -6.04416,12.5 -13.5,12.5 -7.45584,0 -13.5,-5.59644 -13.5,-12.5 0,-6.90356 6.04416,-12.5 13.5,-12.5 7.45584,0 13.5,5.59644 13.5,12.5 z","m 135,116.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 107,110.25 c 0,6.76549 -5.93223,12.25 -13.25,12.25 -7.317773,0 -13.25,-5.48451 -13.25,-12.25 0,-6.76549 5.932227,-12.25 13.25,-12.25 7.31777,0 13.25,5.48451 13.25,12.25 z","m 101,116 c -1.05428,15.09255 -21.092549,-4.94572 -6,-6 3.19473,-0.0963 6.09624,2.80529 6,6 z","m 86,129 c 19.89829,9.52145 44.65017,10.4023 64,-1","m 246.84146,191.02436 c -0.46247,22.7555 -44.40535,48.58471 -62.33816,54.48631 -37.89852,12.69594 -75.98258,9.52536 -111.081256,0.49967 C 34.838557,237.26932 -1.3059135,224.51467 6.1315782,180.89726 9.9943253,159.74281 35.540356,142.83147 41.528696,124.84004 49.966904,47.770077 79.053663,29.108667 117.65013,27.392656 c 69.00411,4.108983 72.46419,44.828137 83.19432,103.257604 6.32161,24.06101 46.03125,36.87428 45.99701,60.3741 z",,,"m 241,227 c 1.79299,21.60726 -25.90914,39.22267 -44.11481,26.18477 -20.59149,-12.20499 -17.33458,-48.40206 6.15003,-55.38342 C 221.20403,191.26498 242.30351,207.96876 241,227 z","m 70.000002,228.5 c 1.79299,21.60726 -25.90915,39.22267 -44.114818,26.18477 C 5.293689,242.47978 8.550613,206.28271 32.035226,199.30135 50.204032,192.76498 71.303512,209.46876 70.000002,228.5 z","m 192.0807,215.5 c 8.02401,17.85879 15.69367,-16.2473 0.6192,-2.50489 -0.49989,0.75353 -0.47854,1.64857 -0.6192,2.50489 z","m 207,209 c 3.57266,18.09866 26.05533,-8.31831 5.71091,-6.31174 C 209.76305,203.31659 206.92094,205.77872 207,209 z","m 222,219.5 c 1.05428,15.09255 21.09255,-4.94572 6,-6 -3.19473,-0.0963 -6.09624,2.80529 -6,6 z","m 30,223 c -1.054283,15.09255 -21.092551,-4.94572 -6,-6 3.194731,-0.0963 6.096241,2.80528 6,6 z","m 45.000002,212.5 c -3.57266,18.09866 -26.055328,-8.31831 -5.710909,-6.31174 2.947859,0.62833 5.789969,3.09046 5.710909,6.31174 z","m 59.919292,219 c -8.02519,17.85899 -15.69245,-16.24875 -0.61881,-2.50403 0.5,0.75315 0.47787,1.64814 0.61881,2.50403 z","m 197,236.5 c -1.96694,14.63452 20.01881,19.2634 27.16224,7.94616 8.13889,-12.12921 -7.27764,-29.10072 -19.83846,-20.83617 -4.55935,2.5143 -7.80158,7.58607 -7.32378,12.89001 z","m 55.000002,240 c 1.96694,14.63452 -20.018805,19.2634 -27.162238,7.94616 -8.138893,-12.12921 7.277632,-29.10072 19.838458,-20.83617 4.55935,2.5143 7.80158,7.58607 7.32378,12.89001 z","m 127.75,135.75 c 4.08333,3.58333 8.16667,7.16667 12.25,10.75 0.13448,-4.764 1.0062,-16.31587 -0.0474,-13.4052 -0.30748,0.84944 -4.23792,1.90381 -12.20263,2.6552 z","m 95.25,132.75 c 1.5,5.25 2.75,10 4.25,15.25 2.91667,-4.08333 5.83333,-8.16667 8.75,-12.25 -4.41667,-1.16667 -8.58333,-1.83333 -13,-3 z","m 156.6114,39.410268 c 13.91819,1.069459 20.65316,-13.723082 23.54998,-25.062224 2.74115,-16.934616 14.22712,7.12987 11.99266,14.830046 3.57222,13.377546 -4.94587,36.136809 -21.87527,28.787139 -6.19122,-4.618542 -12.54973,-10.457947 -13.66737,-18.554961 z","M 85.895071,36.156536 C 72.160973,38.653413 63.938678,24.632964 59.889712,13.652366 55.419438,-2.909998 46.47232,22.209244 49.487765,29.638423 47.311971,43.312684 58.12822,65.073906 74.210872,56.020149 79.891408,50.792698 85.619042,44.320748 85.895071,36.156536 z","m 170.50942,34.403138 c 3.51216,7.980573 13.45685,9.818493 21.2132,8.48528","m 176.87338,24.150078 c 3.88529,3.769897 10.40024,5.785508 15.20278,2.47487","M 70.663332,31.508682 C 67.991568,39.808471 58.288975,42.660585 50.436577,42.133099","m 63.277481,21.96539 c -3.47647,4.149917 -9.749259,6.825626 -14.867158,4.027085"'
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
