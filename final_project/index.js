const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// -----------------------AXIOS----------------------------
const axios = require('axios').default;
const axiosRouter = express.Router();

axiosRouter.get("/", function (req, res) {
  //Write your code here
  axios.get("http://localhost:5000/")
    .then((result) => {
        console.log(result.data);
        return res.send(result.data);
    })
    .catch((error) => {
        console.error(error);
        return res.send(error);
    });
  //return res.status(300).json({message: "Yet to be implemented"});
});

axiosRouter.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  axios.get("http://localhost:5000/isbn/" + isbn)
    .then((result) => {
        console.log(result.data);
        return res.send(result.data);
    })
    .catch((error) => {
        console.error(error);
        return res.send(error);
    });
  //return res.status(300).json({message: "Yet to be implemented"});
});

axiosRouter.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  axios.get("http://localhost:5000/author/" + author)
    .then((result) => {
        console.log(result.data);
        return res.send(result.data);
    })
    .catch((error) => {
        console.error(error);
        return res.send(error);
    });
  //return res.status(300).json({message: "Yet to be implemented"});
});

axiosRouter.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  axios.get("http://localhost:5000/title/" + title)
    .then((result) => {
        console.log(result.data);
        return res.send(result.data);
    })
    .catch((error) => {
        console.error(error);
        return res.send(error);
    });
  //return res.status(300).json({message: "Yet to be implemented"});
});
// -----------------------AXIOS----------------------------

const PORT =5000;

app.use("/axios", axiosRouter);
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
