# Dark Light

### Description
This project is a rogue-like survival stealth third person dungeon crawler (that's a long name) made natively in JavaScript for the [JS13K competition(2020)](https://js13kgames.com/). Your lover is missing, captured by evil creatures and locked into their lair. You grab your lamp and venture deep into the dark dungeon. You must bring her back at all costs!

**The game features:**
* 4 randomly generated floors
* New enemy designs are added on each floor
* Hidden shops scattered through the dungeon (grab all the coins you see!)
* Multiple upgrades

**Controls:**
* PC:
    * Up/Down/Left/Right arrows to move
    * Z/X to increase or decrease light
* Mobile:
    * Arrows on screen to move
    * +/- to increase or decrease light


### Code
To fit everything into 13k, I had to unfortunately reduce every function name to 1 letter. It might be hard to read at some places but I made sure every one of them have comments describing their original name and also what they are supposed to do. If you are lost, referer to the function definitions.

### Compiling
To minize the code and make it fit under the size limit, I used this Webpack [base projet](https://github.com/mtmckenna/js13k-webpack-typescript-starter-party) and modified for this project. To run it, you need to have the Node Package Manager (npm) and run `npm install` at the root of the project. You will then be able to compile the project by running :

`npx webpack --build'`

The content will be built into the `dist/` folder.

To switch between the production and development environments, seek the `webpack.config.js` file at the root of the project and replace its content by what's inside of either the `webpack.dev.js` or `webpack.prod.js` file.

### Contact
If you have any questions or want to discuss, you can find me on Twitter at [@ShexTheSwift](https://twitter.com/ShexTheSwift).