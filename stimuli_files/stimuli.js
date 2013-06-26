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

//-----------BRANCHES-----------//

branchPathStrings = ["M 90,169 c 0.0395,-3.1759 -0.22367,-6.37223 -0.99918,-9.45866 -1.16291,-4.74366 -3.74868,-9.48771 -8.17769,-11.87476 -3.61429,-2.07586 -8.57248,-1.69835 -11.61121,1.23872 -2.70574,2.33842 -3.52103,6.51405 -1.931,9.70825 1.17105,2.63704 4.30151,4.34931 7.12961,3.48482 3.00313,-0.76541 4.59076,-4.67346 2.91403,-7.29005 -0.90076,-1.66575 -3.41363,-2.21033 -4.79501,-0.83734 -1.17571,1.02987 -0.98718,3.49137 0.72481,3.80204 1.46048,0.76394 1.85916,-2.5103 0.39624,-1.58311", //small lower branch

"M 86,116 c -9,-12 -32,-13 -44,-6 -4,3 -11,0 -16,-2 -3,-2 -6,-5 -7,-9 0,-4 2,-8 6,-9 2,-1 5,0 7,2 2,2 2,6 0,8 -1,2 -4,2 -6,0 -1,-1 -1,-4 0,-5 1,-1 3,0 3,1 1,1 -2,2 -1,1", //upper tendril off of lower left branch

"M 86,116 c -11,-12 -27,-14 -40,-8 -5,2 -10,6 -13,11 -7,11 -9,24 -8,37 1,9 8,17 17,17 8,0 16,-7 16,-15 1,-7 -5,-15 -13,-15 -7,0 -12,6 -11,13 1,5 6,9 11,8 4,-1 7,-7 4,-11 -2,-4 -9,-2 -8,2 0,3 6,3 4,0", //main part of lower left branch

"M 87,117 c -2.55138,-3.33639 -5.67275,-6.52771 -9.83607,-7.70449 -7.79502,-2.61856 -17.41016,-0.43026 -22.40934,6.34841 -4.46144,5.9865 -4.71823,15.05193 0.12416,20.8948 2.76179,3.36169 7.50294,5.20102 11.74225,3.81186 4.25784,-1.23905 7.3797,-5.82055 6.40543,-10.24894 -0.46338,-2.84314 -2.97182,-5.62048 -6.04136,-5.23503 -2.18208,0.26003 -4.02985,2.54874 -3.28703,4.74351 0.2565,1.33846 2.78559,2.13779 2.99604,0.33108", //lower tendril off of lower left branch

"M 94,98 c 1,-12 -2,-24 -10,-33 -9,-9 -23,-12 -35,-9 -5,1 -10,4 -15,7 -3,4 -4,10 0,14 5,5 15,3 18,-4 1,-3 -1,-7 -5,-8 -3,0 -7,2 -6,6 0,4 7,2 5,-1 0,-1 -3,0 -1,1", //tendril #2 of upper left branch

"M 94,98 c -0.32315,-2.29198 -1.05103,-4.51141 -1.98419,-6.62382 -3.53977,-7.7469 -9.81435,-14.67194 -18.02888,-17.47187 -5.97707,-2.08036 -12.71809,-0.88613 -17.99446,2.46062 -4.18373,2.40759 -7.88191,6.67577 -7.81161,11.73179 0.0196,5.22164 4.98767,9.74809 10.19382,9.2739 4.46246,-0.21564 8.27405,-4.6236 7.47366,-9.09197 -0.48115,-3.86864 -4.93606,-6.75622 -8.60978,-5.17294 -2.9618,1.0852 -4.44126,5.24348 -2.25698,7.71599 1.55026,2.06374 5.29153,1.9569 6.27982,-0.58799 0.90714,-1.72849 -0.66258,-4.16174 -2.65301,-3.70366 -2.09297,0.12739 -1.6897,3.91018 0.38121,2.9003", //tendril #1 of upper left branch

"M 94,98 c 1.6251,-24.35797 -15.46007,-44.52725 -9.50413,-53.05614 1.43292,-2.05194 4.12291,-3.48954 8.03644,-3.31388 4.05009,0.18179 6.69128,5.41411 5.58152,9.36706 -0.81491,2.90264 -3.86462,4.88693 -6.91231,3.7844 -2.16417,-0.7829 -3.75853,-3.18733 -3.0309,-5.41527 0.49563,-1.51757 2.15898,-2.55757 3.76943,-1.88322 1.04028,0.4356 1.81185,1.65171 1.3774,2.7274 -0.26168,0.64787 -1.02964,1.09726 -1.72756,0.73307 -0.3818,-0.19921 -0.67268,-0.69524 -0.4507,-1.09034 0.10544,-0.18769 0.37272,-0.32497 0.57802,-0.16789", //tendril #3 of upper left branch

"M 94,98 c -0.68479,-14.53425 0.60369,-35.23189 12.61452,-43.7333 3.67904,-2.60407 10.55501,-5.99886 16.68335,-4.67801 8.34547,1.7987 14.50813,8.24726 12.7891,16.92347 -1.30847,6.60407 -7.7217,11.91414 -14.59053,10.63644 -5.07553,-0.94411 -9.04959,-5.77294 -7.80793,-11.03258 0.88427,-3.74579 4.63981,-6.76296 8.5622,-5.84599 2.66509,0.62304 4.76114,3.27469 3.92645,6.06687 -0.53301,1.78301 -2.43046,3.2333 -4.31516,2.63134 -1.10477,-0.35286 -1.9918,-1.55808 -1.494,-2.73408 0.25737,-0.60798 1.00345,-1.12574 1.65151,-0.79045", //tendril #4 of upper left branch

"M 107,106 c 5,-8 13,-16 23,-19 17,-6 37,2 44,18 4,8 3,19 -2,26 -3,5 -10,7 -16,4 -6,-2 -11,-9 -9,-15 1,-5 8,-9 13,-6 4,2 7,8 3,11 -3,3 -8,1 -8,-3 -1,-4 6,-3 4,0", //upper tendril of upper right branch

"M 107,106 c 1.67249,-4.91971 5.9244,-8.30583 9.89115,-11.37704 5.89977,-4.32434 12.49704,-7.93546 19.68115,-9.53505 2.03896,-0.37012 3.95343,0.56142 5.9719,0.57424 5.69615,0.69692 11.1903,4.56172 12.77767,10.23967 1.33853,4.33871 -0.0261,9.93808 -4.35269,12.03532 -3.18915,1.5523 -7.54224,0.25583 -8.97387,-3.09911 -1.47535,-2.88294 -0.26612,-7.20473 3.14269,-7.9781 2.53244,-0.70715 5.20252,1.94633 4.40228,4.49036 -0.3336,2.40003 -4.61134,2.20395 -4.02934,-0.37842 0.32045,-0.81053 2.03084,-0.98572 1.47165,0.23412", //lower tendril of upper right branch

"M 111,133 c 22,-19 40,-3 40,20 -2,11 -11,20 -22,18 -8,-1 -15,-10 -13,-19 1,-7 8,-13 14,-11 5,1 9,6 8,12 -1,4 -5,7 -8,6 -2,-1 -4,-3 -3,-6 1,-1 2,-3 4,-2"
];

function myDrawPath(pathString) {
  myPath = paper.path(pathString);
  myPath.attr("stroke", strokeColor);
  myPath.attr("stroke-width", strokeWidth); 
}

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
                       [50,106,"left"], [70,124,"right"], [122, 124,"right"],
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
