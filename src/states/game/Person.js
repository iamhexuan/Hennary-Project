export default class Person {
	constructor(row,col,low,midlow,midhigh,high,type,id) {
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
		getStrength();
		calculateEmotion();		
	    calculatingPay();
	}

	getSpriteString(id){
		var imagePath = 'assets/images/human/';
		var imageName = 'human_' + (id % 10 + 1) + '.png';
		return imageName
	}

	calculatingPay(){
       switch(emotion){
       	case personEmotions.UNHAPPY: payAmount += 0;
       	break;
       	case personEmotions.NEUTRAL: payAmount += 1;
       	break;
       	case personEmotions.HAPPY:   payAmount += 2;
       	break;
       }
	}

	actualPay(){
		var temp = payAmount;
		payAmount = 0;
        return temp;
	}

	getStrength(){
     //    strength = tile().getStrength(row,col)
	}

	calculateEmotion(){
		if(strength < low) emotion = "unhappy"
			else if(strength < midlow) emotion = "netural"
				else if(strength < midhigh) emotion = "happy"
					else if(strength < high) emotion = "netural"
						else emotion = "unhappy"
	}

	movingPosition(){
     // TODO move player to a random position 
	}


}