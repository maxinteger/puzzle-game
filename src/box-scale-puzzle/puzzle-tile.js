import {} from 'phaser';
import {default as SelectManager} from './select-manager';

export default class PuzzleTile extends Phaser.Group {
	constructor (game, rect, idx){
		super(game);
		this.index = idx;
		this._createSprite(game, rect);
		this._createBorderLayer(game);
		this.rect = rect;
		this.x = rect.x;
		this.y = rect.y;
		this.selected = false;
		this.outline = false;
	}

	_createSprite (game, rect){
		this.sprite = new Phaser.Sprite(game, 0, 0);
		this.sprite.alpha = 0;
		this.sprite.width = rect.width;
		this.sprite.height = rect.height;
		this.sprite.events.onInputOver.add(this.onOver, this);
		this.sprite.events.onInputOut.add(this.onOut, this);
		this.sprite.events.onInputDown.add(this.onDown, this);
		this.sprite.inputEnabled = true;
		this.add(this.sprite);
	}

	_createBorderLayer(game){
		this.border = new Phaser.Graphics(game, 0, 0);

		this.add(this.border);
	}

	_drawRect(color, w=2){
		var {width, height} = this.rect;
		this.border.lineStyle(w, color, 1);
		this.border.drawRect(1, 1, width-w, height-w);
	}

	deselect(){
		this.selected = false;
		this.onOut();
		SelectManager.removeItem(this);
	}

	select (){
		if(this.selected){
			this.deselect();
		} else if (SelectManager.canSelectMore()){
			this.selected = true;
			SelectManager.addItem(this);
			this.onOver();
		}
	}

	toggleOutline(toggle){
		this.outline = toggle === void 0 ? !this.outline : toggle;
		this.onOut();
	}

	onDown(){
		this.select();
	}

	onOver(){
		this._drawRect(this.selected ? 0xffff00 : 0xff0000);
	}

	onOut(){
		if (!this.selected){
			this.border.clear();
			if (this.outline){
				this._drawRect(0xffffff, 1);
			}
		}
	}
}
