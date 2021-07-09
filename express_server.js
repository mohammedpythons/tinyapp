//requirements for this project
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const { generateRandomString, checkingObjectEmails } = require('./helperFunc');
const { use } = require("chai");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

//Databases for the project

const urlDatabase = {
    "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "userone"} ,
  "9sm5xK": {longURL: "http://www.google.com", user_id: "usertwo"}
};

const users = {
    "userone": {
        id: "userone",
        email: "userone@mail.com",
        password: "$2b$10$NfasM028mpWmVux0epm.qOqODOU9cMuI6IVP17Fxx9g/tBhKle5zm"
    },
    "usertwo": {
        id: "usertwo",
        email: "usertwo@mail.com",
        password: "$2b$10$6AxLI6B5kB4Uic1MHKMI6uXmDM0C8JkDr7UurtKu8Njc5d5Yy2N5e"
    }
};


// the middlewares that used in this project
app.use(cookieSession({
    name: "sessions",
    keys: ["secret1", "secret2"]
}));

app.use(cookieParser("cookieParser"));
app.use(bodyParser.urlencoded({extended: true}));


//all the get requests start from here!
app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase)
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/urls/new", (req, res) => {
    const user_id= req.session.user_id;
    const templateVars = { user: users[user_id] };
    res.render("urls_new", templateVars);
});

// main page, if the user logged in render a specific page if not render another specific page
app.get("/urls", (req, res) => {

    const user_id= req.session.user_id;
    const obj = {}

    for (let key in urlDatabase) {
        if (urlDatabase[key][`user_id`] === user_id) {
            const shortURL = key;
            const longURL = urlDatabase[key].longURL;
            obj[shortURL] = longURL;
            }
        }

    const user = users[user_id];
    const templateVars = { urls: obj, user_id, user};

   
    if (user) {
        res.render("urls_index", templateVars);

    } else {
        res.render("homepage", templateVars);
    }

})
//get the request and check if the user exists or not to access the urls/:shortURL
app.get("/urls/:shortURL", (req, res) => {
    const user_id= req.session.user_id;;
    let shortURL2 = req.params.shortURL;
    if (user_id) {
        const templateVars = {shortURL: shortURL2, longURL: urlDatabase[shortURL2].longURL, user: users[user_id]};
       
        res.render("urls_show", templateVars);
    } else {
        res.redirect("/urls")
    }

});
// redirect the user to the original url
app.get("/u/:shortURL", (req, res) => {
    
    
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    


    res.redirect(longURL);
  });
// register form
app.get("/register", (req, res) => {

    res.render("registration", {user: null});
});
// login form
app.get('/login', (req, res) => {

    res.render("loginF", {user: null});
    
})





// all the post requests start from here!


app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    const user_id = req.session.user_id;
    const longURL = req.body.longURL;

    urlDatabase[shortURL] = {
        longURL,
        user_id
    }
    

    res.redirect(`/urls/${shortURL}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];

    res.redirect("/urls");

});


app.post("/urls/:shortURL/update/", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
  
    
    res.redirect(`/urls`); 
});
//creating new user for registration
app.post("/register", (req, res) => {
    const id = generateRandomString()
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

// I used req.body.password in the if statement because the hashing was creating a password even if i just insert the email and left the password empty

    if (!email || !req.body.password) {
       return res.status(400).send("you should not leave any input empty");
    }
    if (checkingObjectEmails(email, users)) {
       return res.status(400).send("email does exist");
    };
    users[id] = {
        id,
        email,
        password
    }


    
    req.session.user_id = id;
    res.redirect("/urls");
});

// chekin if the email exists in the Database or not to login
app.post("/login", (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   

   if (!email || !password) {
    return res.status(400).send("you should not leave any input empty");
};
   
       for (let user in users) {
           if (users[user].email === email && bcrypt.compareSync(password ,users[user].password))  {
               console.log(users[user].password)
               req.session.user_id = users[user].id;
        
               return res.redirect("/urls");
    
            } 
            
        }
        res.status(403).send("email or password is wrong");
        
        
        
});

app.post("/logout", (req, res) => {
    delete req.session.user_id;
    res.redirect("/urls");
});


app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
