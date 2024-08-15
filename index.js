import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import { body, validationResult } from 'express-validator';

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });
app.get("/login", (req, res) => {
  res.render("login.ejs", { userInput: {}, error: null });
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.get("/todo", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("todo.ejs");
    } else {
      res.redirect("/login");
    }
  });



////////////////SUBMIT GET ROUTE/////////////////


// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/todo",
//     failureRedirect: "/login",

//   })
// );
app.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      // Authentication failed
      return res.render('login.ejs', { 
        error: info.message || 'Authentication failed',
        userInput: { username: req.body.username }
      });
    }
    req.logIn(user, (err) => {
      if (err) { 
        return next(err); 
      }
      return res.redirect('/todo');
    });
  })(req, res, next);
});

const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('username').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
];

app.post("/register", validateRegistration, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(400).render('register.ejs', { 
      errors: errors.array(), 
      data: req.body, 
      showLogin: false });
   
  }
  
  console.log(req.body)
  const name = req.body.name
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      // Email already exists, pass a flag to show the login button
      return res.status(400).render('register.ejs', { 
        errors: [{ msg: "Email already in use" }], 
        userInput: req.body, 
        showLogin: true // This flag will be used in the template to show the login button
      });
      
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).render('register.ejs', { 
            errors: [{ msg: "Error during registration" }], 
            data: req.body, 
            showLogin: false });
        } else {
          const result = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.error("Error logging in user:", err);
              return res.status(500).render('register.ejs', { 
                errors: [{ msg: "Error during login" }], 
                data: req.body, 
                showLogin: false });
            }
            console.log("success");
            res.redirect("/todo");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).render('register.ejs', { 
      errors: [{ msg: "Server error" }], 
      data: req.body,
      showLogin: false });
  }
}); 

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log('User found:', user); // Debugging log
        
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              console.log('Password valid, logging in user.'); // Debugging log
              return cb(null, user);
            } else {
              console.log('Password invalid.'); // Debugging log
              return cb(null, false, { message: 'Invalid email or password' });
            }
          }
        });
      } else {
        console.log('User not found.'); // Debugging log
        return cb(null, false, { message: 'Invalid email or password' });
      }
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  })
);


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
