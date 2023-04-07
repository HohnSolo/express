const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-url', async (req, res) => {
  const url = req.body.url;
  console.log('Received URL:', url);
  
  // Use Axios to get the HTML content of the URL
  const response = await axios.get(url);
  const html = response.data;
  
  // Use Cheerio to parse the HTML and extract the links
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((i, element) => {
    links.push($(element).attr('href'));
  });
  
  console.log('Links found:', links);
  // Send the links array as the response
  const linksList = links.map(link => `<li>${link}</li>`).join('');
  const responseHtml = `Found ${links.length} links <ol>${linksList}</ol>`;
  res.send(responseHtml);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});