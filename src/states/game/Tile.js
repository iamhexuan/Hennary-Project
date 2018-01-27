import Phaser from 'phaser'

export default class Tile {
        /*
        constructor () {
            super()
        }
        */
    
        // @param { Array } tiles of tile
        
        /* 
            canvas: {
                tileSize: Number, // in px,
                width: Number, // number of tiles in horizontal,
                height: Number, // number of tiles in vertical,
            }, 
               
            tiles: [
                {
                    row: Number, // from 0
                    col: Number, // from 0
                    type: String, // 'wall', 'floor', 'invisible', 'inaccessible'.... ,
                    // isAdjacentToWall: Boolean,
                    // hasSocket: Boolean,
                    permeability: Number, // between 0 and 1. If 1, it's air. If 0, it's iron...
                    signalStrength: NaN | Number, // the current signal strength
                }, ...
            ],
            
            emitters: [
                {
                    row: Number,
                    col: Number,
                    strength: Number,
                    triggerStrength: Number, // if > 0, it is as relay
                    visibility: Boolean, 
                    effectiveToTiles: 'all' | Array, // Optional. For future pseudo-emitters from 'mirror'. Array of row, col pairs that this emitter has effects to //never effective to 'invisible', 'inaccessible' tiles
                },
            ],
                
        */
        
        // @return { Array } - array of tiles
        
        updateTilesSignalStrength({
            canvas = {},
            tiles = [],
            emitters = [],
        } = {}){
            const tile_size = !!canvas.tileSize ? canvas.tileSize : 0   
            const rows = !!canvas.rows ? canvas.rows : 0
            const cols = !!canvas.cols ? canvas.cols : 0
            
            return new Promise((resolve, reject) => {
                if (!tile_size || !rows || !cols) return
                if (!Array.isArray(emitters) || emitters.length === 0) return
                
                let second_round_emitters = []
                
                emitters.forEach((emitter, idx) => {
                    if (!!emitter.triggerStrength){
                        this.second_round_emitters.push(emitter)
                    }else{
                        for (let row = 0; row < rows; row++){
                            for (let col = 0; col < cols: col++){
                                
                                // tile VS emitter
                                let tile = this.getTileAtPosition({
                                    tiles: tiles,
                                    row: row,
                                    col: col,
                                })
                                
                                const newSingleStrength = (() => {
                                    
                                }())
                                
                                if (idx === 0){
                                    // this should reset the 'signalStrength'
                                }else{
                                    // this will only overwrite 
                                }
                                    
                            }                        
                            
                        }
                    }
                })
              
            
                     
                this.updateA()
            })
            
        }
        
        // @return { Object } - that tile. If empty, return null
        getTileAtPosition({
            tiles = [],
            row = 0,
            col = 0,
        } = {}){
            tiles.forEach(tile => {
                if (tile.row === row && tile.col === col) return tile
            })
            return null
        },
        
        // @return { Number } decayed number of signal
        decaySingal({
            
        }){
            
        }
        
    
      
}