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
    const freshman=user.feed.is_freshman;
    const honors=user.feed.is_honors;

    let groupKey;


    if(!honors){
        if(!freshman){
            if(gender==="male"){
                groupKey="maleNF";
            }
            else{
                groupKey="femaleNF";
            }
        }
        else if(gender==="male"){
            groupKey="maleFreshman";
        }
        else{
            groupKey="femaleFreshman";
        }
    }
    else if(!freshman){
        if(gender==="male"){
            groupKey="H_maleNF";
        }
        else{
            groupKey="H_femaleNF";
        }
    }
    else if(gender==="male"){
        groupKey="H_maleFreshman";
    }
    else{
        groupKey="H_femaleFreshman";
    }
    console.log(`Assigned user to group: ${groupKey}`)
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

module.exports={
    getGroupKey,
    addUser,
    removeUser,
    updateUser,
    tempClear
};

