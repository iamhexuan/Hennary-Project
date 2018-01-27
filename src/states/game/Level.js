import LevelConfig from "./LevelConfig"
import Tile from "./Tile"
export default class Level {
	constructor({
    	levelNumber = 0, 
    	goal = 0, 
    	cash = 0,
    	thumbnailPath = '',
    	thumbnailSize = [500, 400],
    	isLocked = false,
    } = {}) {
		let config = new LevelConfig().getConfig(levelNumber);
		this.humans = config.humanStock;
		this.tiles = this.getTiles(config.dimension, config.walls);
		this.deviceStock = config.deviceStock;
		this.cash = config.cash;
		this.goal = config.goal;
		this.thumbnail = {
    		'path' : thumbnailPath,
    		'width' : thumbnailSize[0],
    		'height': thumbnailSize[1],
		}
		this.isLocked = isLocked
	}

	getTiles(dimension, walls){
		var tiles = [];
		for(var i = 0; i < dimension[0]; i++){
			for(var j = 0; j < dimension[1]; j++){
				tiles.push(new Tile({ row: i, col: j, type: tileTypes.FLOOR, permeability: 0, id: 0 }));
			}
		}

		walls.forEach(function(item){
			tiles[item.row * dimension[0] + item.col] = item;
		})
		return tiles;
	}

	evaluate() {
		// TODO evaluate performance based on time
	}
	
	isWon() {
		this.cash >= this.goal
	}
	
	isLost() {
		this.cash <= 0
	}
	
	addCash(amount) {
		this.cash += amount
	}
	
	timer() {
		// TODO call timer() on each tile, human, etc.
	}
}