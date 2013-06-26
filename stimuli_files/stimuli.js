// Creates canvas 320 × 200 at 10, 50
var paper = Raphael(0, 0, 181, 206);
var strokeWidth = 2;
var strokeColor = "#000000";

var color = new RColor;

/*lol i don't actually know how to sample a beta using a sample from uniform...
should figure that out*/
function no1beta(a, b) {
  unif = Math.random();
  sample = Math.sin(unif*Math.PI/2)^2;
  if (sample < 1) {return sample} else {return 0.99}
}

function myDrawPath(pathString) {
  myPath = paper.path(pathString);
  myPath.attr("stroke", strokeColor);
  myPath.attr("stroke-width", strokeWidth); 
}

//-----------BRANCHES-----------//

branchPathStrings = ["M 90,172 c 0,-3 0,-6 -1,-9 -1,-5 -4,-9 -8,-12 -4,-2 -9,-2 -12,1 -3,2 -4,7 -2,10 1,3 4,4 7,3 3,-1 5,-5 3,-7 -1,-2 -3,-2 -5,-1 -1,1 -1,3 1,4 1,1 2,-3 0,-2", //small lower branch
"M 86,116 c -9,-12 -32,-13 -44,-6 -4,3 -11,0 -16,-2 -3,-2 -6,-5 -7,-9 0,-4 2,-8 6,-9 2,-1 5,0 7,2 2,2 2,6 0,8 -1,2 -4,2 -6,0 -1,-1 -1,-4 0,-5 1,-1 3,0 3,1 1,1 -2,2 -1,1", //upper tendril off of lower left branch
"M 86,116 c -11,-12 -27,-14 -40,-8 -5,2 -10,6 -13,11 -7,11 -9,24 -8,37 1,9 8,17 17,17 8,0 16,-7 16,-15 1,-7 -5,-15 -13,-15 -7,0 -12,6 -11,13 1,5 6,9 11,8 4,-1 7,-7 4,-11 -2,-4 -9,-2 -8,2 0,3 6,3 4,0", //main part of lower left branch
"M 87,117 c -3,-3 -6,-7 -10,-8 -8,-3 -17,0 -22,6 -4,6 -5,15 0,21 3,3 8,5 12,4 4,-1 7,-6 6,-10 0,-3 -3,-6 -6,-5 -2,0 -4,3 -3,5 0,1 3,2 3,0", //lower tendril off of lower left branch
"M 94,98 c 1,-12 -2,-24 -10,-33 -9,-9 -23,-12 -35,-9 -5,1 -10,4 -15,7 -3,4 -4,10 0,14 5,5 15,3 18,-4 1,-3 -1,-7 -5,-8 -3,0 -7,2 -6,6 0,4 7,2 5,-1 0,-1 -3,0 -1,1", //tendril #2 of upper left branch
"M 94,98 c 0,-2 -1,-5 -2,-7 -4,-8 -10,-15 -18,-17 -6,-2 -13,-1 -18,2 -4,2 -8,7 -8,12 0,5 5,10 10,9 4,0 8,-5 7,-9 0,-4 -5,-7 -9,-5 -3,1 -4,5 -2,8 2,2 5,2 6,-1 1,-2 -1,-4 -3,-4 -2,0 -2,4 0,3", //tendril #1 of upper left branch
"M 94,98 c 2,-24 -15,-45 -10,-53 1,-2 4,-3 8,-3 4,0 7,5 6,9 -1,3 -4,5 -7,4 -2,-1 -4,-3 -3,-5 0,-2 2,-3 4,-2 1,0 2,2 1,3 0,1 -1,1 -2,1 0,0 -1,-1 0,-1 0,0 0,0 1,0", //tendril #3 of upper left branch
"M 94,98 c -1,-15 1,-35 13,-44 4,-3 11,-6 17,-5 8,2 15,8 13,17 -1,7 -8,12 -15,11 -5,-1 -9,-6 -8,-11 1,-4 5,-7 9,-6 3,1 5,3 4,6 -1,2 -2,3 -4,3 -1,0 -2,-2 -1,-3 0,-1 1,-1 2,-1", //tendril #4 of upper left branch
"M 107,106 c 5,-8 13,-16 23,-19 17,-6 37,2 44,18 4,8 3,19 -2,26 -3,5 -10,7 -16,4 -6,-2 -11,-9 -9,-15 1,-5 8,-9 13,-6 4,2 7,8 3,11 -3,3 -8,1 -8,-3 -1,-4 6,-3 4,0", //upper tendril of upper right branch
"M 107,106 c 2,-5 6,-8 10,-11 6,-4 12,-8 20,-10 2,0 4,1 6,1 6,1 11,5 13,10 1,4 0,10 -4,12 -3,2 -8,0 -9,-3 -1,-3 0,-7 3,-8 3,-1 5,2 4,4 0,2 -5,2 -4,0 0,-1 2,-1 1,0", //lower tendril of upper right branch
"M 111,133 c 22,-19 40,-3 40,20 -2,11 -11,20 -22,18 -8,-1 -15,-10 -13,-19 1,-7 8,-13 14,-11 5,1 9,6 8,12 -1,4 -5,7 -8,6 -2,-1 -4,-3 -3,-6 1,-1 2,-3 4,-2" //lower right branch
];

