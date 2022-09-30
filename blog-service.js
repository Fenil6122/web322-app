const fs = require("fs"); // required at the top of your module
const path = require("path");

let posts = [];
let categories = [];

module.exports = {
    initialize,
    getAllPosts,
    getPublishedPosts,
    getCategories
}

function initialize () {
    return new Promise((resolve, reject) => {
        let result = "";
        fs.readFile(path.join(__dirname, "data/posts.json"), 'utf8', (err, data) => {
            if (err) {
                result = "unable to read file";
            };
            posts = JSON.parse(data);
        });
        fs.readFile(path.join(__dirname, "data/categories.json"), 'utf8', (err, data) => {
            if (err) {
                result = "unable to read file";
            }
            categories = JSON.parse(data);
        });

        if(result.length) {
            reject(result);
        } 
    });
}

function getAllPosts() {
    return new Promise((resolve, reject) => {
        if(posts.length) resolve(posts)
        else reject("no results returned");
    })
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        var publishedPosts = posts.filter(post => post.published == true);
        if(publishedPosts.length==0) reject("no results returned");
        else resolve(publishedPosts);
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if(categories.length) resolve(categories)
        else reject("no results returned");
    })
}