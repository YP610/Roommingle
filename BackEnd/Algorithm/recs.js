const User = require('../models/userSchema');

async function getGroup(groupKey){
    const users = await User.find({ group: groupKey });
    console.log(users);
    return users;
}
async function sortGroup(users){
    
}



module.exports=test;




