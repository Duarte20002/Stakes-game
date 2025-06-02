
// You can write more code here

/* START OF COMPILED CODE */

class Neutral_Piece extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 445, y ?? 172);

		this.scaleX = 1.1;
		this.scaleY = 1.1;

		// number_Piece_Neutral__1_
		const number_Piece_Neutral__1_ = scene.add.image(-1, 31, "Number_Piece_Neutral (1)");
		number_Piece_Neutral__1_.scaleX = 0.75;
		number_Piece_Neutral__1_.scaleY = 0.75;
		this.add(number_Piece_Neutral__1_);

		// neutral_Piece__2_
		const neutral_Piece__2_ = scene.add.image(0, 0, "Neutral Piece (2)");
		neutral_Piece__2_.scaleX = 0.45;
		neutral_Piece__2_.scaleY = 0.45;
		this.add(neutral_Piece__2_);

		// troop_count
		const troop_count = scene.add.text(-1, 31, "", {});
		troop_count.scaleX = 0.3;
		troop_count.scaleY = 0.3;
		troop_count.setOrigin(0.5, 0.5);
		troop_count.text = "99";
		troop_count.setStyle({ "align": "center", "color": "#000000ff", "fixedWidth":82,"fixedHeight":49,"fontSize": "50px", "fontStyle": "bold" });
		this.add(troop_count);

		this.neutral_Piece__2_ = neutral_Piece__2_;
		this.troop_count = troop_count;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	neutral_Piece__2_;
	/** @type {Phaser.GameObjects.Text} */
	troop_count;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
