import 'pixi'
import 'p2'
import Phaser from 'phaser'

import Boot from './states/Boot'
import Preloader from './states/Preloader'
import Play from './states/Play'
import Controllers from './states/Controllers'

class Game extends Phaser.Game {
    constructor () {
        super(1024, 768, Phaser.AUTO, 'game')
        this.state.add('Boot', Boot)
        this.state.add('Preloader', Preloader)
        this.state.add('Play', Play)
        this.state.add('Controllers', Controllers)
        this.state.start('Boot')
    }
}

window.game = new Game()
