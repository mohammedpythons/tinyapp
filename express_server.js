const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const e = require("express");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
    "userone": {
        id: "userone",
        email: "userone@mail.com",
        password: 123
    },
    "usertwo": {
        id: "usertwo",
        email: "usertwo@mail.com",
        password: 321
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
    const user = users[user_id]
    const templateVars = { urls: urlDatabase, user_id, user};

    res.render("urls_index", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
    const user_id= req.cookies["user_id"];;
    let shortURL2 = req.params.shortURL;

    const templateVars = {shortURL: shortURL2, longURL: urlDatabase[shortURL2], user: users[user_id]};
   
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    
    
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    


    res.redirect(longURL);
  });

app.get("/register", (req, res) => {

    res.render("registration");
})

app.post("/urls", (req, res) => {
    let shortURl = generateRandomString();
    let longURL = req.body.longURL;
    urlDatabase[shortURl] = longURL;
    

    res.redirect(`/urls/${shortURl}`);
});

app.post(`/urls/:shortURL/delete`, (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];

    res.redirect("/urls");

});


app.post("/urls/:shortURL/update/", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
  
    
    res.redirect(`/urls`); 
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    res.cookie("username", username);
    res.redirect("/urls");

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
        res.status(400).send("you should not leave any input empty");
    }
    if (checkingObjectEmails(email, users)) {
        res.status(400).send("email does exist");
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
