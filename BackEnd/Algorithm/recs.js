const User = require('../models/userSchema');

async function getGroup(groupKey){
    //COMPLETED-Gets group key
    const users = await User.find({ group: groupKey });
    console.log(users);
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
        score = score + firstval * firstval;
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
/*function residentialMatchList(userId){
    let buckets = getRec(userId);
    const sortedEntries = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0]);
    const orderedNames = [];
    for (const [key, names] of sortedEntries) {
        orderedNames.push(...names);
    return orderedNames;
}
}
*/


module.exports=getRec;




