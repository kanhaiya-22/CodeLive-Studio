const express = require('express');
const app = express();
const mongoose = require("mongoose");

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const homeRouter = require("./routes/home");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require('body-parser');

const users = require("./models/users");

const url = "mongodb+srv://kanhaiyamittal26_db_user:%23Kmittal8445@codelive.awtcsgh.mongodb.net/code_editor?retryWrites=true&w=majority&appName=CodeLive";
const dbName = "code_editor";
const port = process.env.PORT || 8080;
const expire_duration = 7 * 60 * 60 * 1000; // 7 hours

async function main() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to " + dbName);
    
    var store = new MongoDBStore({
      uri: url,
      collection: "mySessions",
    });

    store.on("error", function (error) {
      console.log(error);
    });

    app.use(
      session({
        secret: "secert/key for signing cookie",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: expire_duration },
        store: store,
      })
    );


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(__dirname + "/public"));
    app.set("view engine", "ejs");

    app.use("/login", loginRouter);
    app.use("/signup", signupRouter);
    app.use("/home", homeRouter);

    // Root redirect
    app.get("/", (req, res) => {
      res.redirect("/home");
    });

    app.listen(port, () => {
      console.log("Listening on port " + port);
    });

  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

main();
