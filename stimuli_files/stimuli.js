// Creates canvas 320 × 200 at 10, 50
var paper = Raphael("holder", 250, 250);
var strokeWidth = 2;
var strokeColor = "#000000";

var r = Raphael("holder", 20, 20);
r.circle(100,100,100);

var color = new RColor;

/*lol i don't actually know how to sample a beta using a sample from uniform...
should figure that out INVERSE TRANSFORM SAMPLING*/
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

function Tree(label) {
  this.drawTrunk = drawTrunk;
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
  var origTrunkY = [249, 240, 230, 220, 206, 191, 177, 171, 165, 160, 165, 157,
                    153, 150, 143, 141, 147, 153, 158, 160, 155, 152, 151, 144,
                    149, 158, 166, 175, 180, 175, 176, 194, 214, 232, 239, 245,
                    249, 249, 249, 249];
  var xCenter = (origTrunkX[locs["bottom left"]] +
                 origTrunkX[locs["bottom right"]])/2;
  var widthFactor = Math.random()*1.5 + 0.7; //gaussian better?
  var heightFactor = Math.random() + 0.7; //gaussian better?
  function randWidth(x) {
    return (xCenter + (x-xCenter)*widthFactor).toString();
  }
  function randHeight(y) {
    lowest = origTrunkY[locs["bottom left"]];
    return lowest + heightFactor * (y - lowest);
  }
  trunkX = origTrunkX.map(randWidth);
  trunkY = origTrunkY.map(randHeight);

  //-----------TRUNK--------------//
  function drawTrunk() {
    //var trunkGradient = "0-#fff-"+color.get(true, no1beta(0,5), no1beta(5,10));
    var trunkGradient = "0-#fff-"+color.get(true, .99, .5);
    trunkPath = "M " + trunkX[0] + "," + trunkY[0] + " C";
    for (i=1; i < trunkX.length; i++) {
      trunkPath += (" " + trunkX[i] + "," + trunkY[i]);
    }
    trunkPath += " z";
    trunk = paper.path(trunkPath);
    trunk.attr("fill", trunkGradient);
    trunk.attr("stroke-width", strokeWidth);
  }
}

var fep = new Tree("hi");
fep.drawTrunk();
