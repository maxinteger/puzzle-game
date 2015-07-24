import {} from 'bin-packing/js/packer.js';

import PuzzleTile from './puzzle-tile';
import PuzzleSprite from './puzzle-sprite';
import SelectManager from './select-manager';
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
		this.load.image('image', '/assets/sample-small.png');
	}

	create(){
		var game = this.game,
			itemsGroup = game.add.group();

		this.puzzleItems = this.imageTiles.map( (rect, idx) => itemsGroup.add(new PuzzleSprite(game, 'image', rect, idx)) );

		this.tiles = this.imageTiles
			.map( (rect, idx) => game.add.existing(new PuzzleTile(game, rect, idx)) );

		SelectManager.init(game, this.puzzleItems);
		SelectManager.shuffle(this.tiles, 10);
	}
}
