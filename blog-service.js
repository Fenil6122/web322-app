const fs = require("fs"); // required at the top of your module
const path = require("path");

let posts = [];
let categories = [];

module.exports = {
    initialize,
    getAllPosts,
    getPublishedPosts,
    getCategories,
    addPost,
    getPostsByCategory,
    getPostsByMinDate,
    getPostById
}

function initialize () {
    return new Promise((resolve, reject) => {
        let result = "";
        fs.readFile(path.join(__dirname, "data/posts.json"), 'utf8', (err, data) => {
            if (err) {
                result = "unable to read file";
            }
            else{
                posts = JSON.parse(data);
            }
        });
        fs.readFile(path.join(__dirname, "data/categories.json"), 'utf8', (err, data) => {
            if (err) {
                result = "unable to read file";
            }
            else{
                categories = JSON.parse(data);
            }
        });

        if(result.length) 
        {
            reject(result);
        } 
    });
}

function getAllPosts() {
    return new Promise((resolve, reject) => {
        if(posts.length)
        {
            resolve(posts)
        }
        else 
        {
            reject("no results returned");
        }
    })
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        var publishedPosts = posts.filter(post => post.published == true);
        if(publishedPosts.length==0) 
        {
            reject("no results returned");
        }
        else
        {
            resolve(publishedPosts);
        }
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if(categories.length)
        {
            resolve(categories)
        }
        else
        { 
            reject("no results returned");
        }
    })
}

function addPost(postData){
    return new Promise((resolve, reject) => {
        if(postData.published === undefined) {
            postData.published = false;
        } else postData.published = true;

        postData.id = posts.length + 1;

        posts.push(postData);

        resolve(postData);
    })
}


function getPostsByCategory (category){
    return new Promise((resolve, reject) => {
        const categoryPosts = posts.filter((post) => {
            return post.category == category;
        })

        categoryPosts.length > 0 ? resolve(categoryPosts) : reject("no results returned");
    })
}

function getPostsByMinDate (minDateStr){
    return new Promise((resolve, reject) => {
        const minDatePosts = posts.filter((post) => {
            return new Date(post.postDate) >= new Date(minDateStr);
        })

        minDatePosts.length > 0 ? resolve(minDatePosts) : reject("no results returned");
    })
}

function getPostById (id){
    return new Promise((resolve, reject) => {
        const idPosts = posts.filter((post) => {
            return post.id == id;
        })

        idPosts.length > 0 ? resolve(idPosts) : reject("no results returned");
    })
}