//import Phaser from 'phaser'

export default class Tile {
    
    constructor(num) {
        this.num = num
    }
    
    // for test only 
    runTileTests(){
        const canvas = {
            tileSize : 10,
            rows : 10,
            cols : 10,
        }
        
        const emitters = [
            {
                row: 2,
                col: 3,
                signalStrength: 20,
                triggerStrength: 3,
            },
            {
                row: 9,
                col: 5,
                signalStrength: 50,
                triggerStrength: 0,
            },
        ]
        
        const pm = {
            '4': {
                '5': 0.5,
                '6': 0.5,
                '7': 0.5,
            },
            '5': {
                '5': 0.3,
            },
            '6': {
                '5': 0.3,
            },
        }
        
        let _tiles = []
        

        for (let r = 0; r < canvas.rows; r++){
            for (let c = 0; c < canvas.cols; c++){
                _tiles.push({
                    row: r,
                    col: c,
                    permeability: (!!pm[r] && !!pm[r][c]) ? pm[r][c] : 0,
                })
            }
        }
        
        this.updateTilesSignalStrength({
            canvas: canvas,
            tiles: _tiles,
            emitters: emitters,
        })
    }
    

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
            
            let first_round_count = 0
            
            let updatedTileSingalStrength = {}
            
            emitters.forEach((emitter, idx) => {
                if (!!emitter.triggerStrength){
                    second_round_emitters.push(emitter)
                }else{                        
                    let tilesWithNewSingleStrength = {}
                    for (let row = 0; row < rows; row++){
                        for (let col = 0; col < cols; col++){
                            
                            // tile VS emitter
                            let tile = this.getTileAtPosition({
                                tiles: tiles,
                                row: row,
                                col: col,
                            })
                            
                            const rawSignalStrength = emitter.strength
                                                            
                            // @return [ permeability * length ]
                            const blocker_permeabilities = this.getBlockersPermeabilityOfATileFromAEmitter({
                                tiles: tiles,
                                emitter: emitter,
                                row: row,
                                col: col,
                            })
                            
                            const square_distance = Math.pow(emitter.row - row, 2) + Math.pow(emitter.col - col, 2)
                            
                            const new_signalStrength = this.calcDecaySingal({
                                rawSignalValue : rawSignalStrength,
                                squareDistance: square_distance,
                                coefficient: 0.2, // some random value to adjust
                                permeabilities: blocker_permeabilities, // array of numbers between 0 and 1
                            })
                            
                            console.log('blocker_permeabilities', row, col, blocker_permeabilities, new_singleStrength)
                            // tilesWithNewSingleStrength.push()
                            
                            if (!tilesWithNewSingleStrength[row]){
                                tilesWithNewSingleStrength[row] = {}
                            }
                            tilesWithNewSingleStrength[row][col] = new_signalStrength
                                                                   
                        }  // end for col              
                    } // end for row
                    if (first_round_count === 0){
                        // this should reset the 'signalStrength'
                        updatedTileSingalStrength = tilesWithNewSingleStrength
                    }else{
                        // this will only overwrite 
                        Object.keys(tilesWithNewSingleStrength).forEach(row => {
                            if (typeof tilesWithNewSingleStrength[row] === 'object'){
                                if (!updatedTileSingalStrength[row]){
                                    updatedTileSingalStrength[row] = {}
                                }
                                Object.keys(tilesWithNewSingleStrength[row]).forEach(col => {
                                    if (!updatedTileSingalStrength[row][col] || 
                                        tilesWithNewSingleStrength[row][col] > updatedTileSingalStrength[row][col]
                                    )
                                        updatedTileSingalStrength[row][col] = tilesWithNewSingleStrength[row][col]
                                })
                            }
                        })
                    }    
                    first_round_count++     
                }
            }) // end emitters.forEach (first round)
            
            second_round_emitters.forEach(emitter => {
                
            })
            
