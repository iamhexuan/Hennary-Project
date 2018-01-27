import Phaser from 'phaser'

export default class Play extends Phaser.State {

	preload() {
		var imagePath, imageName;
		for (var i = 0; i < 10; i++) {
			imagePath = 'assets/images/human/';
			imageName = 'human_' + (i + 1) + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName, 65, 75);
		}
	}

	create() {
		this.counter = 0;
		this.text = 0;

		game.stage.backgroundColor = '#6688ee';

		this.text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
		this.text.anchor.setTo(0.5, 0.5);

		//  Here we'll create a basic looped event.
		//  A looped event is like a repeat event but with no limit, it will literally repeat itself forever, or until you stop it.

		//  The first parameter is how long to wait before the event fires. In this case 1 second (you could pass in 1000 as the value as well.)
		//  The next two parameters are the function to call ('updateCounter') and the context under which that will happen.

		game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		
		// TODO draw sprites
		this.items = []
		this.addImage(this.items)
	}
	
	addImage(items = []) {
		var item;
		var test = game.add.group();
		
		for (var i = 0; i < 10; i++) {
			var imageName = 'human_' + (i + 1) + '.png';
			var item = test.create(90 * (1 + i%2), 90 * (1 + Math.floor(i/2)), imageName);
			item.init_x = item.x
			item.init_y = item.y

			items.push(item)
			//console.log(items)

			// Enable input detection, then it's possible be dragged.
			item.inputEnabled = true;

			// Make this item draggable.
			item.input.enableDrag();
			
			// Then we make it snap to left and right side,
			// also we make it only snap when released.
			item.input.enableSnap(90, 90, false, true);

			// Limit drop location
			item.events.onDragStop.add(this.updateSignalStrength);
		}
	}
	
	updateSignalStrength(item) {
		// TODO revert action when dropped at invalid position
		// TODO update signal strength for all tiles
		console.log('item.x', item.x, 'item.y', item.y, 'item.init_x', item.init_x, 'item.init_y', item.init_y)
	}

	updateCounter() {
		// TODO call Level.timer()
		this.counter++;
		this.text.setText('Counter: ' + this.counter);
	}
	
	render() {
		game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
		game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
	}
}
