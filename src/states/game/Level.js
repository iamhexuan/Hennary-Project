import LevelConfig from "./LevelConfig"

export default class Level {
	constructor(levelNumber, goal = 0, cash = 0) {
		let config = new LevelConfig().getConfig(levelNumber);
		this.humans = config.humanStock;
		this.tiles = config.tiles;
		this.deviceStock = config.deviceStock;
		this.cash = config.cash;
		this.goal = config.goal;
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