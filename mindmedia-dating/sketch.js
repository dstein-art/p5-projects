var loadedArray=[0,0,0,0,0];
var loadedImages=[];
var currentItem=0;
var heart;
var loadedAppImages=false;


var sw,sh,lw,lh,btnOrigin1,btnOrigin2;

function preload() {
  thumbupflat=loadImage("assets/thumbsup-flat.png");
  thumbupshadow=loadImage("assets/thumbsup-shadow.png");
  thumbdownflat=loadImage("assets/thumbsdown-flat.png");
  thumbdownshadow=loadImage("assets/thumbsdown-shadow.png");
  avatarLogo=loadImage('assets/avatarLogo.png');

  loadedAppImages=true;
}

function loadImages() {
  for (i=0; i < loadedArray.length; i++) {
    if (loadedArray[i]==0) {
      var r=floor(random(0,filelist.length-1));
      loadedArray[i]=1;
      loadedImages[i]=null;
      loadedImages[i]=loadImage('output/'+filelist[r], function() {
          console.log("loaded "+filelist[r]);
        }
      );
    }
  }
}

function setup() {
  createCanvas(512, 700);
  lw=300;
  lh=75;
  sw=60;
  lw=300;
  sh=600;
  btnOrigin1=(width/3)-sw/2;
  btnOrigin2=2*(width/3)-sw/2;  
}

function nextImage() {
  currentItem++;
  currentItem %= loadedArray.length;
}

function getNextImageId() {
  return (currentItem+1) % loadedArray.length;
}

var initialX;
var lerpX=0;
var deltaX=0;
var isDragging=false;

function mouseDragged() {
  if (mouseY < 512) {
    if (!isDragging) {
      initialX=mouseX;
      isDragging=true;
    }
    deltaX=mouseX-initialX;
  }
  lerpX=0;
}

function mousePressed() {
  if (isOverThumbsDown()) {
    isDragging=false;
    loadedArray[currentItem]=0;
    lerpX=0;
  }
  if (isOverThumbsUp()) {
    isDragging=false;
    loadedArray[currentItem]=0;
    lerpX=0;
  }
}

function mouseReleased() {
  isDragging=false;
  if (deltaX > width*0.6) {
    isDragging=false;
    loadedArray[currentItem]=0;
    lerpX=0;
    nextImage();
  } else {
    lerpX=deltaX;
  }  
  deltaX=0;
}

function isOverThumbsUp() {
  return ((mouseX>btnOrigin2)&&(mouseX<(btnOrigin2+sw))&&(mouseY>sh)&&(mouseY<sh+sw));
}

function isOverThumbsDown() {
  return ((mouseX>btnOrigin1)&&(mouseX<(btnOrigin1+sw))&&(mouseY>sh)&&(mouseY<sh+sw));
}

function draw() {
  background(220);

  loadImages();
  var nextItem=getNextImageId();
  if ((loadedArray[nextItem]==1) && (loadedImages[nextItem]!=null)) {
    image(loadedImages[nextItem],0,80,512,512);
  }

  if ((loadedArray[currentItem]==1) && (loadedImages[currentItem]!=null)) {
    image(loadedImages[currentItem],deltaX+lerpX,80,512,512);
  }
  lerpX=lerpX*0.9;
  if (abs(lerpX) < 20) {
    lerpX=0;
  }

  if (loadedAppImages) {
    if (isOverThumbsDown()) {
      image(thumbdownflat,btnOrigin1,600,60,60);
    } else {
      image(thumbdownshadow,btnOrigin1,600,60,60);
    }
    if (isOverThumbsUp()) {
      image(thumbupflat,btnOrigin2,600,60,60);
    } else {
      image(thumbupshadow,btnOrigin2,600,60,60);
    }
    image(avatarLogo,(width/2)-lw/2,0);
  }
}
