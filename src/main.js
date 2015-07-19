var baseCanvas = document.querySelector('#canvas-1'),
    baseCtx = baseCanvas.getContext('2d'),

    canvas = document.querySelector('#canvas-2'),
    ctx = canvas.getContext('2d'),

    image = new Image();

function mapImageData (imageData, fn){
    var data = imageData.data;
    for (var x = 0, w = imageData.width; x < w; x++){
        for(var y = 0, h = imageData.height; y < h; y++ ){
            var idx = (y * w + x) * 4;
            data.set(fn(x, y, data[idx], data[idx + 1], data[idx + 2], data[idx + 3], imageData), idx);
        }
    }
}

function clampImage(imageData, fn){
    mapImageData(imageData, (x, y, r, g, b, a) => [r, g, b, fn(x, y, r, g, b, a, imageData) ? a : 0])
}

function putPixel(imageData, x, y, r, g, b, a){
    var i = (imageData.width * y + x) * 4;
    imageData.data[i    ] = r;
    imageData.data[i + 1] = g;
    imageData.data[i + 2] = b;
    imageData.data[i + 3] = a;
}

function rand(min, max){
	return Math.floor(Math.random() * max) - min;
}

image.addEventListener('load', function () {
    baseCanvas.width = canvas.width  = image.width;
    baseCanvas.height= canvas.height = image.height;

    baseCtx.drawImage(image, 0, 0, image.width, image.height);

    var imageData = baseCtx.getImageData(0, 0, image.width, image.height);

//    mapImageData(imageData, (x, y, r, g, b, a) => [r, g, b*2, a] );
    var {sin, cos, round} = Math,
        cx = imageData.width / 2 | 0,
        cy = imageData.height / 2 | 0,
        r1 = cy * cy,
        r2 = r1 / 2,
        a1 = cos(0),
        a2 = cos(Math.PI / 4);

    clampImage(imageData, (x, y) => {
        x -= cx;
        y -= cy;
        var d = x * x + y * y,
            a =  (x * x) / d;
        return  d < r1 && d > r2 && a < a1 && a > a2;
    });

    ctx.putImageData(imageData, 0, 0, 0, 0, image.width, image.height);
});



image.src = '/assets/sample-small.png';

var puzzleItems = [];

var SelectManager = _.extend(Object.create(EventEmitter2.prototype), {
    items: [],
    canSelectMore(){
        return this.items.length < 2;
    },
    addItem(item){
        if (this.canSelectMore()){
            this.items.push(item);
            if (this.items.length === 2){
                this.swap(this.items);
            }
        }
    },
    removeItem(item){
        _.remove(this.items, item);
    },
    swap(tiles){
        var [tile1, tile2] = tiles,
            pic1 = puzzleItems[tile1.index],
            pic2 = puzzleItems[tile2.index];

        [{pic: pic1, tile: tile2}, {pic: pic2, tile: tile1}].map( this.setItem );

		if (this.isSolved()){
			this.emit('solved', true);
		}
    },
	setItem({pic, tile}){
		pic.x = tile.rect.x;
		pic.y = tile.rect.y;
		pic.width = tile.rect.width;
		pic.height = tile.rect.height;

		puzzleItems[tile.index] = pic;
		tile.deselect();
	},
	shuffle(tiles, iteration=10){

		_.map(_.range(iteration),  () => {
			var [i, j] = [rand(0, tiles.length), rand(0, tiles.length)];
			this.swap([tiles[i], tiles[j]]);
		});
	},
	solve(titles){
		_(puzzleItems).filter( (i, idx) => i.index !== idx).map((item) => {
			this.setItem({pic: item, tile: titles[item.index]});
		}).value();
	},
	isSolved(){
		return puzzleItems.filter( (i, idx) => i.index !== idx).length === 0;
	}
});

class PuzzleTile extends Phaser.Group {
    constructor (game, rect, idx){
        super(game);
        this.index = idx;
        this._createSprite(game, rect);
        this._createBorderLayer(game);
        this.rect = rect;
        this.x = rect.x;
        this.y = rect.y;
        this.selected = false;
		this.outline = false;
    }

