export default class OurHuman {
	constructor(row,col,low,midlow,midhigh,high,type,status,id) {

		this.row = row;
		this.col = col;
		this.low = low;
		this.midlow = midlow;
		this.midhigh = midhigh;
		this.high = high;
		this.type = type;
		this.status = status;
		this.id = id;
		this.emotion = 0;
		this.strength = 0;
        this.payAmount = 0;

	}

	
	timer() {
		// TODO call timer() on each tile, human, etc.
	}

	getSprite(){
		switch(id){
			case 1:
            {
               
            }
			break;
			case 2:
            {

            }
			break;
			case 3:
            {

            }
			break;
			case 4:
            {

            }
			break;
			case 5:
            {

            }
			break;
            case 6:
            {

            }
			break;
		}
	}

	calculatingPay(){
       // TODO calculating the accumulated pay amount 
       switch(emotion){
       	case "unhappy": payAmount += 0;
       	break;
       	case "netural": payAmount += 1;
       	break;
       	case "happy":   payAmount += 2;
       	break;
       }
	}

	actualPay(){
		var temp = payAmount;
		payAmount = 0;
       return temp;
	}

	getStrength({row = 0, col =0} = {}){

    
	}

	calculateEmotion(){
		if(strength < low) emotion = "unhappy"
			else if(strength < midlow) emotion = "netural"
				else if(strength < midhigh) emotion = "happy"
					else if(strength < high) emotion = "netural"
						else emotion = "unhappy"

	    calculatingPay();
     // TODO calculate emotion based on wifi strength
	}

	movingPosition(){
     // TODO move player to a random position 
	}


}