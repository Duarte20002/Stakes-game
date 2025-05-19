var counter = 0

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// enterKey
		const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

		// map_Game_final
		const map_Game_final = this.add.image(662, 361, "Map_Game_final");
		map_Game_final.scaleX = 0.7060555249789695;
		map_Game_final.scaleY = 0.6970694749223262;

		// card_Deck_2
		const card_Deck_2 = this.add.image(1187, 123, "Card Deck 2");
		card_Deck_2.scaleX = 0.2713583157513023;
		card_Deck_2.scaleY = 0.30462737163115067;

		// angel_Piece_2
		const angel_Piece_2 = this.add.image(149, 161, "Angel Piece 2");
		angel_Piece_2.scaleX = 0.7;
		angel_Piece_2.scaleY = 0.7;

		// demon_Piece
		const demon_Piece = this.add.image(995, 478, "Demon Piece");
		demon_Piece.scaleX = 0.7;
		demon_Piece.scaleY = 0.7;

		// lists
		const stars = [];

		// collider
		const collider = this.physics.add.collider(dino_Prefab, stars, this.pickstar, undefined, this);

		this.enterKey = enterKey;
		this.collider = collider;
		this.stars = stars;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Input.Keyboard.Key} */
	enterKey;
	/** @type {Phaser.Physics.Arcade.Collider} */
	collider;
	/** @type {Array<any>} */
	stars;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();

		this.text_2.on("pointerdown", () => {
			counter = counter + 1;
			this.counterText.text = "Counter: " + counter;
			console.log("Image pressed and counter increased!");
		});
	}

	update(){
		// console.log("update my boy")

		if (this.enterKey.isDown) {
			counter = counter + 1;
			this.counterText.text = "Counter: " + counter;
			console.log("Pressed enter and counter increased!");
		}

	}

	pickstar(eagle, star) {
		counter = counter + 1;
		this.counterText.text = "Counter: " + counter;
		console.log("Collision detected!")
		star.destroy()
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here