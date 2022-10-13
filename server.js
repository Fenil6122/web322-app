/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Fenil KetanKumar Patel 
*  Student ID: 134516210 
*  Date: 30th Sept,2022
*
*  Online (Cyclic) Link: https://zany-pink-rabbit-gear.cyclic.app
*
********************************************************************************/ 


 const express = require('express');
 const path = require('path');
 const service = require('./blog-service');
 const multer = require("multer");
 const cloudinary = require('cloudinary').v2
 const streamifier = require('streamifier')

 cloudinary.config({
    cloud_name: 'dy8lvusoq',
    api_key: '247969895596944',
    api_secret: 'lLmy-XejESOwVq5HyOBpn8f4iPA',
    secure: true
});

 const upload = multer(); 

 const app = express();
 
 const HTTP_PORT = process.env.port || 8080;
 
 app.use(express.static('public'));
 
 app.get('/', (req, res) => {
     res.redirect('/about');
 })
 
 app.get('/about', (req, res) => {
     res.sendFile(path.join(__dirname, 'views/about.html'));
 })
 
 app.get('/blog', (req, res) => {
     service.getPublishedPosts().then(data => res.json(data)).catch(err => res.json(err));
 })
 
 app.get('/posts', (req, res) => {
     service.getAllPosts().then(data => res.json(data)).catch(err => res.json(err));
 })
 
 app.get('/categories', (req, res) => {
     service.getCategories().then(data => res.json(data)).catch(err => res.json(err));
 })

 app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addPost.html'));
})
 
 app.listen(HTTP_PORT, () => {
     service.initialize().then((data) => console.log(data)).catch((err) => console.log(err));
     console.log("Express http server listening on: " + HTTP_PORT);
 })

 app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    if(req.file)
    {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    } else {
            processPost("");
        }
        function processPost(imageUrl){
            req.body.featureImage = imageUrl;
    
            const postData = {
                "body": req.body.body,
                "title": req.body.title,
                "postDate": new Date().toISOString().split('T')[0],
                "category": req.body.category,
                "featureImage": imageUrl,
                "published": req.body.published,
            }
    
            blogService.addPost(postData).then(data => res.redirect('/posts')).catch(err => res.json(`message: ${err}`));
        }
    })