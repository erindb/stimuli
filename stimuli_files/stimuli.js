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
branchPathStrings = ["M 128.63012,942.51529 C 129.81493,941.46444 129.9911,944.38369 128.52624,944.11038 126.90143,944.18126 126.31858,942.02874 127.0962,940.85337 128.00842,939.16393 130.55392,939.11688 131.77905,940.47815 133.92684,942.64937 133.03758,946.6645 130.37503,948.00418 127.8378,949.42914 124.47687,948.35428 122.89989,946.00226 120.66427,942.91708 121.06141,938.28197 123.80444,935.62758 126.47234,932.70513 130.97723,931.91479 134.58136,933.42638 139.07103,935.20733 141.98617,939.51621 143.43,943.9647 144.63253,947.61774 145.02759,951.49395 144.97952,955.32538", //small lower branch
"M 46,108 c -6,2 -13,2 -18,-1 -3,-2 -6,-5 -7,-9 0,-4 2,-8 6,-9 2,-1 5,0 7,2 2,2 2,6 0,8 -1,2 -4,2 -6,0 -1,-1 -1,-4 0,-5 1,-1 3,0 3,1 1,1 -2,2 -1,1", //upper tendril off of lower left branch

"M 86,116 c -11,-12 -27,-14 " + "-40,-8"//where upper tendril attaches
+ " -5,2 -10,6 -13,11 -7,11 -9,24 -8,37 1,9 8,17 17,17 8,0 16,-7 16,-15 1,-7 -5,-15 -13,-15 -7,0 -12,6 -11,13 1,5 6,9 11,8 4,-1 7,-7 4,-11 -2,-4 -9,-2 -8,2 0,3 6,3 4,0", //main part of lower left branch

"M 87,117 c -2.55138,-3.33639 -5.67275,-6.52771 -9.83607,-7.70449 -7.79502,-2.61856 -17.41016,-0.43026 -22.40934,6.34841 -4.46144,5.9865 -4.71823,15.05193 0.12416,20.8948 2.76179,3.36169 7.50294,5.20102 11.74225,3.81186 4.25784,-1.23905 7.3797,-5.82055 6.40543,-10.24894 -0.46338,-2.84314 -2.97182,-5.62048 -6.04136,-5.23503 -2.18208,0.26003 -4.02985,2.54874 -3.28703,4.74351 0.2565,1.33846 2.78559,2.13779 2.99604,0.33108", //lower tendril off of lower left branch
"M 94,97 c -1.9639,-21.8568 -29.70748,-58.26188 -63.38505,-36.93194 -8.25365,5.22751 -13.74295,14.74908 -9.54907,23.85591 3.42259,7.43199 12.43145,11.46939 20.04523,7.89078 6.12594,-2.87929 9.4489,-10.35788 6.42583,-16.6427 -2.39293,-4.9748 -8.51708,-7.66901 -13.62908,-5.14425 -3.97038,1.96094 -6.11698,6.89748 -4.03588,10.98468 1.58071,3.10446 5.48728,4.77976 8.68937,3.09026 2.36828,-1.24956 3.64395,-4.27436 2.29668,-6.7225 -0.96479,-1.75314 -3.24629,-2.69573 -5.06285,-1.64406 -1.24989,0.7236 -1.92085,2.39025 -1.12095,3.68856 0.52313,0.84908 1.69302,1.30451 2.57701,0.71544", //tendril #1 of upper left branch
"M 94,97 c -0.32315,-2.29198 -1.05103,-4.51141 -1.98419,-6.62382 -3.53977,-7.7469 -9.81435,-14.67194 -18.02888,-17.47187 -5.97707,-2.08036 -12.71809,-0.88613 -17.99446,2.46062 -4.18373,2.40759 -7.88191,6.67577 -7.81161,11.73179 0.0196,5.22164 4.98767,9.74809 10.19382,9.2739 4.46246,-0.21564 8.27405,-4.6236 7.47366,-9.09197 -0.48115,-3.86864 -4.93606,-6.75622 -8.60978,-5.17294 -2.9618,1.0852 -4.44126,5.24348 -2.25698,7.71599 1.55026,2.06374 5.29153,1.9569 6.27982,-0.58799 0.90714,-1.72849 -0.66258,-4.16174 -2.65301,-3.70366 -2.09297,0.12739 -1.6897,3.91018 0.38121,2.9003", //tendril #2 of upper left branch
"M 94,97 c 1.6251,-24.35797 -15.46007,-44.52725 -9.50413,-53.05614 1.43292,-2.05194 4.12291,-3.48954 8.03644,-3.31388 4.05009,0.18179 6.69128,5.41411 5.58152,9.36706 -0.81491,2.90264 -3.86462,4.88693 -6.91231,3.7844 -2.16417,-0.7829 -3.75853,-3.18733 -3.0309,-5.41527 0.49563,-1.51757 2.15898,-2.55757 3.76943,-1.88322 1.04028,0.4356 1.81185,1.65171 1.3774,2.7274 -0.26168,0.64787 -1.02964,1.09726 -1.72756,0.73307 -0.3818,-0.19921 -0.67268,-0.69524 -0.4507,-1.09034 0.10544,-0.18769 0.37272,-0.32497 0.57802,-0.16789", //tendril #3 of upper left branch
"M 94,97 c -0.68479,-14.53425 0.60369,-35.23189 12.61452,-43.7333 3.67904,-2.60407 10.55501,-5.99886 16.68335,-4.67801 8.34547,1.7987 14.50813,8.24726 12.7891,16.92347 -1.30847,6.60407 -7.7217,11.91414 -14.59053,10.63644 -5.07553,-0.94411 -9.04959,-5.77294 -7.80793,-11.03258 0.88427,-3.74579 4.63981,-6.76296 8.5622,-5.84599 2.66509,0.62304 4.76114,3.27469 3.92645,6.06687 -0.53301,1.78301 -2.43046,3.2333 -4.31516,2.63134 -1.10477,-0.35286 -1.9918,-1.55808 -1.494,-2.73408 0.25737,-0.60798 1.00345,-1.12574 1.65151,-0.79045", //tendril #4 of upper left branch
"m 162.56069,887.64935 c 5.4282,-8.35303 13.25398,-15.50935 22.87104,-18.59104 16.52253,-5.56904 36.60276,2.32762 44.36492,18.05891 4.26927,8.32539 3.27235,18.8667 -2.21719,26.38251 -3.43929,4.80103 -10.09368,6.67638 -15.5625,4.47173 -6.14462,-2.03821 -10.52143,-8.95674 -8.59783,-15.35991 1.24992,-5.3732 7.63532,-8.74925 12.71298,-6.44038 4.44997,1.60001 6.55144,8.12256 2.79578,11.47373 -2.50983,2.58611 -8.01716,1.08249 -7.78175,-2.87338 -0.6216,-3.70583 6.34815,-2.85412 3.6753,0.0185", //upper tendril of upper right branch
"m 186.05914,868.87973 c 2.76208,-0.87186 5.64839,-1.4183 8.55216,-1.4006 4.97494,-0.0334 10.13252,1.97294 13.15763,6.04813 2.9041,3.74668 3.76563,9.35068 1.10372,13.45682 -1.65667,2.81755 -5.31494,4.32422 -8.43509,3.21887 -3.39592,-1.06864 -5.34779,-5.24158 -3.9236,-8.52092 0.8392,-2.22208 3.62791,-3.65781 5.83564,-2.52875 2.0259,0.91345 2.73219,4.10191 0.86381,5.51812 -1.08907,0.9452 -3.1402,0.2306 -3.02366,-1.33337 -0.31346,-1.33957 2.24582,-1.42383 1.4568,-0.16043" //lower tendril of upper right branch
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
var berryPositions = [ [25,63,"left"], [63,55,"left"], [95,41,"right"],
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
