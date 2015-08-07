import {map} from 'ramda';
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

function sliceImage(srcBitmap, targetBitmap, r1, r2, qFrom, qTimes){
	function getMethod(q){
		return (q >= 1 && q < 3) || (q >= 5 && q < 7 );
	}
	var {sin, cos, PI} = Math,
		q = PI / 4,
		ctx = srcBitmap.context,
		isSin = getMethod(qFrom),
		imageData = ctx.getImageData(0, 0, srcBitmap.width, srcBitmap.height),
		cx = srcBitmap.width / 2 | 0,
		cy = srcBitmap.height / 2 | 0,
		a2 = (isSin ? sin : cos)(qFrom * q),
		a1 = (isSin ? sin : cos)(qFrom * q + qTimes * q),
		R1 = r1 * r1,
		R2 = r2 * r2;
		if (a1 > a2){
			[a1, a2] = [a2, a1];
		}

	clampImage(imageData, (x, y) => {
		x -= cx;
		y -= cy;
		var d = x * x + y * y,
			dd = Math.sqrt(d),
			a = isSin ? y / dd : x / dd;
		return  d < R1 && d > R2 && (a >= a1 && a <= a2);
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
			group = game.add.group(),
			itemsGroup = game.add.group(),
			tileGroup = game.add.group(),
			r1 = Math.min(512, 384) / 2 | 0;
			game.stage.backgroundColor = '#A67F59';

		map(d => {
			var btm = game.make.bitmapData();
			btm.load('image');

			sliceImage(btm, btm, ...d);

			group.add(new Phaser.Sprite(game, 0, 0, btm));
			return btm;
		}, [
			[r1, r1/2, 0, 1],
			[r1, r1/2, 2, 1],
			[r1, r1/2, 3, 1],
			[r1, r1/2, 5, 1],

			[r1/2, r1/5, 0, 1],
			[r1/2, r1/5, 2, 1],
			[r1/2, r1/5, 3, 1],
			[r1/2, r1/5, 5, 1]
		]);

		group.x = (game.world.width - group.width) / 2;
		group.y = (game.world.height - group.height) / 2;

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
