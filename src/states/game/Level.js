import LevelConfig from "./LevelConfig"
import Tile from "./Tile"
import Device from "./Device"

const level_config = new LevelConfig()

export default class Level {
	constructor({
    	levelNumber = 1, 
    	goal = 0, 
    	cash = 0,
    	thumbnailPath = '',
    	thumbnailSize = [500, 400],
    	isLocked = false,
    } = {}) {
		let config = level_config.getConfig(levelNumber)
		this.levelNumber = levelNumber;
		this.humans = (!!config) ? config.humanStock : []
		this.tiles = (!!config) ? this.getTiles(config.dimension, config.walls) : []
		this.deviceStock = (!!config) ? config.deviceStock : []
		this.emitters = [];
		this.cash = (!!config) ? config.cash : 0
		this.goal = (!!config) ? config.goal : 0
		this.thumbnail = {
    		'path' : thumbnailPath,
    		'width' : thumbnailSize[0],
    		'height': thumbnailSize[1],
		}
		this.isLocked = isLocked
		this.dimension = (!!config) ? config.dimension : [0,0]
	}

	getTiles(dimension, walls){
		var tiles = [];
		for(var i = 0; i < dimension[0]; i++){
			for(var j = 0; j < dimension[1]; j++){
				tiles.push(new Tile({ row: i, col: j, type: tileTypes.FLOOR, permeability: 0, id: 0 }));
			}
		}

		walls.forEach(function(item){
			//var old = tiles[item.row * dimension[1] + item.col]
			//console.log('walls.forEach', old.row, old.col, item.row, item.col)
			tiles[item.row * dimension[1] + item.col] = item;
		})
		return tiles;
	}

	evaluate() {
		// TODO evaluate performance based on time
	}
	
	isWon() {
		return this.cash >= this.goal
	}
	
	isLost() {
		return this.cash < 0
	}
	
	addCash(amount) {
		this.cash += amount
		//console.log('add cash', amount, this.cash)
	}
	
	timer() {
		if (this.isWon()) {
			alert('You Won!');
			location.reload();
			return 0;
		}
		if (this.isLost()) {
			alert('You Lost!');
			location.reload();
			return 0;
		}
		
		// loop all humans
		for (var i = 0; i < this.humans.length; i++) {
			var human = this.humans[i];
			human.timer();
			this.addCash(human.actualPay())
		}
	}
	
	onDragStop(container) {
		this.emitters = [];
		var size = global.size;
		
		for (var i = 0; i < container.length; i++) {
			var item = container[i];
			//console.log('emitter', i, item.data, item.x, item.y, item.init_x, item.init_y)
			if (item.x != item.init_x || item.y != item.init_y) {
				var device = new Device(item.data);
				device.setPosition(item.y/size, item.x/size);
				this.emitters.push(device);
			}
		}
		//console.log('emitters', this.emitters)

		// loop all tiles
		var a = new Tile()
				
		a.updateTilesSignalStrength({
			canvas:{rows:this.dimension[0], cols:this.dimension[1]},
			tiles: this.tiles,
			emitters: this.emitters,
			overwriteSourceTiles: true
		}).then(res => 
		{		
			// loop all humans
			for (var i = 0; i < this.humans.length; i++) {
				var human = this.humans[i];
				var tile = this.tiles[human.row * this.dimension[1] + human.col]
				human.calculateEmotion(tile);
			}
		});
	}
}