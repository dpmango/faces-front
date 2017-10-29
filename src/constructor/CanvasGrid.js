import Hammer from 'hammerjs';
import { TweenMax } from 'gsap';
import {throttle} from 'lodash';

import photoUrl from './photoUrl';
import click from './click';

export default class CanvasGrid {
  constructor(gridContainer, posts, redirectToProfile) {
    this.gridContainer = gridContainer;
    // don't mutate the state
    // this.posts = Object.keys(posts).map((key) => {
    //   posts[key].id = key;
    //   return posts[key];
    // });
    this.posts = posts

    this.redirectToProfile = redirectToProfile;

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    this.gridContainer.appendChild(this.canvas);

    this.gridStatus = 'playing';

    this.offset = {
      x: 0,
      y: 0
    };

    this.delta = {
      x: 0,
      y: 0
    };

    if ( window.innerWidth < 992 ){
      this.squareSize = 175;
    } else {
      this.squareSize = 225;
    }

    this.totalCols = Math.ceil((window.innerWidth / this.squareSize) + 3);
    this.totalRows = Math.ceil((window.innerHeight / this.squareSize) + 3);

    this.grid = {};

    this.images = this.posts.map((post) => {
      const image = new Image();
      image.src = photoUrl(post.photo);
      image.crossOrigin = "Anonymous";
      return image;
    });

    this.currentImage = 0;
    this.selectedImage = {};
    this.gridImages = [];
    this.dragCanvas();
    this.hoverCanvas();
    this.initializeGrid();
    this.fillGrid();
    this.render();
  }

  xMovement = () => {
    return this.offset.x + this.delta.x;
  }

  yMovement = () => {
    return this.offset.y + this.delta.y;
  }

  initializeGrid = () => {
    const startRow = Math.floor(-this.yMovement() / this.squareSize) - 3;
    const startCol = Math.floor(-this.xMovement() / this.squareSize) - 3;

    // totalRows?? because its based on how many rows there will be
    for (let row = startRow; row <= (startRow + this.totalRows); row++) {
      if (this.grid[row] === undefined) {
        this.grid[row] = {};
      }
      for (let col = startCol; col <= (startCol + this.totalCols); col++) {
        if (this.grid[row][col] === undefined) {
          this.grid[row][col] = false;
        }
      }
    }
  }

  fillGrid = () => {
    const startRow = Math.floor(-this.yMovement() / this.squareSize) - 3;
    const startCol = Math.floor(-this.xMovement() / this.squareSize) - 3;

    for (let row = startRow; row <= (startRow + this.totalRows); row++) {
      for (let col = startCol; col <= (startCol + this.totalCols); col++) {
        // false means there's no img in the current square
        if (this.grid[row][col] === false) {
          this.fillSquare(row, col);
        }
      }
    }
    // console.log('Grid layout', this.grid)
  }

  fillSquare = (row, col) => {
    const options = [];
    let maxRow = row + 3;
    let maxCol = col + 3;

    for (let currentRow = row; currentRow < maxRow; currentRow++) {
      for (let currentCol = col; currentCol < maxCol; currentCol++) {
        if (this.grid[currentRow] && this.grid[currentRow][currentCol] === false) {

          let width = currentCol - col + 1;
          let height = currentRow - row + 1;

          // The bigger it is, the more chance it has of being chosen
          for (let i = 0; i < width * height; i++) {
            options.push({
              width: width,
              height: height
            });
          }
        } else {
          // I don't want to have L shaped images (or an img that covers part of another img) so I need to reduce the
          // maxCol when there's a square already taken by an img
          maxCol = currentCol;
        }
      }
    }

    const randomOption = this.random(0, options.length - 1);

    // All info about the img that's about to be drawn into the square(s)
    const gridImage = {
      row: row,
      col: col,
      width: options[randomOption].width,
      height: options[randomOption].height,
      image: this.images[this.currentImage],
      post: this.posts[this.currentImage],
      scale: 0.001
    }

    TweenMax.to(gridImage, 1, {scale: 1, delay: Math.random() / 2});

    this.gridImages.push(gridImage);

    this.currentImage += 1;

    if (this.currentImage === this.images.length) {
      this.currentImage = 0;
    }

    for (let fillRow = row; fillRow < row + gridImage.height; fillRow++) {
      for (let fillCol = col; fillCol < col + gridImage.width; fillCol++) {
        this.grid[fillRow][fillCol] = gridImage;
      }
    }
  }

