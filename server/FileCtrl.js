'use strict';

require('isomorphic-fetch');
const ebooksFolderPath = './ebooks/',
    DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || require('../config.json').DROPBOX_ACCESS_TOKEN,
    fs = require('fs'),
    formidable = require('formidable'),
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

    saveFileToDropbox(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                if (files && files.ebookfiletoupload) {
                    const tempFilePath = files.ebookfiletoupload.path;
                    let bookFile = fs.readFileSync(tempFilePath);
                    dbx.filesUpload({path: '/ebooks/' + files.ebookfiletoupload.name, contents: bookFile})
                        .then(function(response) {
                            resolve('File successfully uploaded!');
                            console.log('File uploaded to', response.path_display);
                        }).catch(function(error) {
                            reject(error);
                            console.error(error);
                        });
                } else {
                    reject('Nothing to upload');
                }
            });
        });
    }
}

module.exports = new FileCtrl();
