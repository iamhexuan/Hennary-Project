import Phaser from 'phaser'

import Level from './game/Level'
import Person from './game/Person'
import Tile from './game/Tile'

var size = 80, edge = 8;

export default class Play extends Phaser.State {

	preload() {
		var imagePath, imageName;
		// load wall image
		for (var i = 0; i < 15; i++) {
			imagePath = 'assets/images/wall/';
			imageName = 'wall_' + (i) + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName, 75, 75);
		}
		// load device image
		for (var i = 0; i < 2; i++) {
			imagePath = 'assets/images/device/';
			imageName = 'device_' + (i + 1) + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName, 75, 75);
		}
		// load human image
		for (var i = 0; i < 10; i++) {
			imagePath = 'assets/images/human/';
			imageName = 'human_' + (i + 1) + '.png';
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
		var l = new Level(1)
		l.addCash(5)
		console.log(l.cash)
		
		// TODO draw sprites
		this.addImageGroup(l.tiles)
		this.addImageGroup(l.humans);
		
		// text
		this.deviceText = [];
		this.deviceNums = [];
		
		var deviceImgs = [];
		var deviceImgsLocked = [];
		var offset = 0;
		for (var i = 0; i < l.deviceStock.length; i++) {
			var img = l.deviceStock[i][0];
			var num = l.deviceStock[i][1];
			
			while (img.type > this.deviceText.length) {
				offset ++;
				this.deviceText.push(null);
				this.deviceNums.push(0);
			}
			
			img.setPosition(edge, i + offset);
			for (var j = 0; j < num; j++) {
				deviceImgs.push(img);	
			}
			deviceImgsLocked.push(img);

			var text = game.add.text(size * (img.row + 1), size * (img.col + 0.5), 'x ' + num, { font: "32px Arial", fill: "#ffffff", align: "left" });
			this.deviceText.push(text)
			this.deviceNums.push(num)
			//this.text.anchor.setTo(0.5, 0.5);
		}
		this.addImageGroup(deviceImgsLocked);
		this.addImageGroup(deviceImgs, true);
		
		this.groupTop = game.add.group();
		game.world.bringToTop(this.groupTop);
	}
	
	addImageGroup(array, enableDrag = false, container = []) {
		var imageName, item;
		var group = game.add.group();
		
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			item = group.create(size * obj.row, size * obj.col, obj.getSpriteString());
			item.init_x = item.x
			item.init_y = item.y
			item.index = i

			container.push(item);

			if (enableDrag) {
				// Enable input detection, then it's possible be dragged.
				item.inputEnabled = true;
				// Make this item draggable.
				item.input.enableDrag();			
				// Then we make it snap to left and right side,
				// also we make it only snap when released.
				item.input.enableSnap(size, size, false, true);	
				// use group to handle zIndex
				item.events.onDragStart.add(item => {
					this.groupTop.add(item)
					this.dragFrom = {x:item.x, y:item.y}
				});
				// Limit drop location
				item.events.onDragStop.add(item => {
					this.groupTop.removeAll();
					group.add(item);
					this.updateSignalStrength(item, container, this.dragFrom, obj.getIntType(), this.deviceText, this.deviceNums);
				});
			}
		}
	}
	
	updateSignalStrength(item, container=[], dragFrom, type=0, deviceText=[], deviceNums=[]) {
		// TODO revert action when dropped at invalid position
		// TODO update signal strength for all tiles
		console.log('item.x', item.x, 'item.y', item.y, 'item.init_x', item.init_x, 'item.init_y', item.init_y, 'container.length', container.length)
		
		var isFromInitPos = (dragFrom.x == item.init_x && dragFrom.y == item.init_y);
		
		// check if inside map
		if (item.x >= size * edge) {
			var text = deviceText[type];
			if (text && !isFromInitPos) {
				text.setText('x ' + deviceNums[type]++)
			}
			item.x = item.init_x;
			item.y = item.init_y;
			return null
		}
		
		// check if another item is already at position
		var anotherItem;
		for (var i = 0; i < container.length; i++) {
			anotherItem = container[i];
			console.log('another item', anotherItem.x, anotherItem.y)
			if (anotherItem.index == item.index) {
				continue;
			}
			if (anotherItem.x == item.x && anotherItem.y == item.y) {
				var text = deviceText[type];
				if (text && !isFromInitPos) {
					text.setText('x ' + deviceNums[type]++)
				}
				// invalid position: another item found
				item.x = item.init_x;
				item.y = item.init_y;
				return null
			}
		}

		var text = deviceText[type];
		if (text && isFromInitPos) {
			text.setText('x ' + deviceNums[type]--)
		}
		return null;
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
