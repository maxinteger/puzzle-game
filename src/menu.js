import {Button, Link, Checkbox, createLabel} from './gui';



export class GameMenu {
	constructor(game){
		this.game = game;
	}

	preload(){
		this.load.atlasJSONHash('gui', '/assets/gui.png', '/assets/gui.json');
	}

	create(){
		var game = this.game;


		game.stage.backgroundColor = '#A67F59';

		var label = createLabel(game, 0, 100, "Puzzle World");
		label.fontSize = 50;
		label.anchor.setTo(.5);
		label.x = (game.world.width) / 2;
		game.add.existing(label);

		var btnSolve = new Link(game, 0, game.world.height / 2 - 50, 'Scale box puzzle', 'ok');
		btnSolve.x = (game.world.width - btnSolve.width) / 2;
		btnSolve.events.onInputDown.add(() => game.state.start('BoxScalePuzzle') );
		game.add.existing(btnSolve);


		var btnSliding = new Link(game, 0, game.world.height / 2 + 50, 'Sliding puzzle', 'ok');
		btnSliding.x = (game.world.width - btnSliding.width) / 2;
		btnSliding.events.onInputDown.add(() => game.state.start('SlidingPuzzle') );
		game.add.existing(btnSliding);

	}
}
