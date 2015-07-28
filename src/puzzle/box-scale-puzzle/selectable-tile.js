import PuzzleTile from '../common/puzzle-tile';
import {default as SelectManager} from './select-manager';

export default class SelectableTile extends PuzzleTile{
	constructor (game, rect, idx){
		super(game, rect, idx);
		this.events.onInputDown.add(this.select, this);
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

	deselect(){
		this.selected = false;
		this.onOut();
		SelectManager.removeItem(this);
	}
}
