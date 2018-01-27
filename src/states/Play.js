import Phaser from 'phaser'

import Level from './game/Level'
import Person from './game/Person'
import Tile from './game/Tile'
export default class Play extends Phaser.State {

	preload() {
		var imagePath, imageName;
		for (var i = 0; i < 10; i++) {
			imagePath = 'assets/images/device/';
			imageName = 'device_' + (i % 2 + 1) + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName, 75, 75);
		}
	}

	create() {
		this.counter = 0;
		this.text = 0;
        
        let tile = new Tile()
        
        tile.runTileTests()
        
		game.stage.backgroundColor = '#6688ee';

		this.text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
		this.text.anchor.setTo(0.5, 0.5);

		//  Here we'll create a basic looped event.
		//  A looped event is like a repeat event but with no limit, it will literally repeat itself forever, or until you stop it.

		//  The first parameter is how long to wait before the event fires. In this case 1 second (you could pass in 1000 as the value as well.)
		//  The next two parameters are the function to call ('updateCounter') and the context under which that will happen.

		game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		
		// TODO init level
		var l = new Level(0)
		l.addCash(5)
		console.log(l.cash)
		
		// TODO draw sprites
		this.addImages();
	}
	
	addImages(container = []) {
		var imageName, item;
		var group = game.add.group();
		var group_top = game.add.group();
		
		game.world.bringToTop(group_top);
		
		for (var i = 0; i < 10; i++) {
			imageName = 'device_' + (i % 2 + 1) + '.png';
			item = group.create(90 * (1 + i%2), 90 * (1 + Math.floor(i/2)), imageName);
			item.init_x = item.x
			item.init_y = item.y
			item.index = i

			container.push(item);

			// Enable input detection, then it's possible be dragged.
			item.inputEnabled = true;

			// Make this item draggable.
			item.input.enableDrag();
			
			// Then we make it snap to left and right side,
			// also we make it only snap when released.
			item.input.enableSnap(90, 90, false, true);

			item.events.onDragStart.add(item => group_top.add(item));
			// Limit drop location
			item.events.onDragStop.add(item => {
				group_top.removeAll();
				group.add(item);
				this.updateSignalStrength(item,container);
			});
		}
	}
	
	updateSignalStrength(item, container=[]) {
		// TODO revert action when dropped at invalid position
		// TODO update signal strength for all tiles
		console.log('item.x', item.x, 'item.y', item.y, 'item.init_x', item.init_x, 'item.init_y', item.init_y, 'container.length', container.length)
		
		// check if another item is already at position
		var anotherItem;
		for (var i = 0; i < container.length; i++) {
			anotherItem = container[i];
			console.log('another item', anotherItem.x, anotherItem.y)
			if (anotherItem.index == item.index) {
				continue;
			}
			if (anotherItem.x == item.x && anotherItem.y == item.y) {
				// invalid position: another item found
				item.x = item.init_x;
				item.y = item.init_y;
				break
			}
		}
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
