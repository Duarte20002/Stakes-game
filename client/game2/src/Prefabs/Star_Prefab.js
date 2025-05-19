
// You can write more code here

/* START OF COMPILED CODE */

class Star_Prefab extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 532, y ?? 213, texture || "starts-spritesheet", frame ?? 0);

		scene.physics.add.existing(this, false);
		this.body.drag.x = 20;
		this.body.drag.y = 20;
		this.body.allowGravity = false;
		this.body.setSize(128, 128, false);
		this.play("Starstarts-spritesheet");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