  random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render = () => {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.drawImages();
    // this.grayscaling();
    if (this.gridStatus === 'playing') {
      // REFACTOR
      // need some kind of throttle?
      requestAnimationFrame(this.render);
    }
  }

  drawImages = () => {
    this.gridImages.forEach((gridImage) => {

      const fullWidth = (gridImage.width * this.squareSize);
      const fullHeight = (gridImage.height * this.squareSize);

      const width = fullWidth * gridImage.scale;
      const height = fullHeight * gridImage.scale;

      const centeringX = (fullWidth - width) / 2;
      const centeringY = (fullHeight - height) / 2;

      const x = (gridImage.col * this.squareSize) + this.xMovement() + centeringX;
      const y = (gridImage.row * this.squareSize) + this.yMovement() + centeringY;

      this.drawImageProp(
        this.context,
        gridImage.image, x, y, width, height
      );
    });
  }

  stopGrid = () => {
    this.gridStatus = 'inactive';
  }

  // Simulating background cover so that the images are centered to cover the square and they aren't stretched
  // By Ken Fyrstenberg Nilsen (http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas)
  // drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])

  drawImageProp = (ctx, img, x, y, w, h) => {
    const offsetX = 0.5;
    const offsetY = 0.5;

    let iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   // new prop. width
      nh = ih * r,   // new prop. height
      cx, cy, cw, ch, ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    // ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    ctx.globalCompositeOperation = "multiply"
    ctx.fillStyle = "rgba(0,0,0,.7)";
    ctx.fillRect(x, y, w, h)
    // ctx.globalCompositeOperation = "destination-in";
    // ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    ctx.globalCompositeOperation = "source-over";

  }

  dragCanvas = () => {

    const hammer = new Hammer(this.canvas);
    // hammer.defaults = {
    //   domEvents: true
    // }
    hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });

    hammer.on('panleft panright panup pandown tap press', (e) => {
      if(e.type === 'panleft' || e.type === 'panright' || e.type === 'panup' || e.type === 'pandown') {
        this.delta.x = e.deltaX;
        this.delta.y = e.deltaY;

        if (e.isFinal) {
          this.offset.x += this.delta.x;
          this.offset.y += this.delta.y;
          this.delta.x = 0;
          this.delta.y = 0;

          this.initializeGrid();
          this.fillGrid();
        }
      }

      if(e.type === 'tap' || e.type === 'press') {
        click.play();
        const row = Math.floor((e.srcEvent.clientY - this.yMovement()) / this.squareSize);
        const col = Math.floor((e.srcEvent.clientX - this.xMovement()) / this.squareSize);

        const gridImage = this.grid[row][col];
        console.log('redirecting to profile', gridImage)
        this.redirectToProfile(gridImage.post.id);
      }
    });
  }

  getHoveredGrid = (e) => {
    const row = Math.floor((e.clientY - this.yMovement()) / this.squareSize);
    const col = Math.floor((e.clientX - this.xMovement()) / this.squareSize);

    let currImage = this.grid[row][col];

    // debbug error when hovered blank image
    // (not loaded or canvas resizing?)

    if ( currImage == this.selectedImage ){
      TweenMax.to(currImage, 1, {scale: 0.8, delay: 0});
    } else {
      // update global selected image only if changed
      TweenMax.to(this.selectedImage, 1, {scale: 1, delay: 0});
      this.selectedImage = currImage;
    }
  }

  hoverCanvas = () => {
    let throttled = throttle(this.getHoveredGrid, 100, { 'trailing': false });
    this.canvas.addEventListener('mousemove', throttled)
  }

}
