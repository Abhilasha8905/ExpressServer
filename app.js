const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();
const port = process.env.PORT || 5001;
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => res.send('Hello World!'));

app.post('/upload-image', (req, res) => {
    let imgAsBase64 = req.body.image; 
    require('fs').writeFileSync('image.png', imgAsBase64, 'base64', (err) => {
        console.log(err);
    })

     request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: "xoxp-1210469697171-1195518745367-1210266478946-e2d92ef6406fbfee40888a53ec1db7b5",
            tile: "Image",
            filename: "image.png",
            filetype: "auto",
            channels: "tryextension",
            file: require('fs').createReadStream('./image.png'),
        },
    }, function(err, response) {
        // just for debugging
        if (err) {
            console.error('Error in Request ', err);
        }
        console.log(response.body);
        res.status(200).send({
            message: 'done'
        })
    })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
