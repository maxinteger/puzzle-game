import {} from 'phaser';
import {} from 'imports?define=>false,exports=>false,this=>window!eventemitter2/lib/eventemitter2';
import {} from 'bin-packing/js/packer.js';

import {default as PuzzleTile} from './box-scale-puzzle/puzzle-tile';
import {default as PuzzleSprite} from './box-scale-puzzle/puzzle-sprite';
import {default as SelectManager} from './box-scale-puzzle/select-manager';
import {getById, nRand, randomComparator} from './utils';

var blocks = _(_.range(1000)).map((i) => { return {w: nRand(1, 5) | 0, h: nRand(1, 5) | 0}; } ).sort(randomComparator).value();
new Packer(10, 10).fit(blocks);

var puzzleItems = [],
	tiles = [],
	imageTiles = _(blocks).filter( (b) => !!b.fit ).map((b) => {
		return new Phaser.Rectangle(b.fit.x / 10 * 512, b.fit.y / 10 * 384, b.w / 10 * 512, b.h / 10 * 384);
	}).value();

function preload() {
    game.load.image('image', '/assets/sample-small.png');
}

function create() {
	var itemsGroup = game.add.group();

    puzzleItems = imageTiles.map( (rect, idx) => itemsGroup.add(new PuzzleSprite(game, 'image', rect, idx)) );

    tiles = imageTiles
		.map( (rect, idx) => game.add.existing(new PuzzleTile(game, rect, idx)) );

	SelectManager.init(game, puzzleItems);
	SelectManager.shuffle(tiles, 10);
}

var game = new Phaser.Game(512, 384, Phaser.AUTO, 'phaser', { preload, create});

getById('id-outline').addEventListener('change', function () {
	tiles.map( (s) => s.toggleOutline(this.checked) );
});

getById('id-solve-btn').addEventListener('click', (() => SelectManager.solve(tiles)) , false);
getById('id-shuffle-btn').addEventListener('click', (() => SelectManager.shuffle(tiles)) , false);

SelectManager.on('solved', function () {
	getById('id-message').innerHTML = "You solved!";
});