branchPathStrings.map(myDrawPath);


//-----------LEAVES-------------//
/*xposition and yposition of where leaf stem attaches to branch, angle leaves
lean, direction leaves are curving towards ("clock" or "counter")*/ 
var leavesPositions = [150, 138, "counter"];

//-----------TRUNK--------------//

//var trunkGradient = "0-#fff-"+color.get(true, no1beta(0,5), no1beta(5,10));
var trunkGradient = "0-#fff-"+color.get(true, .99, .5);
/*trunk = paper.path("M 76 206 c 24 -39 20 -79 11 -89," +
                       "10 11 7 -26 7 -19, 2 39 14 2 14 6," +
                       "1 6 -12 39 4 28, -7 34 -4 60 15 74 Z");*/
trunk = paper.path("M 76,206 C 89,185 96,159 93,134 92,128 90,122 " +
                   "87,117" + //lower left branch attaches here
                   " 90,122 94,114 93,110 94,107 94,100 " +
                   "94,98" + //upper left branch attaches here
                   " 94,104 94,110 96,115 101,117 104,112 105,109 106,108 108,101 " +
                   "107,106" + //upper right branch attaches here
                   " 105,115 103,123 103,132 104,137 111,132 " +
                   "111,133" + //lower right branch attaches here
                   " 108,151 106,171 113,189 116,196 121,202 127,206 110,206 93,206 76,206 z");



trunk.attr("fill", trunkGradient);
trunk.attr("stroke-width", strokeWidth);

//------------BERRIES------------//

/*xposition and yposition of upper left-hand corner, direction berries "fall":
either out to the left or out to the right.*/
var berryPositions = [ [31,67,"left"], [63,54,"left"], [95,41,"right"],
                       [96,71,"right"], [137,58,"right"], [162,88,"right"],
                       [50,106,"left"], [70,124,"right"], [123, 124,"right"],
                       [34,152,"left"], [152,150,"right"] ];
function drawBerries(positions) {
  //var berryColor = "#fffc5b";
  //var berryColor = color.get(true, no1beta(0,5), no1beta(0,20));
  var berryColor = color.get(true, .5, .99);
  var berryRadius = 4.5;
  /* drawBerryClump takes in the position where the stem connects to the
  branch and draws two joined berries there */
  function drawBerryClump(pos) {
    // drawBerry draws one berry as a circle with center at x,y
    function drawBerry(p) {
      var berry = paper.circle(p[0], p[1], berryRadius);
      berry.attr("fill", berryColor);
      berry.attr("stroke", strokeColor);
      berry.attr("stroke-width", strokeWidth);   
    }
    xpos = pos[0];
    ypos = pos[1];
    direction = pos[2];
    if (direction == "right") {
      rightBerryPos = [xpos+13, ypos+14];
      leftBerryPos = [xpos+1, ypos+19];
      stemXPos = (xpos+12).toString();
      stemYPos = (ypos+10).toString();
      var stem = paper.path("M" + stemXPos + " " + stemYPos +
                            "c -0.3 -7 -6 -7 -11 -8, 2 4 4 8 -1 13");
    } else {
      rightBerryPos = [xpos-13, ypos+14];
      leftBerryPos = [xpos-1, ypos+19];
      stemXPos = (xpos-12).toString();
      stemYPos = (ypos+10).toString();
      var stem = paper.path("M" + stemXPos + " " + stemYPos +
                            "c 0.3 -7 6 -7 11 -8, -2 4 -4 8 1 13");
    }
    stem.attr("stroke", strokeColor);
    stem.attr("stroke-width", strokeWidth); 
    drawBerry(rightBerryPos);
    drawBerry(leftBerryPos);
  }
  positions.map(drawBerryClump);
}
drawBerries(berryPositions);

/* a python script i'm using to manipulate svg path strings:

def manipulate(s, xmanip=0, ymanip=0):
  new_pairs = []
  pairs = s.split(" ")
  for pair in pairs:
    x, y = pair.split(",")
    new_x = str(int(round(float(x) + xmanip)))
    new_y = str(int(round(float(y) + ymanip)))
    new_pair = ",".join([new_x, new_y])
    new_pairs.append(new_pair)
  print " ".join(new_pairs)

*/
