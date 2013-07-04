

var ErinTools = {
  shuffle: function(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;}, // non-destructive.

  ColorRandomizer: function(nSteps) {
    if (nSteps==null) {var nSteps=10}
    this.get = get;
    
    function hues(n) {
      var h = [];
      for (i=0;i<n-1;i++) {
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
  
  lighten: function(origColor) {
    var eps = 0.3;
    var c = Raphael.color(origColor);
    if (c.v + eps < 1) {
      var value = c.v + eps;
    } else {
      var value = 1;
    }
    var newColor = Raphael.hsb2rgb(c.h, c.s, value);
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
      var angle = Math.random() * 360;
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
    var baseHeadStretch = Math.random();
    var baseBodyStretch = Math.random();
    this.baseColor = baseColor;
    this.baseHeadStretch = baseHeadStretch;
    this.baseBodyStretch = baseBodyStretch;
    this.draw = draw;
    function drawHead(paper, color, crest, gradColor) {
      var headCenter = [paperCenter[0], paperCenter[1]-35];
      var headStretch = ErinTools.uniformAroundMean(baseHeadStretch, 0.1) * 2 + .7;
      var head = paper.ellipse(headCenter[0], headCenter[1], 25*headStretch, 25);
      head.attr("fill", gradColor);
      Stimuli.stroke(head);
      if (crest) {
        var crest = paper.path("M "+headCenter[0].toString()+","+(headCenter[1]-16).toString()+" c -3,-13 -3,-27 -2,-41 0,-5 0,-10 2,-15 2,1 2,6 2,9 1,14 2,29 2,44 1,-14 1,-29 5,-43 0,-2 3,-7 4,-2 1,10 0,20 -1,30 -1,5 -1,10 -2,14 3,-11 5,-23 8,-33 1,-3 2,-2 2,1 0,12 -2,24 -4,36 0,1 1,-3 1,-5 2,-9 4,-18 7,-27 3,-4 2,4 2,6 -1,10 -4,20 -7,30 2,-9 5,-18 9,-26 1,-3 4,-2 3,1 -1,10 -5,19 -9,28 -1,2 -1,2 0,0 2,-5 5,-11 9,-15 3,-1 0,5 0,7 -2,5 -5,10 -8,15 3,-4 6,-8 10,-10 3,1 -1,6 -2,7 -1,2 -5,6 -5,6 4,0 8,-2 12,-1 0,3 -5,4 -7,5 -2,1 -6,3 -7,2 4,1 9,2 12,5 -1,3 -6,1 -8,1 -2,0 -5,-1 -5,-2 3,2 7,3 9,7 -2,2 -7,0 -10,0 -2,-1 -5,-1 -2,-3 3,-4 4,-9 4,-14 -1,-7 -5,-14 -11,-18 -4,-3 -9,-1 -12,2 -2,1 -3,6 -4,5 -5,-10 -8,-21 -8,-32 -1,-3 2,-6 4,-2 4,8 5,17 7,26 0,1 0,3 1,4 z");
        crest.attr("fill", color);
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
    function drawBody(paper, color, tail, gradColor) {
      var bodyStretch = ErinTools.uniformAroundMean(baseBodyStretch, 0.1) * 1 + 0.5;
      if (tail) {
        var tail = paper.path("m "+(paperCenter[0]+40).toString()+","+(paperCenter[1]+30*(bodyStretch)).toString()+" c  93.041702,66.6439 62.708612,55.1315 0.566359,6.6972 24.219543,16.1729 127.541683,98.4836 -2.315079,6.5466 70.203552,48.3289 71.370392,57.77 -4.801623,3.2366 31.342565,20.6587 80.305665,60.7674 -7.288272,-0.073 60.818577,41.2828 21.46453,21.8232 -8.136197,-2.2717 z");
        tail.attr("fill", color);
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
    }
    function draw(label, crest, tail, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(baseColor);
      var gradColor = Stimuli.makeGradient("r",color);
      drawBody(paper, color, tail, gradColor);
      var headStretch = drawHead(paper, color, crest, gradColor);
      var svgContainer = document.getElementById(label);
      svgContainer.setAttribute("width", (scaleFactor*Stimuli.containerWidth).toString() + "px");
      svgContainer.setAttribute("height", (scaleFactor*Stimuli.containerHeight).toString() + "px");
      svgContainer.setAttribute("viewBox", "0 0 " + Stimuli.containerWidth.toString() + " " + Stimuli.containerHeight.toString());
      return {
        color: color,
        headStretch: headStretch,
        label: label,
        crest: crest,
        tail: tail
      };
    }
  },
  
  Microbe: function() {
    var paperCenter = [(Stimuli.containerWidth/2), (Stimuli.containerHeight/2)];
    var baseColor = Stimuli.colorScheme.get();
    var baseAccentColor = Stimuli.colorScheme.get();
    this.baseColor = baseColor;
    this.baseAccentColor = baseAccentColor;
    this.baseXRad = baseXRad;
    var baseXRad = Math.random();
    this.baseYRad = baseYRad;
    var baseYRad = Math.random();
    this.draw = draw;
    function draw(label, spikes, bumps, scaleFactor) {
      var paper = Raphael(label, Stimuli.containerWidth, Stimuli.containerHeight);
      var color = Stimuli.myColor(baseColor);
      var accentColor = Stimuli.myColor(baseAccentColor);
      var xRadius = ErinTools.uniformAroundMean(baseXRad, 0.1);
      var yRadius = ErinTools.uniformAroundMean(baseYRad, 0.1);
      var xRad = getRadius(xRadius);
      var yRad = getRadius(yRadius);
      function getRadius(r) {
        var minRad = 50;
        var maxRad = 75;
        return (r*(maxRad-minRad))+minRad;
      }
      function drawMicrobe() {
        var microbe = paper.ellipse(paperCenter[0], paperCenter[1],
                                    xRad, yRad);
        microbe.attr("fill", Stimuli.makeGradient("r",color));
        Stimuli.stroke(microbe);
        var c1 = Stimuli.lighten(accentColor);
        var c2 = Stimuli.darken(accentColor);
        function drawBlob(pos) {
          var xPos = pos[0];
          var yPos = pos[1];
          var path = pos[2];
          var innerBlob = pos[3];
          var blob = paper.path("M "+xPos+","+yPos+path);
          blob.attr("fill", c1);
          blob.attr("stroke", c1);
          if (innerBlob) {
            var innerBlob = paper.path("M "+xPos+","+yPos+path);
            innerBlob.transform("s0.7");
            innerBlob.attr("fill", c2);
            innerBlob.attr("stroke", c2);
          }
        }
        var blobs = [ [(paperCenter[0]-(xRad*0.5)).toString(),
                     (paperCenter[1]-(yRad*0.6)).toString(),
                     " c -16.35345,2.36071 -13.80528,9.48045 -9.87547,13.67374 17.36804,15.37965 16.34772,7.7738 18.23164,3.79826 3.81829,-15.55565 19.52862,-20.65425 -8.35617,-17.472 z",
                   true],
                    [(paperCenter[0]+(xRad*0.35)).toString(),
                     (paperCenter[1]+(yRad*0.1)).toString(),
                     " c -8.4037,4.30166 -15.63981,11.53231 -12.15445,15.57287 17.36807,15.37964 18.43678,3.59571 20.3207,-0.37982 0.92151,-3.75422 12.60105,-6.32959 14.12788,-8.89624 4.79965,-8.06835 -1.13906,-8.71107 -22.29413,-6.29681 z",
                     true],
                    [(paperCenter[0]+(xRad*0.3)).toString(),
                     (paperCenter[1]-(yRad*0.4)).toString(),
                     " c -14.84341,3.35478 -4.31549,8.33402 2.88477,7.75081 9.08515,2.49067 13.57482,-19.81467 -2.88477,-7.75081 z",
                     false] ];
        blobs.map(drawBlob);
        var spots = [ [0, -6, 1, "light"],
                      [4, 0, 2, "light"],
                      [7, 5, 1, "light"],
                      [3, 9, 1, "light"],
                      [2, 5, 1, "dark"],
                      [-4, -4, 1, "dark"],
                      [-4, 4, 2, "dark"],
                      [-8, -2, 1, "dark"] ];
        var spotsCenter = [paperCenter[0]-(xRad*0.3), paperCenter[1]+(yRad*0.4)];
        function drawSpots(pos) {
          var xPos = (spotsCenter[0] + (pos[0]*xRad/30)).toString();
          var yPos = (spotsCenter[1] + (pos[1]*yRad/35)).toString();
          var size = pos[2];
          if (pos[3] == "light") {
            var c = c1;
          } else {
            var c = c2;
          }
          var spot = paper.circle(xPos, yPos, size);
          spot.attr("fill", c);
          spot.attr("stroke", c);
        }
        spots.map(drawSpots);
      }
      function drawSpikes() {
      }
      function drawBumps() {
      }
      drawMicrobe();
      if (spikes) {drawSpikes};
      if (bumps) {drawBumps};
      Stimuli.viewBox(label, scaleFactor);
      return {
        color: color,
        accentColor: accentColor,
        xRadius: xRadius, //a number from 0 to 1
        yRadius: yRadius, //0 means min, 1 means max
        label: label,
        spikes: spikes,
        bumps: bumps
      };
    }
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
