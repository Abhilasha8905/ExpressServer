const express = require('express');
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 5001;
const slackToken = process.env.SLACK_TOKEN;


app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.get('/', (req, res) => res.send('Hello World!'));

function slackUploadImage(base64Image) {
    try {
        return new Promise((resolve, reject) => {
            require('fs').writeFileSync('image.png', imgAsBase64, 'base64', (err) => {
                if (err) {
                    console.error('writeFileSync >> error', err);
                    return reject(err);
                } else {
                    console.log('slackUploadImage >> Image file created ');
                }
            });
            const formData = {
                token: slackToken,
                tile: "Image",
                filename: "image.png",
                filetype: "auto",
                channels: "tryextension",
                file: require('fs').createReadStream('./image.png'),
            };
            request.post({ url: 'https://slack.com/api/files.upload', formData }, function(err, response) {
                if (err) {
                    console.error('Error Uploading Image to Slack ', err);
                    return reject(err);
                }
                console.log('Slack Image Upload Success ', response.body);
                return resolve(response.body);
            });
        });
    } catch(error) {
        console.error('slackUploadImage >> Error ', error);
        throw error;
    }
}

app.post('/upload-image', async (req, res) => {
    const result = await slackUploadImage(req.body.image);
    return res.send(result);
});

app.listen(port, () => console.log(`Application Express Server is up and running`))
