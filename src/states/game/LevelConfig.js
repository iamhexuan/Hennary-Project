import Person from "./Person"
import Device from "./Device"
import Tile from "./Tile"

export default class LevelConfig {
	getConfig(levelNumber){
		var config = {
			1:{
				tiles:[
					new Tile({ row: 0, col: 0, type: tileTypes.WALL, permeability: 1, id: 1 }),
					new Tile({ row: 0, col: 1, type: tileTypes.WALL, permeability: 0, id: 2 }),
					new Tile({ row: 1, col: 0, type: tileTypes.WALL, permeability: 1, id: 1 }),
					new Tile({ row: 1, col: 1, type: tileTypes.WALL, permeability: 1, id: 1 }),
				],
				deviceStock:[
					[
					    new Device({
        					id: 1,
        					name: 'Router', 
        					type: deviceTypes.ROUTER, 
        					strength: 50, 
        					triggerStrength: 0
        				}),
    					3
    				],
					[
					    new Device({
        					id: 2,
        					name: 'Relay', 
        					type: deviceTypes.RELAY, 
        					strength: 20, 
        					triggerStrength: 10
        				}),
        				2
                    ]
				],
				humanStock:[
					new Person({
    					row: 0,
    					col: 0, 
    					low: 0,
    					midlow: 10,
    					midhigh:20,
    					high: 1000,
    					type: 'Boy',
    					id: 1
    				}),
    				new Person({
    					row: 0,
    					col: 1, 
    					low: 0,
    					midlow: 10,
    					midhigh:20,
    					high: 1000,
    					type: 'Boy',
    					id: 2
    				}),
    				new Person({
    					row: 1,
    					col: 0, 
    					low: 0,
    					midlow: 10,
    					midhigh:20,
    					high: 1000,
    					type: 'Boy',
    					id: 3
    				}),
				],
				cash: 100,
				goal: 1000
			}
		};
		return config[levelNumber]; 
	}
}
