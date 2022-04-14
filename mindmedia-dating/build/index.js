const { HostedModel } = require('@runwayml/hosted-models');
const { exit } = require('process');

const runway = require('./acct-runway');  // file with account info

// To create the acct-runway.js module required above... just add the following to file:
// module.exports = {
//   url: 'https://stylegan2-  the rest of the url of your model from runwayml',
//  token: 'c1bz.... the rest of your token from runwayml'
//};


const model = new HostedModel({
  url: runway.url,
  token: runway.token
});

const prompt = 'Hey text generation model, finish my sentence';
//model.query({ prompt }).then(result => console.log(result));

function createRandomVector() {
    const vector = [];
    // shuffle a little
    for (let c = 0; c < counter; c++) {
        Math.random();
    }
    for (let i = 0; i < 512; i++) {
      vector[i] = Math.random(0, 2)-1.0;
      if (Math.abs(vector[i])>0.999999) {
        vector[i] = Math.random(0, 2)-1.0;
      }
    }
    return vector;
}

function askRunway() {
    var coordinates=createRandomVector();
    const inputs = {
      z: coordinates,
      truncation: 1.0,
    };
    console.log(inputs);
    waitingForResponse=true;
    model.query(inputs).then(gotReply);
}

function decodeBase64Image(dataString) 
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) 
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

var waitingForResponse=false;

function saveImage(filenamePrefix,base64Data) {
    var imageTypeRegularExpression = /\/(.*?)$/;  
    var imageBuffer = decodeBase64Image(base64Data);
    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
    var filename = filenamePrefix+'.' + imageTypeDetected[1];

    try {
        require('fs').writeFile(filename, imageBuffer.data,  function() {
                console.log('DEBUG - feed:message: Saved to disk image attached by user:', filename);
        });
    }
    catch(error) {
            console.log('ERROR:', error);
    }
}

function gotReply(results) {
    feedbackText = "";
    //console.log(results);
    var b=results.image;
    //resultingImage = createImg(results.image); //turn base64 image into usable
    //resultingImage.hide(); //hide html version
    //var base64Data = b.replace(/^data:image\/jpg;base64,/, "");
    //require("fs").writeFile("out.jpg", base64Data, 'base64', function(err) {
    //    console.log(err);
    //..});
    saveImage("stylegan-"+counter,b);
    waitingForResponse=false;
    counter++;
    askRunway();
}


counter=271;
askRunway();
console.log("DONE");
/*
while (counter < 1000) {
    if (!waitingForResponse) {
        askRunway();
    }
}
*/