    _createSprite (game, rect){
        this.sprite = new Phaser.Sprite(game, 0, 0);
        this.sprite.alpha = 0;
        this.sprite.width = rect.width;
        this.sprite.height = rect.height;
        this.sprite.events.onInputOver.add(this.onOver, this);
        this.sprite.events.onInputOut.add(this.onOut, this);
        this.sprite.events.onInputDown.add(this.onDown, this);
        this.sprite.inputEnabled = true;
        this.add(this.sprite);
    }

    _createBorderLayer(game){
        this.border = new Phaser.Graphics(game, 0, 0);

        this.add(this.border);
    }

    _drawRect(color, w=2){
        var {width, height} = this.rect;
        this.border.lineStyle(w, color, 1);
        this.border.drawRect(1, 1, width-w, height-w);
    }

    deselect(){
        this.selected = false;
        this.onOut();
        SelectManager.removeItem(this);
    }

    select (){
        if(this.selected){
            this.deselect();
        } else if (SelectManager.canSelectMore()){
            this.selected = true;
            SelectManager.addItem(this);
            this.onOver();
        }
    }

	toggleOutline(toggle){
		this.outline = toggle === void 0 ? !this.outline : toggle;
		this.onOut();
	}

    onDown(){
        this.select();
    }

    onOver(){
        this._drawRect(this.selected ? 0xffff00 : 0xff0000);
    }

    onOut(){
        if (!this.selected){
            this.border.clear();
			if (this.outline){
				this._drawRect(0xffffff, 1);
			}
        }
    }
}

class PuzzleSprite extends Phaser.Sprite{
    constructor(game, image, rect, idx){
        super(game, rect.x, rect.y, image);
		this.index = idx;
        this.crop(rect)
    }
}

var nRand = function(min, max) {
    var u1, u2,
        picked = -1;

        while (picked < 0 || picked > 1) {
            u1 = Math.random();
            u2 = Math.random();
            picked = 1/6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5;
        }
        return Math.floor(min + picked * (max - min));
    },
    random = function (a,b) { return Math.random() - 0.5;},
    packer = new Packer(10, 10),
    blocks = _(_.range(1000)).map((i) => { return {w: nRand(1, 5) | 0, h: nRand(1, 5) | 0}; } ).sort(random).value();

packer.fit(blocks);

var imageTiles = _(blocks).filter( (b) => !!b.fit ).map((b) => {
    return new Phaser.Rectangle(b.fit.x / 10 * 512, b.fit.y / 10 * 384, b.w / 10 * 512, b.h / 10 * 384);
}).value();


function preload() {
    game.load.image('image', '/assets/sample-small.png');
}

function create() {
    puzzleItems = imageTiles.map( (rect, idx) => game.add.existing(new PuzzleSprite(game, 'image', rect, idx)) );

    tiles = imageTiles
		.map( (rect, idx) => game.add.existing(new PuzzleTile(game, rect, idx)) );

	SelectManager.shuffle(tiles, 10);
}

function render() {

    // Display
    //sprites.map(game.debug.spriteBounds.bind(game.debug));
    //game.debug.spriteCorners(sprite, true, true);
    //game.debug.inputInfo(32, 32);
    //game.debug.pointer( game.input.activePointer );
}


var game = new Phaser.Game(512, 384, Phaser.AUTO, 'phaser', { preload, create, render }),
	tiles = [];

document.getElementById('id-outline').addEventListener('change', function () {
	tiles.map( (s) => s.toggleOutline(this.checked) );
});

document.getElementById('id-solve-btn').addEventListener('click', (() => SelectManager.solve(tiles)) , false);
document.getElementById('id-shuffle-btn').addEventListener('click', (() => SelectManager.shuffle(tiles)) , false);

SelectManager.on('solved', function () {
	document.getElementById('id-message').innerHTML = "You solved!";
});
