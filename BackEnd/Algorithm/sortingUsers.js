const userMap = new Map([
    ["maleFreshman", []],
    ["femaleFreshman", []],
    ["H_maleFreshman", []],
    ["H_femaleFreshman", []],
    ["maleNF", []],
    ["femaleNF", []],
    ["H_maleNF", []],
    ["H_femaleNF", []]
]);


function getGroupKey(user){
    const gender=user.feed.gender==="male"?"male":"female";
    const grade=user.feed.year;
    const honors=user.feed.is_honors;

    let groupKey;

    if (honors) {
        if (grade === "Sophomore" || grade === "Junior" || grade === "Senior") {
            groupKey = gender === "male" ? "H_maleNF" : "H_femaleNF";
        } else {
            groupKey = gender === "male" ? "H_maleFreshman" : "H_femaleFreshman";
        }
    } else {
        if (grade === "Sophomore" || grade === "Junior" || grade === "Senior") {
            groupKey = gender === "male" ? "maleNF" : "femaleNF";
        } else {
            groupKey = gender === "male" ? "maleFreshman" : "femaleFreshman";
        }
    }
    
    console.log(`Assigned user to group: ${groupKey}`);
    return groupKey;
}

function addUser(user){
    const groupKey=getGroupKey(user);
    console.log(`Assigned user to group: ${groupKey}`);
    userMap.get(groupKey).push(user);
    console.log("Updated userMap:", userMap);

}

function removeUser(id){
    userMap.forEach((group, groupKey) => {
        // Find the index of the user based on the unique ID
        const index = group.findIndex(u=>u.user.toString(id));
        if(index!==-1){
            group.splice(index, 1);
        }

    });
    console.log("Updated userMap:", userMap);
}

function updateUser(user){
    const groupKey=getGroupKey(user);
    console.log(`Assigned user to group: ${groupKey}`);
    userMap.get(groupKey).push(user);
    console.log("Updated userMap:", userMap);


}
function tempClear(){
    userMap.clear();
}
function calculateClean(prof_questions){
    const scores=[
        prof_questions.q1,
        prof_questions.q2,
        prof_questions.q3,
        prof_questions.q4,
        prof_questions.q5
    ]
    let sum=0;
    for(let i=0;i<scores.length;i++){
        sum+=scores[i];
    }
    return sum;
}

module.exports={
    getGroupKey,
    addUser,
    removeUser,
    updateUser,
    tempClear,
    calculateClean
};

