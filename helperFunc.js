const checkingObjectEmails = (email, obj) => {

    for (let user in obj) {
        
        
        if (obj[user].email === email) {
             
            return true
        } 

    }
   

    
}

function generateRandomString() {
    let result = ""
    const Alph = "abcdefghijklmnopqrstuvwxyz123456789";
    for (let i = 0; i < 6; i++) {
        result += Alph.charAt(Math.floor(Math.random() * Alph.length));
    }

    return result;

}

module.exports = {generateRandomString, checkingObjectEmails}