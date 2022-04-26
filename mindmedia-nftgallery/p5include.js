var newcolor=80;

const s = ( sketch ) => {

    let x = 100;
    let y = 100;
    let p5_canvas;

    sketch.setup = () => {
      p5_canvas=sketch.createCanvas(200, 200);
      p5_canvas.style('display', 'none');// hide this because I want to use in three.js
    };

    sketch.getP5Canvas = function(){
          return p5_canvas.elt;
    }
  
    sketch.draw = () => {
      sketch.background(200,100,100);
      sketch.fill(sketch.newcolor);
      sketch.rect(x,y,50,50);
      sketch.text("Hello World",40,20);
    };
};

function getP5Instance() {
    
}
