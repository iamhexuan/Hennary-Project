import LevelConfig from "./LevelConfig"

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
		this.tiles = config.tiles;
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