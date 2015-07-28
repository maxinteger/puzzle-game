import {BoxScalePuzzle} from './puzzle/box-scale-puzzle/main';
import {SlidingPuzzle} from './puzzle/sliding-puzzle/main';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser');

game.state.add('BoxScalePuzzle', BoxScalePuzzle);
game.state.add('SlidingPuzzle', SlidingPuzzle);
game.state.start('SlidingPuzzle');
