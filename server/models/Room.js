const mongoose = require('mongoose')

let RoomSchema = new mongoose.Schema(
    {
        room_number: Number,
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);

RoomSchema.methods.join = function(user) {
	this.group.push(user);
	return this.save();
}
RoomSchema.methods.leave = function(user) {
	for(var i = 0; i < group.length-1; i++){
		if(group[i] === user)
			arr.splice(i, 1);
	}
	return this.save();
}

module.exports = mongoose.model('Room', RoomSchema)