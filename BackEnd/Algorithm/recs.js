const User = require('../models/userSchema');

async function getGroup(groupKey){
    //COMPLETED-Gets group key
    const users = await User.find({ group: groupKey });
    console.log(users);
    return users;
}


async function getScore(currentUser,otherUser){
    //NEED FUNCTION to go here to give the scores, only thing here is incrementing and fixing scores for ranges
    
    if(score>=100){
        score+=2;
    }
    let bucketScore=getBucket(score);
    return bucketScore;

}
function getBucket(score){
    //COMPLETED-will take our raw score and make into one of the bucket keys(ranges)
    if(score>=127){
        score=127;
    }
    else if(score>=102){
        score=102
    }
    else if(score>=100){
        score=100;
    }
    else if(score>=45){
        score=45;
    }
    else{
        score=0;
    }
    return score;
}
async function getRec(userId){
    //COMPLETED-will add the correct users to the correct list in the map depending on score
    const currentUser=await User.findById(userId).select('-password'); 
    const groupUsers=await getGroup(currentUser.group);
    const scoreMap=new Map();
    for(let i=0;i<groupUsers.length;i++){
        let key=await getScore(currentUser,groupUsers[i])
        if(!scoreMap.has(key)){
            scoreMap.set(key,[]);
        }
        scoreMap.get(key).push(groupUsers[i]);
    }
    console.log(scoreMap);
    return scoreMap;
}



module.exports=getRec;




