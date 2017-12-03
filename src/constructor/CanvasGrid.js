import Hammer from 'hammerjs';
import { TweenMax } from 'gsap';
import {throttle, debounce} from 'lodash';

import photoUrl from './photoUrl';
import click from './clickSound';
import hover from './hoverSound';

export default class CanvasGrid {
  constructor(gridContainer, posts, redirectToProfile, filter) {
    this.gridContainer = gridContainer;

    this.posts = posts;

    this.redirectToProfile = redirectToProfile;

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    this.gridContainer.appendChild(this.canvas);

    this.gridStatus = 'playing';
    this.gridFreeze = false;
    this.gridChangingPosition = false;

    this.offset = {
      x: 0,
      y: 0
    };

    this.delta = {
      x: 0,
      y: 0
    };

    // to be set in sizeCanvas()
    this.squareSize = 0;
    this.totalCols = 0;
    this.totalRows = 0;

    this.grid = {};

    this.images = this.posts.map((post) => {
      const image = new Image();
      image.src = photoUrl(post.photo);
      image.crossOrigin = "Anonymous";
      return image;
    });

    this.currentImage = 0;
    this.hoveredImage = {};
    this.gridImages = [];

    this.sizeCanvas();
    this.dragCanvas();
    this.scrollCanvas();
    this.resizeCanvas();
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

  sizeCanvas = () => {
    if ( window.innerWidth < 992 ){
      this.squareSize = 175;
    } else if ( window.innerWidth < 568 ) {
      this.squareSize = 140;
    } else {
      this.squareSize = 225;
    }

    this.totalCols = Math.ceil((window.innerWidth / this.squareSize) + 3);
    this.totalRows = Math.ceil((window.innerHeight / this.squareSize) + 3);
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

    // transform to square
    options.forEach((opt) => {
      opt.height = 1;
      opt.width = 1;
    });

    // All info about the img that's about to be drawn into the square(s)
    const gridImage = {
      row: row,
      col: col,
      width: options[randomOption].width,
      height: options[randomOption].height,
      image: this.images[this.currentImage],
      post: this.posts[this.currentImage],
      scale: 0.0001,
      isHoverAvailable: false
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
    if ( !this.gridFreeze ){
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.drawAllImages();
    } else {
      // grid frozen, no rerender of all images
    }
    if (this.gridStatus === 'playing') {
      // REFACTOR
      requestAnimationFrame(this.render);
    }
  }

  drawAllImages = () => {
    this.gridImages.forEach((gridImage) => {
      this.drawImage(gridImage)
    });
  }

  drawImage = (gridImage, isHoverIn, isHoverOut) => {
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
      gridImage, x, y, width, height,
      isHoverIn, isHoverOut
    );
  }

  // Simulating background cover so that the images are centered to cover the square and they aren't stretched
  // By Ken Fyrstenberg Nilsen (http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas)
  // drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])

  drawImageProp = (ctx, img, x, y, w, h, isHoverIn, isHoverOut) => {
    let offsetX = 0.5;
    let offsetY = 0.5;

    // default offset is center
    // offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    // offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    let iw = img.image.width,
      ih = img.image.height,
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

    // if cw meant we got image properties - i.e image is downloaded
    if ( cw ){
      let cropParam = 1.07;

      let imgProps = {
        img: img,
        cx: cx,
        cy: cy,
        cw: cw / cropParam,
        ch: ch / cropParam,
        x: x,
        y: y,
        w: w,
        h: h,
        alpha: .7
      }

      if ( isHoverOut ){
        imgProps.cw = cw,
        imgProps.ch = ch,
        imgProps.alpha = 0;
      }

      if ( img.isHoverAvailable ){
        // don't request animation frame and rerender all grid
        this.freezeGrid();

        if ( isHoverIn ){
          TweenMax.to(imgProps, 1, {
              // cx: cx - 20,
              // cy: cy - 20,
              cw: cw,
              ch: ch,
              alpha: 0, delay: 0, onCompleteParams: [this], onUpdate: drawImageFrame, onComplete: function(that){
                // that.unFreezeGrid();
                // img.isHoverAvailable = false;
          }});
        } else if ( isHoverOut ){

          TweenMax.to(imgProps, 1, {
              // cx: cx - 20,
              // cy: cy - 20,
              cw: cw / cropParam,
              ch: ch / cropParam,
              alpha: .7,
              delay: 0, onCompleteParams: [this], onUpdate: drawImageFrame, onComplete: function(that){
                // that.unFreezeGrid();
                // img.isHoverAvailable = false;
          }});
        }
        img.isHoverAvailable = false;

      } else {
        this.unFreezeGrid();
        drawImageFrame();
      }

      function drawImageFrame(){
        ctx.clearRect(imgProps.x, imgProps.y, imgProps.w, imgProps.h);
        // compose alpha
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(imgProps.img.image, imgProps.cx, imgProps.cy, imgProps.cw, imgProps.ch, imgProps.x, imgProps.y, imgProps.w, imgProps.h);
        ctx.globalCompositeOperation = "multiply"
        ctx.fillStyle = "rgba(0,0,0,"+imgProps.alpha+")";
        ctx.fillRect(imgProps.x, imgProps.y, imgProps.w, imgProps.h)
        // ctx.globalCompositeOperation = "destination-in";
        // ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }

  dragCanvas = () => {

    const hammer = new Hammer(this.canvas);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });

    hammer.get('tap').set({
      touchAction: 'manipulation'
    })

    hammer.on('panleft panright panup pandown panend tap press', (e) => {

      // reset render
      this.unFreezeGrid();

      this.gridChangingPosition = true;

      if(e.type === 'panleft' || e.type === 'panright' || e.type === 'panup' || e.type === 'pandown') {
        this.delta.x = e.deltaX;
        this.delta.y = e.deltaY;
      }

      if (e.type === "panend"){
        this.offset.x += this.delta.x;
        this.offset.y += this.delta.y;
        this.delta.x = 0;
        this.delta.y = 0;

        this.gridChangingPosition = false;
      }

      if(e.type === 'tap' || e.type === 'press') {
        click.play();
        const row = Math.floor((e.srcEvent.clientY - this.yMovement()) / this.squareSize);
        const col = Math.floor((e.srcEvent.clientX - this.xMovement()) / this.squareSize);

        const gridImage = this.grid[row][col];
        this.redirectToProfile(gridImage.post.id);
      }

      e.preventDefault();
    });

    hammer.on('panleft panright panup pandown', throttle( () => {
      this.initializeGrid();
      this.fillGrid();
    }, 300));
  }

  scrollCanvas = () => {
    let hasFinnishedScroll = false;

    this.canvas.addEventListener('wheel', (e) => {

      // reset render
      this.unFreezeGrid();

      this.gridChangingPosition = true;

      // 1s should be enough to render Tweenmax animations
      setTimeout(() =>{
        this.gridChangingPosition = false;
        hasFinnishedScroll = true;
      }, 1000)

      // invert delta
      let delta = e.deltaY
      if ( e.deltaY < 0 ){
        delta = Math.abs(e.deltaY)
      } else if ( e.deltaY > 0){
        delta = -Math.abs(e.deltaY);
      }

      this.delta.y = delta;
      this.offset.y += this.delta.y;
      this.delta.y = 0;

      e.preventDefault();
    })

    this.canvas.addEventListener('wheel', throttle( () => {
      this.initializeGrid();
      this.fillGrid();
    }, 200 ))
  }

  hoverCanvas = () => {

    this.canvas.addEventListener('mousemove', throttle( (e) => {

      const row = Math.floor((e.clientY - this.yMovement()) / this.squareSize);
      const col = Math.floor((e.clientX - this.xMovement()) / this.squareSize);

      // wait till scroll/drag finnishing
      if ( !this.gridChangingPosition ){
        let currImage = this.grid[row][col];

        if ( currImage !== this.hoveredImage ){
          // wait till it's scaled
          if ( currImage.scale == 1 ){

            hover.play();

            // current hovered image
            currImage.isHoverAvailable = true;
            // [img, hoverIn, hoverOut]
            this.drawImage(currImage, true, false);

            // previous hovered image
            if ( Object.keys(this.hoveredImage).length !== 0 && this.hoveredImage.constructor === Object){
              console.log('prev image', this.hoveredImage.image)
              this.hoveredImage.isHoverAvailable = true;
              this.drawImage(this.hoveredImage, false, true);
            }

            // TweenMax.to(currImage, 1, {scale: 1.2, delay: 0});
            this.hoveredImage = currImage;
          }

        } else {
          // triggered when hovering within the hovered image

          // this.unFreezeGrid();
          // TweenMax.to(this.hoveredImage, 1, {scale: 1, delay: 0});
          // but we rerender all to reset siblings
        }
      }

    }, 50, {
      'leading': true,
      'trailing': false
    }) );
  }

  resizeCanvas = () => {
    window.addEventListener('resize', debounce( (e) => {

      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.sizeCanvas();
      this.initializeGrid();
      this.fillGrid();

    }, 300 ))
  }

  stopGrid = () => {
    this.gridStatus = 'inactive';
  }

  playGrid = () => {
    this.gridStatus = 'playing';
  }

  freezeGrid = () => {
    this.gridFreeze = true;
  }

  unFreezeGrid = () => {
    // to default state

    // and reset all img's
    this.gridImages.forEach((gridImage) => {
      gridImage.isHoverAvailable = false;
    });

    this.gridFreeze = false;
  }

  removeGrid = () => {
    this.gridContainer.removeChild(this.canvas);
  }

}
