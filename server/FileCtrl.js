'use strict';

const ebooksFolderPath = './ebooks/';
const fs = require('fs');

class FileCtrl {
    constructor() {}

    getFolderContent() {
        let folderContents = fs.readdirSync(ebooksFolderPath);
        folderContents = folderContents.map(file => {
            return {
                'path': ebooksFolderPath + file,
                'name': file
            };
        });
        return folderContents;
    }
}

module.exports = new FileCtrl();
