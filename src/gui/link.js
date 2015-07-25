import {createLabel} from './common';

export class Link extends Phaser.Group {
	constructor(game, x, y, text, icon){
		super(game);

		if (icon){
			this._iconName = icon;
			this._icon = new Phaser.Sprite(game, 0, 0, 'gui', this._getIconFrame());
			this._icon.scale.setTo(0.5);
			this.add(this._icon);
		}

		this._label = createLabel(game, this.width * 1.1  , this.height / 2, text);
		this._label.anchor.x = 0;
		this.add(this._label);

		this._hit = this._createHitArea(game);
		this.add(this._hit);
		this.events = this._hit.events;

		[this.x, this.y] = [x, y];

		this.events.onInputOver.add(this._over, this);
		this.events.onInputOut.add(this._out, this);
	}

	_getIconFrame(state='a'){
		return `btn-${this._iconName}-${state}.png`;
	}


	_createHitArea(game) {
		var hit = new Phaser.Sprite(game, 0, 0);
		hit.alpha = 0;
		hit.inputEnabled = true;
		hit.width = this.width;
		hit.height = this.height;
		return hit;
	}

	_over() {
		if (this._icon){
			this._icon.frameName = this._getIconFrame('b');
		}
		this._label.fill = '#ff9f28';
	}

	_out() {
		if (this._icon){
			this._icon.frameName = this._getIconFrame('a');
		}
		this._label.fill = '#e6e6e6';
	}

}
