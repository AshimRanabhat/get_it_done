const pool = require('./connectDb');

async function userExists(email){
    try{
        let user = await pool.query("SELECT email FROM user_data WHERE email=$1", [email]);

        if(user.rows.length == 0){ return false; }
        else{ return true; }
    }catch(err){
        console.log("Failed to check if user exists");
        throw(err);
    }
}

async function createUser(email, password, name){
    try{
        if (await userExists(email)){ return false; };
        await pool.query("INSERT INTO user_data(email, password, name) VALUES($1, $2, $3) ", [email, password, name]);
        return true;
    }catch(err){
        console.log("Failed to create user", err);
        return false;
    }
}

async function getUserInformation(email){
    try{
        let result = await pool.query('SELECT email, password, name FROM user_data WHERE email=$1', [email]);
        return result.rows;
    }catch(err){
        console.log("Failed to get user information", err);
        return false;
    }
}

async function deleteUser(email){
    try{
        if (await !userExists(email)){ return false; }
        await pool.query('DELETE FROM user_data WHERE email=$1', [email]);
        return true;
    }catch(err){
        console.log('Failed to delte user', err);
        return false;
    }
}

async function getSuccessfulDays(email){
    try{
        let result = await pool.query('SELECT successful_days FROM user_data WHERE email=$1', [email]);
        return result.rows[0];
    }catch(err){
        console.log("Failed to get successfulDays ", err);
        return false;
    }
}

async function appendSuccessfulDay(email, day){
    try{
        await pool.query(
            'UPDATE user_data SET successful_days = array_append(successful_days, $1) WHERE email = $2',
            [day, email]
            );
        return true;
    }catch(err){
        console.log('Failed to append day', err);
        return false;
    }
}

module.exports = {
    userExists,
    createUser,
    getUserInformation,
    deleteUser,
    getSuccessfulDays,
    appendSuccessfulDay
}