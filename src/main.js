import {} from 'phaser';

import {default as SelectManager} from './box-scale-puzzle/select-manager';
import {BoxScalePuzzle} from './box-scale-puzzle/main';
import {getById} from './utils';

var game = new Phaser.Game(512, 384, Phaser.AUTO, 'phaser');


game.state.add('BoxScalePuzzle', BoxScalePuzzle);
game.state.start('BoxScalePuzzle');

getById('id-outline').addEventListener('change', function () {
	tiles.map( (s) => s.toggleOutline(this.checked) );
});

getById('id-solve-btn').addEventListener('click', (() => SelectManager.solve(tiles)) , false);
getById('id-shuffle-btn').addEventListener('click', (() => SelectManager.shuffle(tiles)) , false);

SelectManager.on('solved', function () {
	getById('id-message').innerHTML = "You solved!";
});
