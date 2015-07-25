import {createLabel} from './common';

export class Button extends Phaser.Group {
	constructor(game, x, y, text){
		super(game);
		this.sprite = new Phaser.Sprite(game, 0, 0, 'gui', 'btn-block-a.png');
		this.sprite.scale.setTo(.8);
		this.add(this.sprite);

		[this.x, this.y] = [x, y];

		this.text = createLabel(game, this.sprite.width / 2, this.sprite.height / 2, text);
		this.add(this.text);

		this.sprite.inputEnabled = true;
		this.events = this.sprite.events;

		this.events.onInputOver.add(this._over, this);
		this.events.onInputOut.add(this._out, this);
	}

	_over() {
		this.sprite.frameName = 'btn-block-b.png';
	}

	_out() {
		this.sprite.frameName = 'btn-block-a.png';
	}
}
