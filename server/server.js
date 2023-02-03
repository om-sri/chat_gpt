import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {Configuration, OpenAIApi} from 'openai';

dotenv.config();

const result = dotenv.config();


console.log(process.env.OPENAI_API_KEY);


const configuration = new Configuration({
    apikey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.status(200).send({
        message: 'Hello world',
    })
});

app.post('/', async(req,res) => {
    try{
        if (!req.body.prompt) {
            return res.status(400).send({ error: 'The "prompt" value is missing from the request body.' });
          }
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:'${prompt}',
            temperature:0,
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
            
        })
    } catch(error){
        console.log(error);
        res.status(500).send({error})

    }
})
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));



