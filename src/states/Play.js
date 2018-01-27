import Phaser from 'phaser'

//import Controllers from 'Controllers'

import { Tile } from 'Controllers'

export default class Play extends Phaser.State {
    create () {
        // Add your game content here    
        this.state.start('Controllers')  
        
        
          
        console.log('this', this, Tile)
    
    }

    update () {
        // Add your game logic here
    }
}
