import Phaser from 'phaser'

import Level from './game/Level'
import Person from './game/Person'
import Tile from './game/Tile'
import LevelSelector from './game/LevelSelector'
import LevelConfig from './game/LevelConfig'

var size = 75, edge = 8;

var levelSelector = new LevelSelector()

export default class Play extends Phaser.State {

	preload() {
		var imagePath, imageName, imageId;
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
		
		// for level images
		
		levelSelector.loadLevelSelector({ levelNumbers : [1,2,3] })
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
		var ls = [1,2,3].map(num => new Level({
    		levelNumber: num,
    		goal: 0, 
            cash: 0,
            thumbnailPath: '',
            thumbnailSize: [500, 300],
        	isLocked: false,
        }))
                
        
		
		levelSelector.drawLevelSelector({ 
            mainCanvas : {width: 1024, height: 768}, 
            levels: ls, 
            currentLevelNumber: 1
        })
        
		console.log('levelSelector:', levelSelector)
		
		levelSelector.onLevelSelect = ev => {
    		console.log('onLevelSelect', ev)
		}
		
		let l = ls[0]
		this.level = l;
		
		edge = 11
		// TODO draw sprites
		this.addImageGroup(l.tiles)
		this.addImageGroup(l.humans);
		
		// text
		this.deviceText = [];
		
		var deviceImgs = [];
		var deviceImgsLocked = [];
		var offset = 0;
		for (var i = 0; i < l.deviceStock.length; i++) {
			var img = l.deviceStock[i][0];
			var num = l.deviceStock[i][1];
			
			while (img.type > this.deviceText.length + 1) {
				offset ++;
				this.deviceText.push(null);
			}
			
			img.setPosition(i + offset + 0.1, edge);
			for (var j = 0; j < num; j++) {
				deviceImgs.push(img);	
			}
			deviceImgsLocked.push(img);

			var text = game.add.text(size * (img.col + 1), size * (img.row + 0.5), 'x ' + num, { font: "32px Arial", fill: "#ffffff", align: "left" });
			this.deviceText.push(text)
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
			item = group.create(size * obj.col, size * obj.row, obj.getSpriteString());
			item.init_x = item.x
			item.init_y = item.y
			item.index = i
			item.data = array[i]

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
    				console.log('item', item)
					this.groupTop.removeAll();
					group.add(item);
					this.updateSignalStrength(item, container, this.dragFrom, this.deviceText)
				});
			}
		}
	}
	
	updateSignalStrength(item, container=[], dragFrom={}, deviceText=[]) {
		// TODO revert action when dropped at invalid position
		// TODO update signal strength for all tiles
		console.log('item.x', item.x, 'item.y', item.y, 'item.init_x', item.init_x, 'item.init_y', item.init_y, 'container.length', container.length)
	
		var type = item.data.type - 1;
		
		// check if inside map
		if (item.x >= size * edge) {
			item.x = item.init_x;
			item.y = item.init_y;
		} else {		
			// check if another item is already at position
			var anotherItem;
			for (var i = 0; i < container.length; i++) {
				anotherItem = container[i];
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

		var text = deviceText[type];
		if (text) {
			var num = 0;
			for (var i = 0; i < container.length; i++) {
				anotherItem = container[i];
				if (anotherItem.x == item.init_x && anotherItem.y == item.init_y) {
					num++;
				}
			}
			text.setText('x ' + num)
		}
		
		this.level.onDragStop(container);
	}

	updateCounter() {
		this.level.timer();
		this.counter++;
		this.text.setText('Counter: ' + this.counter);
	}
	
	render() {
		game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
		game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
	}
}
