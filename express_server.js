const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
    const username = req.cookies["username"];
    const templateVars = {username};
    res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
    console.log(`------- ${req.cookies["username"]}`)

    
    const username = req.cookies["username"];
    const templateVars = { urls: urlDatabase, username};

    res.render("urls_index", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
    const username = req.cookies["username"];
    let shortURL2 = req.params.shortURL;

    const templateVars = {shortURL: shortURL2, longURL: urlDatabase[shortURL2], username};
   
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    
    
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    


    res.redirect(longURL);
  });


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

})

app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/urls");
})

app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`);
});
