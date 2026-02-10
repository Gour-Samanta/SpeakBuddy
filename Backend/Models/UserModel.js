const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        email:
        {
            type:String,
            required:[true , "Email is reuired"],
        },
        username:
        {
            type:String,
            required:[true , "Username required."],
        },
        password:
        {
            type:String,
            required:[true , "password required."],
        },
        language:
        {
            type:[String],
            required:[true , "select languages."],
        }

    }
);

UserSchema.pre("save" , async function(){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password , 12);
});

const User = mongoose.model("User" , UserSchema);

module.exports = User;