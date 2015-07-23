import {} from 'phaser';

export default class PuzzleSprite extends Phaser.Sprite{
	constructor(game, image, rect, idx){
		super(game, rect.x, rect.y, image);
		this.index = idx;
		this.crop(rect)
	}
}
