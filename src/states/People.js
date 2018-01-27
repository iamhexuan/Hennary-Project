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

	create(){

	}

    update(){
        
    }

	
	timer() {
		// TODO call timer() on each tile, human, etc.
	}

	getSprite(){
		// switch(id){
		// 	case 01:
  //           {
               
  //           }
		// 	break;
		// 	case 02:
  //           {

  //           }
		// 	break;
		// 	case 03:
  //           {

  //           }
		// 	break;
		// 	case 04:
  //           {

  //           }
		// 	break;
		// 	case 05:
  //           {

  //           }
		// 	break;
  //           case 06:
  //           {

  //           }
		// 	break;
		// }
	}

	calculatingPay(){
       // TODO calculating the accumulated pay amount 
	}

	actualPay(){
       // TODO pay the rent
	}

	get Strength(){
      // TODO get wifi strength\
      calculateEmotion();
      return this.strength;

	}

	calculateEmotion(){
     // TODO calculate emotion based on wifi strength
	}

	movingPosition(){
     // TODO move player to a random position 
	}


}