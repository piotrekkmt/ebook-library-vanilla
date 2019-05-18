'use strict';

const ebooksFolderPath = './ebooks/';

const fs = require('fs'),
    fetch = require('isomorphic-fetch'),
    formidable = require('formidable'),
    Dropbox = require('dropbox').Dropbox,
    ServerError = require('./errors/ServerError'),
    DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN,
    dbx = new Dropbox({accessToken: DROPBOX_ACCESS_TOKEN, fetch: fetch});


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

    async getDropboxContents() {
        try {
            const listOfEbookFiles = await dbx.filesListFolder({path: '/ebooks'});
            return listOfEbookFiles.entries;
        } catch (err) {
            console.error('Error getting books from dropbox', err);
            throw new ServerError('Error getting books from dropbox', 500);
        }
    }

    async getEbookFileFromDropbox(filename) {
        try {
            const data = await dbx.filesDownload({path: '/ebooks/' + filename});
            return data;
        } catch (err) {
            throw new ServerError('Error getting books file from dropbox', 500);
        }
    }

    getThumbnailFileFromDropbox(thumb) {
        return dbx.filesDownload({path: '/thumbnails/' + thumb});
    }

    async saveFileToDropbox(req) {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                if (files && files.ebookfiletoupload) {
                    const tempFilePath = files.ebookfiletoupload.path;
                    let bookFile = fs.readFileSync(tempFilePath);
                    const response = await dbx.filesUpload({path: '/ebooks/'
                        + files.ebookfiletoupload.name, contents: bookFile});
                    console.log('File uploaded to', response.path_display);
                    return 'File successfully uploaded!';
                } else {
                    throw new ServerError('Nothing to upload. Is the file empty?', 400);
                }
            });
        } catch (err) {
            console.error(err);
            throw new ServerError('Error uploading file to dropbox', 400);
        }
    }
}

module.exports = new FileCtrl();
