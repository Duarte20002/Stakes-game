
// You can write more code here

/* START OF COMPILED CODE */

class Angel_Piece extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 415, y ?? 129);

		this.scaleX = 1.1;
		this.scaleY = 1.1;

		// number_Piece_Angel__1_
		const number_Piece_Angel__1_ = scene.add.image(9, 12, "Number_Piece_Angel (1)");
		number_Piece_Angel__1_.scaleX = 0.75;
		number_Piece_Angel__1_.scaleY = 0.75;
		this.add(number_Piece_Angel__1_);

		// angel_Piece
		const angel_Piece = scene.add.image(9.5, 5, "Angel Piece");
		angel_Piece.scaleX = 0.43;
		angel_Piece.scaleY = 0.43;
		angel_Piece.setOrigin(0.5074080087620843, 0.49552723999270276);
		this.add(angel_Piece);

		// troop_count
		const troop_count = scene.add.text(9, 35, "", {});
		troop_count.scaleX = 0.3;
		troop_count.scaleY = 0.3;
		troop_count.setOrigin(0.5028175536264277, 0.5028175536264297);
		troop_count.text = "99";
		troop_count.setStyle({ "align": "center", "fixedWidth":80,"fixedHeight":45,"fontSize": "50px", "fontStyle": "bold" });
		this.add(troop_count);

		this.number_Piece_Angel__1_ = number_Piece_Angel__1_;
		this.angel_Piece = angel_Piece;
		this.troop_count = troop_count;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	number_Piece_Angel__1_;
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
