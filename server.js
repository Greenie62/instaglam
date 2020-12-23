const express = require('express');
const fileUpload = require('express-fileupload');


const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"))
app.use(fileUpload());
const path = require('path')

// let files = [];

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"))
})


app.get("/sharepage",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/share.html"))
})


app.post("/upload",(req,res)=>{
    console.log(req.files);

    let file = req.files.file;
    file.mv(path.join(__dirname, "public/assets/" + file.name),(err)=>{
        if(err)throw err;
        res.json({filePath:`/assets/${file.name}`, fileName:file.name})
    })
})

// app.post("/share",(req,res)=>{
//     console.log('/share post pinged');
//     let file = req.body.file
//     files.push(file);
//     res.json({msg:"Shared image received!"})
// })


// app.get("/images",(req,res)=>{
//     res.json({files})
// })





app.listen(PORT,console.log(`Logged onto ${PORT}, ${process.env.USER}. Platform:${process.platform}.`))