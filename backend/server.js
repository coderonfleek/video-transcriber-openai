const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

//Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

//Configure Multer
/* const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cd) => {
        cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname))
    }
}) */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
  

const upload = multer({storage: storage});


app.get("/", (req, res) =>{
    res.send("Welcome to the A.I Transcription API")
})

app.post("/transcribe", upload.single("file"), async (req, res) => {

    console.log(req.file);

    try {
        const transcription = await openai.createTranscription(
            fs.createReadStream(req.file.path),
            "whisper-1"
        )

        res.send(transcription.data)
    } catch (error) {

        if(error.response){
            console.log(error.response.status);
            res.status(500).send(error.response.data)
        }else{
            console.log(error.message);

            res.status(500).send(error.message)
        }
        
    }

})

const PORT = process.env.PORT || 1330;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})