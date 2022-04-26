# NFT Art Gallery using Three.JS and OpenSea API

I created the table and the orbital movements by following the tutorial at: https://www.youtube.com/watch?v=a0qSHBnqORU and related (github code)[https://stackblitz.com/github/tamani-coding/threejs-raycasting]. This tutorial is particularly good at teaching Raycasting for the purpose of moving objects.

The above tutorial used typescript. This requires webpack to run to translate the index.ts file into the index.js file. There were some unexpected nuances of typescript that I had to dig through. Besides the code nuances, the npm packages allowed me to setup up webpack seemlesly.

The final project can be seen here: (NFT Gallery Online)[https://dstein-art.github.io/p5-projects/mindmedia-nftgallery/index.html]

P5 is used in instance mode to draw the titles below each artwork. The resulting P5 sketch produces a texture that is used in the mesh. Probably not the most efficient way to draw text, but it was interesting to me as I am looking forward to mixing P5 and Three.JS in other ways

A snapshot of the API is cached into the assets.json file. 
