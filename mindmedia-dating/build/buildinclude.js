// This file does does a directory and builds an include file with an array of all of the files
//   in the directory


const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, 'output');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    var first=true;
    console.log("var filelist=[")
    files.forEach(function (file) {
        if (first) {
        // Do whatever you want to do with the file
            prefix="\"";
        } else {
            prefix=",\"";
        }
        console.log(prefix+file+"\""); 
        first=false;
    });
    console.log("];");
});