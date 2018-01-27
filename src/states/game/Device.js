export default class Device {
	constructor(id, name, type) {
    	this.id = id;
    	this.name = name;
    	this.type = type;
  	}

  	setPosition(row, col){
  		this.row = row;
  		this.col = col;
  	}

  	setProperties(cost = 10, strength = 100, triggerStrength = 0){
  		this.cost = cost;
  		this.strength = strength;
  		this.triggerStrength = triggerStrength;
  	}
	
	getIntType() {
		// TODO more types
		if (this.type == deviceTypes.RELAY) {
			return 1;
		}
		return 0;
	}
	
	getSpriteString(){
		var imageName = 'device_' + (this.getIntType() % 2 + 1) + '.png';
		return imageName
	}
}