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
	
	getSpriteString(id){
		var imageName = 'device_' + (id % 10 + 1) + '.png';
		return imageName
	}
}