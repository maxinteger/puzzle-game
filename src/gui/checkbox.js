import {Link} from './link';

export class Checkbox extends Link{
	constructor(game, x, y, text){
		super(game, x, y, text, 'empty');

		this.events.onInputDown.add(this._down, this);
		this.checked = false;

		this.events.onChange = new Phaser.Signal();
	}

	_down() {
		this.checked = !this.checked;
		this._iconName = this.checked ? 'ok' : 'empty';
		this._icon.frameName = this._getIconFrame('b');
		this.events.onChange.dispatch(this);
	}
}
