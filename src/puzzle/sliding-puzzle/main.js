import {Button, Link, Checkbox, createLabel} from '../../gui';


import PuzzleTile from '../common/puzzle-tile';
import PuzzleSprite from '../common/puzzle-sprite';

var size = 5;

var SlidingManager = _.extend(Object.create(null), {
	init(game, tiles){
		_(this.puzzleItems).filter( (i, idx) => i.index !== idx).map((item) => {
			this.setItem({pic: item, tile: titles[item.index]}, true);
		}).value();
		this.events = {
			onSolve: new Phaser.Signal()
		};
	},
	move(){
		pic.bringToTop();
		this.game.add.tween(pic).to( { x, y, width, height }, 500).start();
	},
	shuffle(){

	},
	solve(){

	}
});

export class SlidingPuzzle {
	constructor(game){
		var rSize = 384 / size | 0;

		this.puzzleItems = [];
		this.tiles = [];
		this.imageTiles = _(_.range(size * size - 1))
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

		this.puzzleItems = this.imageTiles
			.map( (rect, idx) => itemsGroup.add(new PuzzleSprite(game, 'image', rect, idx)) );

		this.tiles = this.imageTiles
			.map( (rect, idx) => tileGroup.add(new PuzzleTile(game, rect, idx)) );

		itemsGroup.x = tileGroup.x = (game.world.width - tileGroup.width) / 2;
		itemsGroup.y = tileGroup.y = (game.world.height - tileGroup.height) / 2;

		SlidingManager.init(game, this.puzzleItems);
		SlidingManager.shuffle(this.tiles, 10);

		var btnShuffle = new Button(game, 20, game.world.height - 75, 'Shuffle');
		btnShuffle.events.onInputDown.add(() => SlidingManager.shuffle(this.tiles));
		btnShuffle.scale.setTo(.75);
		game.add.existing(btnShuffle);

		var btnSolve = new Button(game, 200, game.world.height - 75, 'solve');
		btnSolve.events.onInputDown.add(() => SlidingManager.solve(this.tiles));
		btnSolve.scale.setTo(.75);
		game.add.existing(btnSolve);

		var showOutline = new Checkbox(game, 500, game.world.height - 70, 'Tile\'s outline');
		showOutline.events.onChange.add((cbx)=> this.tiles.map( (s) => s.toggleOutline(cbx.checked) ) );
		showOutline.scale.setTo(.75);
		game.add.existing(showOutline);


		SlidingManager.events.onSolve.add(()=> {
			var gameOver = createLabel(game, game.world.width/2, 50, 'Congratulation\nYou solved!');
			game.add.existing(gameOver);
		});
	}
}
