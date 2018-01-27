export default class Level {
	constructor(tiles, goal = 0, cash = 0, stock = [], humanStock = []) {
		this.tiles = tiles
		this.goal = goal;
		this.cash = cash;
    	this.stock = stock;
		this.humanStock = humanStock;
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