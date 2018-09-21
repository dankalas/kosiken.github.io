
class Picture {
    constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    }
    static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
    }
    pixel(x, y) {
    return this.pixels[x + y * this.width];
    }
    draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
    copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
    }
    }


function updateState(state, action) {
    Object.assign({},state,action);
}

function elt(type,props,...children){
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
for (let child of children) {
if (typeof child != "string") dom.appendChild(child);
else dom.appendChild(document.createTextNode(child));
}
return dom;

}

const scale = 10;
class PictureCanvas {
    constructor(picture, pointerDown) {
        this.dom = elt("canvas", {
            onmousedown: event => this.mouse(event, pointerDown),
            ontouchstart: event => this.touch(event, pointerDown)
        });
        this.syncState(picture);
    }
    syncState(picture) {
        if (this.picture == picture) return;
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }
}

function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");
    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            cx.fillStyle = picture.pixel(x, y);
            cx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

PictureCanvas.prototype.draw.mouse= function(downEvent, onDown){
    if(downEvent.button != 0) return;

    let pos = pointerPosition(downEvent, this.dom)
    let onMove
}