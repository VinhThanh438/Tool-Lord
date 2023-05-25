const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const clonePage = require('./index');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    // Đường dẫn đến tệp HTML
    const filePath = __dirname + '/public/main.html';

    return res.sendFile(filePath, (err) => {
        if (err) console.log('Lỗi khi gửi tệp HTML:', err);
        else console.log('Tệp HTML đã được gửi thành công!');
    });
});

app.post('/page', async (req, res) => {
    // Đường dẫn đến tệp HTML
    try {
        const filePath = __dirname + '/cloneStorage/index.html';

        await clonePage(req.body.url);

        return res.sendFile(filePath, (err) => {
            if (err) console.log('Lỗi khi gửi tệp HTML:', err);
            else console.log('Tệp HTML đã được gửi thành công!');
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, () => console.log('app listening on port 3000'));
