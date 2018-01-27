import Person from "./Person"
import Device from "./Device"

const levelConfig = {
	1 : {
		tiles:[

		],
		deviceStock:[

		],
		humanStock:[
			new Person(0,0, 0,10,20,1000,'Boy',1),
			new Person(0,1, 0,10,20,1000,'Boy',2),
			new Person(1,0, 0,10,20,1000,'Boy',3)
		],
		cash: 100,
		goal: 1000
	}
}

export default class Level {
	constructor(levelNumber, goal = 0, cash = 0) {
		let config = levelConfig[levelNumber];
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