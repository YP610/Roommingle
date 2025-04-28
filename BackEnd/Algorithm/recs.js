const User = require('../models/userSchema');

async function getGroup(groupKey, currentUserId) {
    const users = await User.find({ 
        group: groupKey,
        _id: { $ne: currentUserId,
               $nin: usersSeenIds 
            } 
    });
    return users;
}


async function getScore(currentUser,otherUser){
    //10,5,1
    const firstval = 10;
    const secondval = 5;
    const thirdval = 1;
    const userResidenceRankings = currentUser.feed.rank; 
    const otherResidenceRankings = otherUser.feed.rank; 
    let score = 0;
    if (userResidenceRankings[0] == otherResidenceRankings[0]){
        score = score + firstval * firstval+2;
    }
    if (userResidenceRankings[1] == otherResidenceRankings[0]){
        score = score + firstval * secondval;
    }
    if (userResidenceRankings[2] == otherResidenceRankings[0]){
        score = score + firstval * thirdval;
    }
    if (userResidenceRankings[0] == otherResidenceRankings[1]){
        score = score + firstval * secondval;
    }
    if (userResidenceRankings[1] == otherResidenceRankings[1]){
        score = score + secondval * secondval;
    }
    if (userResidenceRankings[2] == otherResidenceRankings[1]){
        score = score + thirdval * secondval;
    }
    if (userResidenceRankings[0] == otherResidenceRankings[2]){
        score = score + firstval * thirdval;
    }
    if (userResidenceRankings[1] == otherResidenceRankings[2]){
        score = score + thirdval * secondval;
    }
    if (userResidenceRankings[2] == otherResidenceRankings[2]){
        score = score + thirdval * thirdval;
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
    const groupUsers=await getGroup(currentUser.group,currentUser);
    const scoreMap=new Map();
    let seenUsers=[];
    for(let i=0;i<groupUsers.length;i++){
        let key=await getScore(currentUser,groupUsers[i])
        if(!scoreMap.has(key)){
            scoreMap.set(key,[]);
        }
        scoreMap.get(key).push(groupUsers[i]);
    }
    console.log(scoreMap)
    const orderedUsers=filter(currentUser,scoreMap);
    console.log(orderedUsers)
    return orderedUsers;
}
async function filter(userId,scoreMap){
    let myScore=userId.livingConditions.cleanliness_score;
    const sortedKeys = Array.from(scoreMap.keys()).sort((a, b) => b - a);
    const orderedUsers=[];
    for(let key of sortedKeys){
        let usersAtScore=scoreMap.get(key);
        for(let i=0;i<usersAtScore.length;i++){
            usersAtScore[i].cleanDiff=Math.abs(myScore-usersAtScore[i].livingConditions.cleanliness_score);
        }
        usersAtScore.sort((a, b) => a.cleanDiff - b.cleanDiff);
        orderedUsers.push(...usersAtScore);
    }
    return orderedUsers;
}
async function lastSeen(lastUser){
    usersSeen=[];
    for(let i=0;i<orderedUsers;i++){
        usersSeen.push(orderedUsers[i])
        if(orderedUsers[i]==lastUser){
            break;
        }
    }
}

module.exports=getRec;




