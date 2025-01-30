const fs=require('fs');
const path = require('path');
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions));
app.use(express.json());//important for reading req body
app.use(express.static(path.join(__dirname, 'public')));//Express has a built-in middleware express.static which is used to serve static files such as images, stylesheets, and scripts.

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/Home.html');
});

app.post('/',function(req,res){
   
    console.log("folderNames",req.body.folderName1,req.body.folderName2,req.body.folderName3);
    let count1,count2,count3;
    
    let completed = 0;

    function checkCompletion(){ //Can define a function inside a function
        completed++;
        if (completed == 3) { //It executes only after all th rewrites are done not before itself like the previous code
            console.log("counts:", count1, count2, count3);
            res.json({ folder1: count1, folder2: count2, folder3: count3 });
        }
    };

    rewritefileName(req.body.folderName1, (err, count) => {
        if (err) return res.status(500).json({ error: "Error processing folder1" });
        count1 = count;
        //console.log(count1);
        checkCompletion();
    });

    rewritefileName(req.body.folderName2, (err, count) => {
        if (err) return res.status(500).json({ error: "Error processing folder2" });
        count2 = count;
        checkCompletion();
    });

    rewritefileName(req.body.folderName3, (err, count) => {
        if (err) return res.status(500).json({ error: "Error processing folder3" });
        count3 = count;
        checkCompletion();
    });
})



 
function rewritefileName(folder,callback){

    const directoryPath = path.join(path.join(__dirname, 'public'),folder);

    fs.readdir(directoryPath, function (err, files) {

        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        let i=1;
        //console.log("files.length=",files.length);
        files.forEach(function (file) {

            let filePath=directoryPath+"\\"+file
            let newName=directoryPath+"\\"+String(i)+".jpg";
            let flag=0;
            for(let j=0;j<files.length;j++){
                //console.log("files[j]",files[j]);
                if((directoryPath+"\\"+files[j])===newName){
                    flag=1;
                    //console.log(directoryPath+"\\"+files[j]);
                } 
            }
            //console.log("filePath newname",filePath,newName);
            if(flag!=1){
                fs.rename(filePath,newName , (err) => { 
                    if (err) { 
                        console.error('Error renaming file:', err); 
                    } else { 
                        console.log('File renamed successfully'); 
                    } 
                }); 
                
            }
            i++;
            
        });
        //console.log(files.length);
        return callback(null,files.length);
    });
}


app.listen(3000, () => {
    console.log("Server Listening on PORT:3000");
  });