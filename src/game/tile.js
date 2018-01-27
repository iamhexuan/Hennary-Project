import Phaser from 'phaser'

export default {
    
    
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
                isAdjacentToWall: Boolean,
                hasSocket: Boolean,
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
        canvas,
        tiles,
        emitters,
    } = {}){

    }
    
    
}