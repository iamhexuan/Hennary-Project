import LevelConfig from "./LevelConfig"
import Tile from "./Tile"
import Device from "./Device"

export default class Level {
	constructor({
    	levelNumber = 0, 
    	goal = 0, 
    	cash = 0,
    	thumbnailPath = '',
    	thumbnailSize = [500, 400],
    	isLocked = false,
    } = {}) {
        this.moneybar = undefined
		let config = new LevelConfig().getConfig(levelNumber);
		this.levelNumber = levelNumber;
		this.humans = config.humanStock;
		this.tiles = this.getTiles(config.dimension, config.walls);
		this.deviceStock = config.deviceStock;
		this.emitters = [];
		this.cash = config.cash;
		this.goal = config.goal;
		this.thumbnail = {
    		'path' : thumbnailPath,
    		'width' : thumbnailSize[0],
    		'height': thumbnailSize[1],
		}
		this.isLocked = isLocked
		this.dimension = config.dimension
		// this.initCashSprite();
	}


	initCashSprite(){
		this.hud = game.add.group();
		this.hud.create(0,0,'money_3.png');

		if (!this.moneyBar) this.moneyBar = game.add.sprite(0,0,'money_2.png');
		this.moneyBar.scale.x = 0;
		this.moneyBar.maxWidth = this.moneyBar.width;
		this.hud.add(this.moneyBar)

		this.hud.create(0,0,'money_1.png');
		
		// init emotion
		this.onDragStop([])
	}

	updateCashSprite(){
		var newWidth;
    	if (!!this.moneyBar){
    		var newScale = (this.cash / this.goal) / (15 / 13);
    		if(newScale > 1){
				newScale = 1;
			}
    	    game.add.tween(this.moneyBar.scale).to( { x: newScale, y: 1 }, 0, Phaser.Easing.Linear.None, true)
    	}
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
		this.cash += amount;
		this.updateCashSprite();
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