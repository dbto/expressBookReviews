const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  filtered_books = Object.values(books).filter((book) => book.author === author);

  return res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  filtered_books = Object.values(books).filter((book) => book.title === title);

  return res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = {
    "reviews": books[isbn].reviews
  };

  return res.send(reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/async/', async (req, res) => {
    try {
        // Wrap the books in Promise
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("No books");
                }
            });
        };

        const bookList = await getBooks();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    } 
});

public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        // Wrap the books in Promise
        const getBook = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("No book with isbn: " + isbn);
                }
            });
        };

        const book = await getBook(isbn);
        res.send(book);
    } catch (error) {
        res.status(500).json({message: error});
    } 
});

public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        // Wrap the books in Promise
        const getBook = (author) => {
            return new Promise((resolve, reject) => {
                if (books) {
                    filtered_books = Object.values(books).filter((book) => book.author === author);
                    resolve(filtered_books);
                } else {
                    reject("No books");
                }
            });
        };

        const book = await getBook(author);
        res.send(book);
    } catch (error) {
        res.status(500).json({message: error});
    } 
});

public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        // Wrap the books in Promise
        const getBook = (title) => {
            return new Promise((resolve, reject) => {
                if (books) {
                    filtered_books = Object.values(books).filter((book) => book.title === title);
                    resolve(filtered_books);
                } else {
                    reject("No books");
                }
            });
        };

        const book = await getBook(title);
        res.send(book);
    } catch (error) {
        res.status(500).json({message: error});
    } 
});

module.exports.general = public_users;
