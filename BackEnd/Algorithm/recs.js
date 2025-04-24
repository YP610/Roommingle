const User = require('../models/userSchema');


async function test(groupKey){
    const users = await User.find({ group: groupKey });
    console.log(users);
    return users;
}
module.exports=test;




