import {Button, Link, Checkbox, createLabel} from '../../gui';
import {mapImageData, clampImage} from './basic';

import PuzzleTile from '../common/puzzle-tile';
import PuzzleSprite from '../common/puzzle-sprite';
import {rand} from '../../utils'

var size = 3,
	numOfItems = size * size - 1;

var MoveManager = _.extend(Object.create(null), {
	init(game, tiles){
		this.moveCounter = 0;
		this.game = game;
		this.holeIdx = numOfItems;
		this.getNextItemIdxs(this.holeIdx);
		this.puzzleItems = tiles;
		this.events = {
			onSolve: new Phaser.Signal(),
			onMove: new Phaser.Signal()
		};
	},

	getNextItemIdxs: _.memoize( (holeIdx) => {
		return [holeIdx - 1, holeIdx + 1, holeIdx - size, holeIdx + size]
			.filter( i => (i >= 0) && (i <= numOfItems) && (i % size === holeIdx % size || (i / size | 0) === (holeIdx / size | 0)) );
	}),

	move(tile, tiles, withoutAnim=false){

		if (_.contains(this.getNextItemIdxs(this.holeIdx), tile.index) ){
			var pic = _.find(this.puzzleItems, {index: tile.index}),
				tt = tiles[this.holeIdx];
			pic.index = this.holeIdx;
			this.holeIdx = tile.index;

			if(!withoutAnim){
				this.moveCounter++;
				this.events.onMove.dispatch(this);
				pic.bringToTop();
				this.game.add.tween(pic).to( { x: tt.x, y: tt.y }, 500).start();
			} else {
				pic.x = tt.x;
				pic.y = tt.y;
			}

			if (this.isSolved()){
				this.events.onSolve.dispatch(this);
			}
		}
	},
	shuffle(tiles, iteration=5){
		_.range(iteration)
			.map( () => {
				var idxs = this.getNextItemIdxs(this.holeIdx);
				this.move(tiles[idxs[rand(0, idxs.length)]], tiles, true);
			});
		this.moveCounter = 0;
		this.events.onMove.dispatch(this);
	},
	solve(tiles){
		_(this.puzzleItems)
			.filter( (i, idx) => i.index !== idx)
			.map((item) => {
				var tile = tiles[item.index];
				item.x = tile.x;
				item.y = tile.y;
				item.index = tile.index;
			})
			.value();

		this.moveCounter = 0;
		this.events.onMove.dispatch(this);
	},
	isSolved(){
		return this.puzzleItems.filter( (i, idx) => i.index !== idx).length === 0;
	}
});


function sliceImage(srcBitmap, targetBitmap, r1, r2, sizeRad, offsetRad=0){

	var ctx = srcBitmap.context,
		imageData = ctx.getImageData(0, 0, srcBitmap.width, srcBitmap.height),
		cx = srcBitmap.width / 2 | 0,
		cy = srcBitmap.height / 2 | 0,
		a1 = Math.cos(offsetRad),
		a2 = Math.cos(sizeRad + offsetRad),
		R1 = r1 * r1,
		R2 = r2 * r2;

	clampImage(imageData, (x, y) => {
		x -= cx;
		y -= cy;
		var d = x * x + y * y,
			a =  (x * x) / d;
		return  d < R1 && d > R2 && a > a2 && a <= a1;
	});

	targetBitmap.context.putImageData(imageData, 0, 0, 0, 0, srcBitmap.width, srcBitmap.height);
}

export class CirclePuzzle {
	constructor(game){
		var rSize = 384 / size | 0;

		this.puzzleItems = [];
		this.tiles = [];
		this.imageTiles = _(_.range(numOfItems + 1))
			.map( i => new Phaser.Rectangle(rSize * (i % size), rSize * (i / size | 0), rSize, rSize) )
			.value();
	}

	preload(){
		this.load.atlasJSONHash('gui', '/assets/gui.png', '/assets/gui.json');
		this.load.image('image', '/assets/sample-small.png');
	}

	create(){
		var game = this.game,
			itemsGroup = game.add.group(),
			tileGroup = game.add.group(),
			btm = game.make.bitmapData();

		btm.load('image');

		game.stage.backgroundColor = '#A67F59';

		var r1 = Math.min(btm.width, btm.height) / 2 | 0;

        sliceImage(btm, btm, r1, r1/2, Math.PI / 3, 0);

		game.add.image(0, 0, btm);

		var btnBack = new Link(game, 25, game.world.height - 75, 'Menu', 'menu');
		btnBack.events.onInputDown.add(() => game.state.start('Menu'));
		btnBack.scale.setTo(.75);
		game.add.existing(btnBack);

		var btnShuffle = new Button(game, 150, game.world.height - 75, 'Shuffle');
		btnShuffle.events.onInputDown.add(() => MoveManager.shuffle(this.tiles));
		btnShuffle.scale.setTo(.75);
		game.add.existing(btnShuffle);

		var btnSolve = new Button(game, 300, game.world.height - 75, 'solve');
		btnSolve.events.onInputDown.add(() => MoveManager.solve(this.tiles));
		btnSolve.scale.setTo(.75);
		game.add.existing(btnSolve);

		var showOutline = new Checkbox(game, 450, game.world.height - 70, 'Tile\'s outline');
		showOutline.events.onChange.add((cbx)=> this.tiles.map( (s) => s.toggleOutline(cbx.checked) ) );
		showOutline.scale.setTo(.75);
		game.add.existing(showOutline);


		var countLabel = createLabel(game, game.world.width-50, game.world.height / 2, '0');
		game.add.existing(countLabel);

	}
}
