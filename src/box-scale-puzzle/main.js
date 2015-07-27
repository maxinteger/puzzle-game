import {} from 'bin-packing/js/packer.js';

import PuzzleTile from './puzzle-tile';
import PuzzleSprite from './puzzle-sprite';
import SelectManager from './select-manager';
import {Button, Link, Checkbox, createLabel} from '../gui';
import {nRand, randomComparator} from '../utils';

export class BoxScalePuzzle {
	constructor(game){
		var blocks = _(_.range(1000)).map((i) => { return {w: nRand(1, 5) | 0, h: nRand(1, 5) | 0}; } ).sort(randomComparator).value();
		new Packer(10, 10).fit(blocks);

		this.puzzleItems = [];
		this.tiles = [];
		this.imageTiles = _(blocks).filter( (b) => !!b.fit ).map((b) => {
			return new Phaser.Rectangle(b.fit.x / 10 * 512, b.fit.y / 10 * 384, b.w / 10 * 512, b.h / 10 * 384);
		}).value();
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

		SelectManager.init(game, this.puzzleItems);
		SelectManager.shuffle(this.tiles, 10);

		var btnShuffle = new Button(game, 20, game.world.height - 75, 'Shuffle');
		btnShuffle.events.onInputDown.add(() => SelectManager.shuffle(this.tiles));
		btnShuffle.scale.setTo(.75);
		game.add.existing(btnShuffle);

		var btnSolve = new Button(game, 200, game.world.height - 75, 'solve');
		btnSolve.events.onInputDown.add(() => SelectManager.solve(this.tiles));
		btnSolve.scale.setTo(.75);
		game.add.existing(btnSolve);

		var showOutline = new Checkbox(game, 500, game.world.height - 70, 'Tile\'s outline');
		showOutline.events.onChange.add((cbx)=> this.tiles.map( (s) => s.toggleOutline(cbx.checked) ) );
		showOutline.scale.setTo(.75);
        game.add.existing(showOutline);

		var highlight = new Checkbox(game, 350, game.world.height - 70, 'Highlight');
		highlight.events.onChange.add((cbx)=> SelectManager.highlight(cbx.checked) );
		highlight.scale.setTo(.75);
		game.add.existing(highlight);

		SelectManager.events.onSolve.add(()=> {
			var gameOver = createLabel(game, game.world.width/2, 50, 'Congratulation\nYou solved!');
			game.add.existing(gameOver);
		});
	}
}
