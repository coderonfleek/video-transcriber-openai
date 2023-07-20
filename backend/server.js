// Import the necessary libraries
const express = require('express');
const dotenv = require('dotenv');
const {Configuration, OpenAIApi} = require("openai");
const bodyParser = require('body-parser');
const cors = require("cors");
const multer  = require('multer');
const path    = require('path');
const fs = require("fs");



// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Setup CORs
app.use(cors());

// Configure OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

// Create an index route which returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to our A.I Backend!');
});

// Create a "message" route which returns a JSON response
app.post('/transcribe', upload.single('file'), async (req, res) => {

  /*const transcription = await openai.createTranscription(
    fs.createReadStream(req.file.path),
    "whisper-1"
  )
  res.send(transcription);
  */

    console.log(process.env.OPENAI_API_KEY);

    //const myfile = fs.readFileSync(req.file.path);
    console.log(req.file.path);

    try {
      const transcription = await openai.createTranscription(
        fs.createReadStream(req.file.path),
        "whisper-1"
      )
      console.log(transcription);
      res.send(transcription.data);
    } catch(error) {
      
      if(error.response){
        
        console.log(error.response.status);
        console.log(error.response.data);

        res.status(500).send(error.response.data);
      }else{
        console.log(error.message)
        res.status(500).send(error.message);
      }
      
    }
  
});

// The port the app will listen on
const PORT = process.env.PORT || 1330;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});