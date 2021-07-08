const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "userone"} ,
  "9sm5xK": {longURL: "http://www.google.com", user_id: "usertwo"}
};

const users = {
    "userone": {
        id: "userone",
        email: "userone@mail.com",
        password: "123"
    },
    "usertwo": {
        id: "usertwo",
        email: "usertwo@mail.com",
        password: "321"
    }
};


// helper functions



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

app.use(cookieParser("cookieParser"));
app.use(bodyParser.urlencoded({extended: true}));

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
    const user_id= req.cookies["user_id"];
    const templateVars = { user: users[user_id] };
    res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {

    const user_id= req.cookies["user_id"];
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

app.get("/urls/:shortURL", (req, res) => {
    const user_id= req.cookies["user_id"];;
    let shortURL2 = req.params.shortURL;

    const templateVars = {shortURL: shortURL2, longURL: urlDatabase[shortURL2].longURL, user: users[user_id]};
   
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    
    
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    


    res.redirect(longURL);
  });

app.get("/register", (req, res) => {

    res.render("registration", {user: null});
});

app.get('/login', (req, res) => {

    res.render("loginF", {user: null});
    
})

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    const user_id = req.cookies["user_id"];
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

app.post("/login", (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   

   if (!email || !password) {
    return res.status(400).send("you should not leave any input empty");
};
   
       for (let user in users) {
           if (users[user].email === email && users[user].password === password)  {
               res.cookie("user_id", users[user].id);
        
               return res.redirect("/urls");
    
            } 
            
        }
        res.status(403).send("email or password is wrong");
        
});

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
});

app.post("/register", (req, res) => {
    const id = generateRandomString()
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
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

    
    res.cookie("user_id", id);
    res.redirect("/urls");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
