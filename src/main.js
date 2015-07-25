import {BoxScalePuzzle} from './box-scale-puzzle/main';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser');

game.state.add('BoxScalePuzzle', BoxScalePuzzle);
game.state.start('BoxScalePuzzle');
