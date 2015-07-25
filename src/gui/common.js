export function createLabel(game, x, y, str) {
	var text = new Phaser.Text(game, x, y, str);
	text.font = 'Galindo';
	text.anchor.setTo(0.5);
	text.align = 'center';
	text.stroke = '#4c2c0c';
	text.strokeThickness = 10;
	text.fill = '#e6e6e6';

	return text;
}
