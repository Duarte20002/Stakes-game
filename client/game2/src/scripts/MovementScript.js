
// You can write more code here

/* START OF COMPILED CODE */

class MovementScript extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {number} */
	speed = 1;

	/* START-USER-CODE */

	// Write your code here.
	update(){
		console.log(this.speed)
		if (this.parent.upKey.isDown) {
			this.parent.body.setVelocityY(this.speed * (-1))
			// console.log("Moving up!")
		}
		if (this.parent.downKey.isDown) {
			this.parent.body.setVelocityY(this.speed * 1)
			// console.log("Moving down!")
		}
		if (this.parent.leftKey.isDown) {
			this.parent.body.setVelocityX(this.speed * (-1))
			this.parent.flipX = false
			// console.log("Moving left!")
		}
		if (this.parent.rightKey.isDown) {
			this.parent.body.setVelocityX(this.speed * 1)
			this.parent.flipX = true
			// console.log("Moving right!")
		}
		if (this.parent.backspaceKey.isDown) {
			this.speed = this.speed * 0.5
		}
		if (this.parent.spaceKey.isDown) {
			this.speed = this.speed * 2
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
