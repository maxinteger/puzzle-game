import {GameMenu} from './menu';
import {BoxScalePuzzle} from './puzzle/box-scale-puzzle/main';
import {SlidingPuzzle} from './puzzle/sliding-puzzle/main';
import {CirclePuzzle} from './puzzle/circle-puzzle/main';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser');

game.state.add('Menu', GameMenu);
game.state.add('BoxScalePuzzle', BoxScalePuzzle);
game.state.add('SlidingPuzzle', SlidingPuzzle);
game.state.add('CirclePuzzle', CirclePuzzle);
//game.state.start('Menu');
game.state.start('CirclePuzzle');
