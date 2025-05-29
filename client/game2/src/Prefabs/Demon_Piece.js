
// You can write more code here

/* START OF COMPILED CODE */

class Demon_Piece extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 540, y ?? 216);

		// number_Piece_Demon
		const number_Piece_Demon = scene.add.image(-3, 54, "Number_Piece_Demon");
		number_Piece_Demon.scaleX = 0.75;
		number_Piece_Demon.scaleY = 0.75;
		this.add(number_Piece_Demon);

		// demon_Piece_1
		const demon_Piece_1 = scene.add.image(-3, 25, "Demon Piece_1");
		demon_Piece_1.scaleX = 0.45;
		demon_Piece_1.scaleY = 0.45;
		this.add(demon_Piece_1);

		// text_1
		const text_1 = scene.add.text(-13, 48, "", {});
		text_1.scaleX = 0.3;
		text_1.scaleY = 0.3;
		text_1.text = "99";
		text_1.setStyle({ "align": "center", "fixedWidth":65,"fixedHeight":45,"fontSize": "50px", "fontStyle": "bold" });
		this.add(text_1);

		this.number_Piece_Demon = number_Piece_Demon;
		this.demon_Piece_1 = demon_Piece_1;
		this.text_1 = text_1;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	number_Piece_Demon;
	/** @type {Phaser.GameObjects.Image} */
	demon_Piece_1;
	/** @type {Phaser.GameObjects.Text} */
	text_1;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
