
// You can write more code here

/* START OF COMPILED CODE */

class Dino_Prefab extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 366, y ?? 266, texture || "eagle-spritesheet", frame ?? 0);

		this.scaleX = 3;
		this.scaleY = 3;
		scene.physics.add.existing(this, false);
		this.body.drag.x = 100;
		this.body.drag.y = 100;
		this.body.allowGravity = false;
		this.body.setSize(40, 41, false);
		this.play("idleeagle-spritesheet");

		// movementScript
		const movementScript = new MovementScript(this);

		// upKey
		const upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		// downKey
		const downKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

		// leftKey
		const leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

		// rightKey
		const rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		// backspaceKey
		const backspaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

		// spaceKey
		const spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// movementScript (prefab fields)
		movementScript.speed = 100;

		this.upKey = upKey;
		this.downKey = downKey;
		this.leftKey = leftKey;
		this.rightKey = rightKey;
		this.backspaceKey = backspaceKey;
		this.spaceKey = spaceKey;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.Input.Keyboard.Key} */
	upKey;
	/** @type {Phaser.Input.Keyboard.Key} */
	downKey;
	/** @type {Phaser.Input.Keyboard.Key} */
	leftKey;
	/** @type {Phaser.Input.Keyboard.Key} */
	rightKey;
	/** @type {Phaser.Input.Keyboard.Key} */
	backspaceKey;
	/** @type {Phaser.Input.Keyboard.Key} */
	spaceKey;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
