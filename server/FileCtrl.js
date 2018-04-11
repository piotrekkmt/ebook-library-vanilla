'use strict';

const ebooksFolderPath = './ebooks/';
const fs = require('fs');
require('isomorphic-fetch');
const DROPBOX_ACCESS_TOKEN = require('../config.json').DROPBOX_ACCESS_TOKEN,
    Dropbox = require('dropbox').Dropbox,
    dbx = new Dropbox({accessToken: DROPBOX_ACCESS_TOKEN});

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

    getEbookFileFromDropbox(filename) {
        return new Promise((resolve, reject) => {
            dbx.filesDownload({path: '/ebooks/' + filename}).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = new FileCtrl();
