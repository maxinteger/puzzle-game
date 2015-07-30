import {Button, Link, Checkbox, createLabel} from '../../gui';


import PuzzleTile from '../common/puzzle-tile';
import PuzzleSprite from '../common/puzzle-sprite';
import {rand} from '../../utils'

var size = 3,
	numOfItems = size * size - 1;

var SlidingManager = _.extend(Object.create(null), {
	init(game, tiles){
		this.game = game;
		this.holeIdx = numOfItems;
		this.getNextItemIdxs(this.holeIdx);
		this.puzzleItems = tiles;
		this.events = {
			onSolve: new Phaser.Signal()
		};
	},

	getNextItemIdxs: _.memoize( (holeIdx) => {
		return [holeIdx - 1, holeIdx + 1, holeIdx - size, holeIdx + size]
			.filter( (i) => { return i >= 0 &&
								   i <= numOfItems &&
						  		   i % size === holeIdx % size || (i / size | 0) === (holeIdx / size | 0) }
		)
	}),

	move(tile, tiles, withoutAnim=false){
		if (_.contains(this.getNextItemIdxs(this.holeIdx), tile.index) ){
			var pic = _.find(this.puzzleItems, {index: tile.index}),
				tt = tiles[this.holeIdx];
			pic.index = this.holeIdx;
			this.holeIdx = tile.index;

			if(!withoutAnim){
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
			})
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
	},
	isSolved(){
		return this.puzzleItems.filter( (i, idx) => i.index !== idx).length === 0;
	}
});

export class SlidingPuzzle {
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
			tileGroup = game.add.group();

		game.stage.backgroundColor = '#A67F59';

		this.puzzleItems = _.initial(this.imageTiles)
			.map( (rect, idx) => itemsGroup.add(new PuzzleSprite(game, 'image', rect, idx)) );

		this.tiles = this.imageTiles
			.map( (rect, idx) => {
				var tile = new PuzzleTile(game, rect, idx);
				tile.events.onInputDown.add( ()=> SlidingManager.move(tile, this.tiles) );
				return tileGroup.add(tile);
			} );

		itemsGroup.x = tileGroup.x = (game.world.width - tileGroup.width) / 2;
		itemsGroup.y = tileGroup.y = (game.world.height - tileGroup.height) / 2;

		SlidingManager.init(game, this.puzzleItems);
		SlidingManager.shuffle(this.tiles, 10);


		var btnBack = new Link(game, 25, game.world.height - 75, 'Menu', 'menu');
		btnBack.events.onInputDown.add(() => game.state.start('Menu'));
		btnBack.scale.setTo(.75);
		game.add.existing(btnBack);

		var btnShuffle = new Button(game, 150, game.world.height - 75, 'Shuffle');
		btnShuffle.events.onInputDown.add(() => SlidingManager.shuffle(this.tiles));
		btnShuffle.scale.setTo(.75);
		game.add.existing(btnShuffle);

		var btnSolve = new Button(game, 300, game.world.height - 75, 'solve');
		btnSolve.events.onInputDown.add(() => SlidingManager.solve(this.tiles));
		btnSolve.scale.setTo(.75);
		game.add.existing(btnSolve);

		var showOutline = new Checkbox(game, 450, game.world.height - 70, 'Tile\'s outline');
		showOutline.events.onChange.add((cbx)=> this.tiles.map( (s) => s.toggleOutline(cbx.checked) ) );
		showOutline.scale.setTo(.75);
		game.add.existing(showOutline);


		SlidingManager.events.onSolve.add(()=> {
			var gameOver = createLabel(game, game.world.width/2, 50, 'Congratulation\nYou solved!');
			game.add.existing(gameOver);
		});
	}
}
