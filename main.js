const express = require("express");
const cors = require("cors");
const pdf = require("html-pdf");
const JsonToHtml = require("./json-html");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ extended: true, limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors({
    origin: ['http://localhost:4200', 'https://azuswftciqacmxapp.usw-uat001.appserviceenvironment.net', '']
}));

app.post("/generatepdf", (req, res) => {
    const html = req.body.source;
    const options = req.body.options;
    options.phantomPath = "./node_modules/phantomjs-prebuilt/bin/phantomjs";
    options.phantomArgs = ["--ignore-ssl-errors=yes"];
    let htmlString = Buffer.from(html, "base64").toString("ascii");
    htmlString = decodeURIComponent(htmlString);
    console.log(htmlString);
    pdf.create(htmlString, options).toBuffer(function (err, buffer) {
        // console.log(err, buffer);
        res.send(buffer);
    });
});

app.post("/generatehtmlpdf", (req, res) => {
    const json = req.body.source;
    const options = req.body.options;
    const jsonToHtml = new JsonToHtml();
    const generatedHtml = jsonToHtml.generateHtml(json);
    options.phantomPath = "./node_modules/phantomjs-prebuilt/bin/phantomjs";
    options.phantomArgs = ["--ignore-ssl-errors=yes"];
    const htmlString = decodeURIComponent(generatedHtml);
    pdf.create(htmlString, options).toBuffer(function (err, buffer) {
        console.log(err, buffer);
        res.send(buffer);
    });
});

app.post("/generatehtml", (req, res) => {
    const json = req.body;
    const jsonToHtml = new JsonToHtml();
    const htmlString = jsonToHtml.generateHtml(json);
    res.send(htmlString);
});

var server = app.listen(port, function () {
    var host = server.address().address;
    console.log("listening at http://%s:%s", host, port);
});
