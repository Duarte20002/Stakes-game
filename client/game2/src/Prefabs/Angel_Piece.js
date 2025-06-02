
// You can write more code here

/* START OF COMPILED CODE */

class Angel_Piece extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 415, y ?? 129);

		// number_Piece_Angel__2_
		const number_Piece_Angel__2_ = scene.add.image(-1, 31, "Number_Piece_Angel (2)");
		number_Piece_Angel__2_.scaleX = 0.75;
		number_Piece_Angel__2_.scaleY = 0.75;
		this.add(number_Piece_Angel__2_);

		// angel_Piece
		const angel_Piece = scene.add.image(0, 0, "Angel Piece");
		angel_Piece.scaleX = 0.45;
		angel_Piece.scaleY = 0.45;
		this.add(angel_Piece);

		// troop_count
		const troop_count = scene.add.text(-1, 31, "", {});
		troop_count.scaleX = 0.3;
		troop_count.scaleY = 0.3;
		troop_count.setOrigin(0.5, 0.5);
		troop_count.text = "99";
		troop_count.setStyle({ "align": "center", "fixedWidth":80,"fixedHeight":45,"fontSize": "50px", "fontStyle": "bold" });
		this.add(troop_count);

		this.number_Piece_Angel__2_ = number_Piece_Angel__2_;
		this.angel_Piece = angel_Piece;
		this.troop_count = troop_count;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	number_Piece_Angel__2_;
	/** @type {Phaser.GameObjects.Image} */
	angel_Piece;
	/** @type {Phaser.GameObjects.Text} */
	troop_count;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
