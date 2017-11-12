const http = require('http');
const fs = require('fs');
const ebooks = require('./src/assets/books.json');


for (let i in ebooks) {
    console.log('Title', ebooks[i].title);
    console.log('ISBN', ebooks[i].isbn);
    console.log('thumbnail', ebooks[i].thumbnail);
    console.log('\n');
    
    if (ebooks[i].thumbnail == 'images/no-cover.png') {
        continue;
    } else {        
        let file = fs.createWriteStream('./src/assets/covers/' + ebooks[i].isbn + '.jpg');
        let request = http.get(ebooks[i].thumbnail, function(response) {
            response.pipe(file);
        });
    }
}

