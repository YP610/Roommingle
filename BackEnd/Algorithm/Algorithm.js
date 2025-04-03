const userMap={
    maleFreshman:[],
    femaleFreshman:[],
    H_maleF:[],
    H_femaleF:[],
    maleNF:[],
    femaleNF:[],
    H_maleNF:[],
    H_femaleNF:[]
};

function addUser(user){
    const gender=user.gender==="male"?"male":"female";
    const freshman=user.is_freshman;
    const honors=user.is_honors;

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
    userMap[groupKey].push(user);

}

module.exports={
    addUser
};
