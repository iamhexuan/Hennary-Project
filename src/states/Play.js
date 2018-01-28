import Phaser from 'phaser'

import Level from './game/Level'
import Person from './game/Person'
import Tile from './game/Tile'
import LevelSelector from './game/LevelSelector'
import LevelConfig from './game/LevelConfig'

var levelSelector = new LevelSelector()

export default class Play extends Phaser.State {

	preload() {
		var imagePath, imageName, imageId;
		// load wall image
		for (var i = 0; i < 16; i++) {
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
		// load human emotions	
		for (var emotion in personEmotions) {
			imagePath = 'assets/images/emotion/';
			imageName = emotion.toLowerCase() + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName);
		}
		
		// load hud
		for (var i = 0; i < 3; i++) {
			imagePath = 'assets/images/hud/';
			imageName = 'money_' + (i + 1) + '.png';
			console.log(imagePath + imageName)
			game.load.image(imageName, imagePath + imageName);
		}
		imageName = 'side_menu.png';
		game.load.image(imageName, imagePath + imageName);
		
		// for level images
		
		levelSelector.loadLevelSelector({ levelNumbers : [1,2,3] })
	}

	create() {
		this.counter = 0;
		this.text = 0;
        
        let tile = new Tile()
        
        tile.runTileTests()
        
		game.stage.backgroundColor = '#f0f0f0';

		//this.text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
		//this.text.anchor.setTo(0.5, 0.5);

		//  Here we'll create a basic looped event.
		//  A looped event is like a repeat event but with no limit, it will literally repeat itself forever, or until you stop it.

		//  The first parameter is how long to wait before the event fires. In this case 1 second (you could pass in 1000 as the value as well.)
		//  The next two parameters are the function to call ('updateCounter') and the context under which that will happen.

		game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		

		// TODO init level
		let ls_obj = [1,2,3].reduce((acc, num) => {
            const lvl = new Level({
        		levelNumber: num,
        		goal: 0, 
                cash: 0,
                thumbnailPath: '',
                thumbnailSize: [500, 300],
            	isLocked: false,
            })
            acc[num] = lvl
            return acc
        },{})
            
        let ls = Object.values(ls_obj)    
        
        this.level = ls[0]
		
		levelSelector.drawLevelSelector({ 
            mainCanvas : {width: 1024, height: 768}, 
            levels: ls, 
            currentLevelNumber: 1
        })
        
		console.log('levelSelector:', levelSelector)
		
		levelSelector.onLevelSelect = ev => {
    		console.log('onLevelSelect', ev)
    		const lvl_num = ev.levelNumber
    		
    		
    		let l = ls_obj[lvl_num]
    		
    		console.log(l)
    		
    		this.level = l
    		
    		this.level.initCashSprite()
    		
    		levelSelector.unloadAllLevelsOnStage()
			
    		// TODO draw sprites
			this.signals = []
			this.addImageGroup(this.level.tiles, false, this.signals, 'wall_15.png');
			
    		this.addImageGroup(l.tiles)
    		this.addImageGroup(l.humans);
    		
			// side menu
			game.add.image(1024 - 210, 0, 'side_menu.png');
			
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
					console.log('img pos old', img.row, img.col)
					img.col = (1018 - size*2)/size;
					img.row = 1.25*(1.31+i);
					console.log('img pos new', img.row, img.col)
    				deviceImgs.push(img);
    			}
    			deviceImgsLocked.push(img);
    
    			var text = game.add.text(1024 - size, size*1.2*(1.8+i), 'x ' + num, { font: "32px Arial", fill: "#ffffff", align: "left" });
    			this.deviceText.push(text)
    			//this.text.anchor.setTo(0.5, 0.5);
    		}
    		//this.addImageGroup(deviceImgsLocked);
    		this.addImageGroup(deviceImgs, true);
    		
    		this.groupTop = game.add.group();
    		game.world.bringToTop(this.groupTop);
    		
    		
    		
		}
		
		
	}

	
	addImageGroup(array, enableDrag = false, container = [], imageName=null) {
		var imageName, item;
		var group = game.add.group();
		
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			item = group.create(size * obj.col, size * obj.row, imageName ? imageName : obj.getSpriteString());
			item.init_x = item.x
			item.init_y = item.y
			item.index = i
			item.data = array[i]

			container.push(item);
			
			if (imageName) {
				item.alpha = 0
			}
			
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
				});
				// Limit drop location
				item.events.onDragStop.add(item => {
    				console.log('item', item)
					this.groupTop.removeAll();
					group.add(item);
					this.updateSignalStrength(item, container, this.deviceText)
				});
			}
		}
	}
	
	updateSignalStrength(item, container=[], deviceText=[]) {
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
		
		// check if on floor
		var row = item.y / size;
		var col = item.x / size;
		var tile = this.level.tiles[row * this.level.dimension[1] + col]
		console.log('on floor check', row, col, tile)
		if (tile.type != tileTypes.FLOOR) {
			item.x = item.init_x;
			item.y = item.init_y;
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
		
		if (!this.maxSignal) {
			this.maxSignal = 0
			for (var i = 0; i < this.level.deviceStock.length; i++) {
				var signal = this.level.deviceStock[i][0].strength
				console.log('max signal', this.maxSignal, signal)
				if (signal > this.maxSignal) {
					this.maxSignal = signal;
				}
			}
		}
		for (var i = 0; i < this.signals.length; i++) {
			item = this.signals[i];
			game.add.tween(item).to( { alpha: item.data.signalStrength / this.maxSignal * maxAlpha }, 0, Phaser.Easing.Linear.None, true)
		}
	}

	updateCounter() {
		this.level.timer();
		this.counter++;
		//this.text.setText('Counter: ' + this.counter);
	}
	
	render() {
		game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
		game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
	}
}
