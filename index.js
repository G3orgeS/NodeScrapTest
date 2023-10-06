const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs')

const url = 'http://127.0.0.1:8080/'; // Ersätt med din live serveradress

axios.get(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        // Exempel: Extrahera texten från rubriken <h1>
        const welcomeText = $('h1').text();

        // Extrahera e-postadressen från länken
        const emailLink = $('a[href^="mailto:"]');
        const emailAddress = emailLink.text();

        // Läs in befintligt innehåll från output.html
        let existingContent = fs.readFileSync('output.html', 'utf-8');

        // Hitta positionen för </body>-taggen och infoga din nya HTML-data före den
        const bodyEndIndex = existingContent.indexOf('</body>');
        if (bodyEndIndex !== -1) {
            existingContent = existingContent.slice(0, bodyEndIndex) +
                `
                <h1>Välkomsttext:</h1>
                <p>${welcomeText}</p>
                <p>E-post: ${emailAddress}</p>
                ` +
                existingContent.slice(bodyEndIndex);
        }

        // Skriv det uppdaterade innehållet till output.html
        fs.writeFileSync('output.html', existingContent);
        console.log('Data skriven till output.html.');
    })
    .catch(error => {
        console.error('Fel vid hämtning av webbsida:', error);
    });