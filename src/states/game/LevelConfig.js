import Person from "./Person"
import Device from "./Device"
import Tile from "./Tile"

export default class LevelConfig {
	getConfig(level_number){
		var config = {
			1: {
    			levelNumber: 1,
				dimension: [9, 11],
				walls:[
					new Tile({ row: 1, col: 1, type: tileTypes.WALL, permeability: 0, id: 1 }),
					new Tile({ row: 1, col: 2, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 1, col: 3, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 1, col: 4, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 1, col: 5, type: tileTypes.WALL, permeability: 0, id: 2 }),

					new Tile({ row: 2, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 2, col: 5, type: tileTypes.WALL, permeability: 0, id: 5 }),
					
					new Tile({ row: 3, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 3, col: 5, type: tileTypes.WALL, permeability: 0, id: 13 }),
					new Tile({ row: 3, col: 6, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 3, col: 7, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 3, col: 8, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 3, col: 9, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 3, col: 10, type: tileTypes.WALL, permeability: 0, id: 2 }),

					new Tile({ row: 4, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 4, col: 5, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 4, col: 10, type: tileTypes.WALL, permeability: 0, id: 5 }),

					new Tile({ row: 5, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 5, col: 5, type: tileTypes.WALL, permeability: 0, id: 10 }),
					new Tile({ row: 5, col: 10, type: tileTypes.WALL, permeability: 0, id: 5 }),

					new Tile({ row: 6, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 6, col: 10, type: tileTypes.WALL, permeability: 0, id: 5 }),

					new Tile({ row: 7, col: 1, type: tileTypes.WALL, permeability: 0, id: 5 }),
					new Tile({ row: 7, col: 10, type: tileTypes.WALL, permeability: 0, id: 5 }),

					new Tile({ row: 8, col: 1, type: tileTypes.WALL, permeability: 0, id: 3 }),
					new Tile({ row: 8, col: 2, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 3, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 4, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 5, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 6, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 7, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 8, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 9, type: tileTypes.WALL, permeability: 0, id: 4 }),
					new Tile({ row: 8, col: 10, type: tileTypes.WALL, permeability: 0, id: 6 }),

				],
				deviceStock:[
					[
					    new Device({
        					id: 1,
        					name: 'Router', 
        					type: deviceTypes.ROUTER, 
        					strength: 40, 
        					triggerStrength: 0
        				}),
    					3
    				],
					[
					    new Device({
        					id: 2,
        					name: 'Relay', 
        					type: deviceTypes.RELAY, 
        					strength: 30, 
        					triggerStrength: 10
        				}),
        				2
                    ]
				],
				humanStock:[
					new Person({
    					row: 5,
    					col: 6, 
    					low: 15,
    					midlow: 25,
    					midhigh:30,
    					high: 1000,
    					type: 'Boy',
    					id: 1
    				}),
    				new Person({
    					row: 3,
    					col: 6, 
    					low: 15,
    					midlow: 25,
    					midhigh:30,
    					high: 1000,
    					type: 'Boy',
    					id: 2
    				}),
    				new Person({
    					row: 7,
    					col: 2, 
    					low: 15,
    					midlow: 25,
    					midhigh:30,
    					high: 1000,
    					type: 'Boy',
    					id: 3
    				}),
				],
				cash: 0,
				goal: 1000
			},
			2: {
    			levelNumber: 2,
    			dimension: [10, 12],
				walls:[
					new Tile({ row: 1, col: 1, type: tileTypes.WALL, permeability: 0, id: 1 }),
                ],
			},
			3: {
    			levelNumber: 3,
    			dimension: [10, 12],
				walls:[
					new Tile({ row: 1, col: 1, type: tileTypes.WALL, permeability: 0, id: 1 }),
                ],
			}
		};
		return config[level_number]; 
	}
}
