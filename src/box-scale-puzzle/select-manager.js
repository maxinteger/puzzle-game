import {rand} from '../utils';

export default _.extend(Object.create(null), {
	items: [],
	events: {
		onSolve: new Phaser.Signal()
	},
	init(game, puzzleItems){
		this.game = game;
		this.puzzleItems = puzzleItems;
	},
	canSelectMore(){
		return this.items.length < 2;
	},
	addItem(item){
		if (this.canSelectMore()){
			this.items.push(item);
			if (this.items.length === 2){
				this.swap(this.items);
			}
		}
	},
	removeItem(item){
		_.remove(this.items, item);
	},
	swap(tiles, withoutAnim){
		var [tile1, tile2] = tiles,
			pic1 = this.puzzleItems[tile1.index],
			pic2 = this.puzzleItems[tile2.index];

		this.setItem({pic: pic1, tile: tile2}, withoutAnim);
		this.setItem({pic: pic2, tile: tile1}, withoutAnim);

		this._highlightItems();
		if (this.isSolved()){
			this.events.onSolve.dispatch(this);
		}
	},
	setItem({pic, tile}, withoutAnim){
		var {x, y, width, height} = tile.rect;

		if (withoutAnim){
			pic.x = x;
			pic.y = y;
			pic.width = width;
			pic.height = height;
		} else {
			pic.bringToTop();
			this.game.add.tween(pic).to( { x, y, width, height }, 500).start();
		}

		this.puzzleItems[tile.index] = pic;
		tile.deselect();
	},
	shuffle(tiles, iteration=10){

		_.map(_.range(iteration),  () => {
			var [i, j] = [rand(0, tiles.length), rand(0, tiles.length)];
			this.swap([tiles[i], tiles[j]], true);
		});
	},
	solve(titles){
		_(this.puzzleItems).filter( (i, idx) => i.index !== idx).map((item) => {
			this.setItem({pic: item, tile: titles[item.index]}, true);
		}).value();
	},
	highlight(state){
		this._highlight = state;
		this._highlightItems();
	},
	_highlightItems(){
		this.puzzleItems.map( (item, idx) => {
			item.alpha = this._highlight && item.index !== idx ? 0.5 : 1;
		})
	},
	isSolved(){
		return this.puzzleItems.filter( (i, idx) => i.index !== idx).length === 0;
	}
});

