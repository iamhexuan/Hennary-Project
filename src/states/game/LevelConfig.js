import Person from "./Person"
import Device from "./Device"
import Tile from "./Tile"

export default class LevelConfig {
	getConfig(levelNumber){
		var config = {
			1:{
				tiles:[
					new Tile(0, 0, tileTypes.WALL, 1, 1),
					new Tile(0, 1, tileTypes.WALL, 0, 2),
					new Tile(1, 0, tileTypes.WALL, 1, 1),
					new Tile(1, 1, tileTypes.FLOOR, 1, 1)
				],
				deviceStock:[
					[new Device(1, 'Router', deviceTypes.ROUTER), 3]
				],
				humanStock:[
					new Person(0,0, 0,10,20,1000,'Boy',1),
					new Person(0,1, 0,10,20,1000,'Boy',2),
					new Person(1,0, 0,10,20,1000,'Boy',3)
				],
				cash: 100,
				goal: 1000
			}
		};
		return config[levelNumber]; 
	}
}