            resolve(
                this.injectNewSignalStrengthToTiles({
                    sourceTiles: tiles,
                    newData: updatedTileSingalStrength,
                })
            )                
        }) // end return new Promise
    }
    
    // @return { Array } - array of numbers between 0 and 1.
    getBlockersPermeabilityOfATileFromAEmitter({
        emitter = {},
        tiles = [],
        row = 0, // of tile
        col = 0, // of tile
    } = {}){

        // invalid case, should not happen
        if (emitter.row - row === 0 && emitter.col - col === 0){
            return []
        }
        
        // y = grad * x + offset
        // row = grad * col + offset
        if (emitter.row - row !== 0 && emitter.col - col !== 0){
            const grad = (emitter.row - row) / (emitter.col - col)
            const offset = emitter.row - emitter.col * grad
            
            // [start, end]
            const row_range = [emitter.row, row].sort((a,b) => a - b)
            const col_range = [emitter.col, col].sort((a,b) => a - b)
            
            let _blockers_perm = [] // [ permeability / percentage ]
            
            for (let _row = row_range[0]; _row <= row_range[1]; _row++){
                
                const row_bounds = [_row - 0.5, _row + 0.5]
                
                const row_intercepts_at_cols = row_bounds.map(_r => (_r - offset) / grad).sort((a,b) => a - b)
                
                for (let _col = col_range[0]; _col <= col_range[1]; _col++){
                    
                    const _tile = this.getTileAtPosition({
                        tiles : tiles,
                        row : _row,
                        col : _col,
                    })
                    
                    
                    const tile_permeability = _tile.permeability !== 'undefined' ? _tile.permeability : 1
                    
                    if (tile_permeability === 1) break; // no need do extra calculation
                                                                                                                    
                    const col_bounds = [_col - 0.5, _col + 0.5]
                    
                    const is_total_miss = (
                        col_bounds[1] < row_intercepts_at_cols[0] || 
                        col_bounds[1] > row_intercepts_at_cols[0]
                    )
                    
                    if (is_total_miss) break; // no need do extra calculation 
                    
                    const is_complete_pass = 
                        (
                            col_bounds[0] <= row_intercepts_at_cols[0] && 
                            col_bounds[1] >= row_intercepts_at_cols[1]
                        ) || (
                            col_bounds[0] >= row_intercepts_at_cols[0] && 
                            col_bounds[1] <= row_intercepts_at_cols[1]
                        )
                        
                    if (is_complete_pass){
                        _blockers.push(tile_permeability)
                    }else{
                        let col_intercepts_at_rows = col_bounds
                            .map(_c => grad * _c + offset).sort((a,b) => a - b)
                            
                        const vert_distance = col_intercepts_at_rows[1] - col_intercepts_at_rows[0]
                        
                        let length = Math.sqrt(vert_distance * vert_distance + 1)
                        
                        // get the actual vertical distance
                        
                        let _row_inside_col_intercept = row_bounds
                             .filter(_r => _r > col_intercepts_at_rows[0] && _r < col_intercepts_at_rows[1])
                        
                        if (_row_inside_col_intercept.length > 0){
                           _row_inside_col_intercept = _row_inside_col_intercept[0] 
                        }else{
                            break; // should not happen
                        }
                        
                        let _col_intercept_inside_row_bounds = col_intercepts_at_rows
                             .filter(_r => _r > row_bounds[0] && _r < row_bounds[1])
                        
                        if (_col_intercept_inside_row_bounds.length > 0){
                           _col_intercept_inside_row_bounds = _col_intercept_inside_row_bounds[0] 
                        }else{
                            break; // should not happen
                        }
                        
                       length = Math.abs(_col_intercept_inside_row_bounds - _row_inside_col_intercept) * length
                        
                       if (length > 1) length = 1
                       if (length > 0) _blockers.push(tile_permeability / length)                         
                    }
                }
            }
                                                    
            return _blockers_perm
            
        }
        
        // y = y_val
        if(emitter.row - row !== 0 && emitter.col === 0){
            const _col = emitter.col 
            const row_bound = [emitter.row, row].sort((a,b) => a - b)
            let _blockers = []
            for (let _row = row_bound[0]; _row <= row_bound[1]; row++){
                const _tile = this.getTileAtPosition({
                    tiles : tiles,
                    row : _row,
                    col : _col,
                })
                if (_row !== emitter.row && _col !== emitter.col){
                    _blockers.push(tile)
                }
            }
            return _blockers
                .map(_blk_tile => _blk_tile.permeability)
                .filter(pm => typeof pm === 'number' && !Number.isNaN(pm) && pm !== 1)
        }                                       
            
        // x = x_val    
        if (emitter.row - row === 0 && emitter.col !== 0){
            const _row = emitter.row
            const col_bound = [emitter.col, col].sort((a,b) => a - b)
            let _blockers = []
            
            for (let _col = col_bound[0]; _col <= col_bound[1]; col++){
                const _tile = this.getTileAtPosition({
                    tiles : tiles,
                    row : _row,
                    col : _col,
                })
                if (_row !== emitter.row && _col !== emitter.col){
                    _blockers.push(tile)
                }
            }
            return _blockers
                .map(_blk_tile => _blk_tile.permeability)
                .filter(pm => typeof pm === 'number' && !Number.isNaN(pm) && pm !== 1)
        }                                    
        
    }
    
    injectNewSignalStrengthToTiles({
        sourceTiles = [],
        newData = {}, // { row: { col: singleStrength }, row: { col: singleStrength } }
    }){
        
    }        
    
    // @return { Object } - that tile. If empty, return null
    getTileAtPosition({
        tiles = [],
        row = 0,
        col = 0,
    } = {}){
        
        let tile = null
        
        for (let idx = 0; idx < tiles.length; idx ++){
            if (tiles[idx].row === row && tiles[idx].col === col){
                tile = tiles[idx]
                break
            }
        }
        
        return tile
    }
    
    // @return { Number } decayed number of signal
    calcDecaySingal({
        rawSignalValue = 0,
        squareDistance = 0,
        coefficient = 0.2,
        permeabilities = [], // between 0 and 1
    } = {}){
        if (distance === 0) return rawSignalValue
        if (coefficient === 0) return 0
        
        // will be a value between 0 and 1
        const agg_perm = (Array.isArray(permeabilities) && permeabilities.length > 0) ? (
            permeabilities.reduce((ttl, num) => {
                ttl * num 
                return num
            }, 1)
        ) : 1            
        return rawSignalValue * coefficient / squareDistance * agg_perm
    }
      
}