require('dotenv').config()
const express = require("express")
const axios = require("axios").default;
const cors = require("cors")

const app = express();
const port = process.env.PORT || 3000

app.use(express.static("public"));
app.use(cors())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.get('/word', (req, res) => {
    var options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: { count: '5', wordLength: '5' },
        headers: {
            'x-rapidapi-host': 'random-words5.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    axios.request(options).then((response) => {
        console.log(response.data);
        res.json(response.data[0])
    }).catch((error) => {
        console.error(error);
    });
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

app.get('/check', (req, res) => {
    const word = (req.query.word)

    const options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
        params: { entry: word },
        headers: {
            'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    axios.request(options).then((response) => {
        console.log(response.data);
        res.json(response.data.result_msg)
    }).catch((error) => {
        console.error(error);
    });
})
