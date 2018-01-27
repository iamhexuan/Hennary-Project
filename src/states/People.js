export default class OurHuman {
	constructor(row,col,low,midlow,midhigh,high,type,id) {

		this.row = row;
		this.col = col;
		this.low = low;
		this.midlow = midlow;
		this.midhigh = midhigh;
		this.high = high;
		this.type = type;
		this.id = id;
		this.emotion = 0;
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
     switch(id){
         case 0:return "../../../assets/images/human/b1.png"
       break;
         case 1:return "../../../assets/images/human/b2.png"
       break;
         case 2:return "../../../assets/images/human/b3.png"
       break;
         case 3:return "../../../assets/images/human/b4.png"
       break;
         case 4:return "../../../assets/images/human/b5.png"
       break;
         case 5:return "../../../assets/images/human/g1.png"
       break;
         case 6:return "../../../assets/images/human/g2.png"
       break;
         case 7:return "../../../assets/images/human/g3.png"
       break;
         case 8:return "../../../assets/images/human/g4.png"
       break;
         case 9:return "../../../assets/images/human/g5.png"
       break;
       default: return null;

     }
	}

	calculatingPay(){
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