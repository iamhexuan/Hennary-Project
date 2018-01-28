export default class Person {
	constructor({
    	row = -1,
    	col = -1,
    	low = 0,
    	midlow = 0,
    	midhigh = Number.Infinity,
    	high = Number.Infinity,
    	type = '',
    	id = ''} = {}){
		this.row = row;
		this.col = col;
		
		this.low = low;
		this.midlow = midlow;
		this.midhigh = midhigh;
		this.high = high;
		
		this.type = type;
		this.id = id;

		this.emotion = global.personEmotions.NEUTRAL;
		this.strength = 0;
        this.payAmount = 0;
	}

	
	timer() {
		// TODO call timer() on each tile, human, etc.
	    this.calculatingPay();
	}

	getSpriteString(){
		var imageName = 'human_' + (this.id % 10 + 1) + '.png';
		return imageName
	}

	calculatingPay(){
       switch(this.emotion){
       	case personEmotions.UNHAPPY: this.payAmount -= 1;
       	break;
       	case personEmotions.NEUTRAL: this.payAmount += 0;
       	break;
       	case personEmotions.HAPPY:   this.payAmount += 2;
       	break;
       }
	}

	actualPay(){
		var temp = this.payAmount;
		this.payAmount = 0;
        return temp;
	}

	calculateEmotion(tile){
		var strength = tile.getStrength();
		if(strength < this.low) this.emotion = personEmotions.UNHAPPY
			else if(strength < this.midlow) this.emotion = personEmotions.NEUTRAL
				else if(strength < this.midhigh) this.emotion = personEmotions.HAPPY
					else if(strength < this.high) this.emotion = personEmotions.NEUTRAL
						else this.emotion = personEmotions.UNHAPPY
		console.log('emotion', this.emotion);
		
		if (this.icon) {
			this.icon.destroy();
		}
		this.icon = game.add.sprite(size * this.col + 60, size * this.row - 10, this.emotion + '.png');
	}

	movingPosition(){
     // TODO move player to a random position 
	}


}