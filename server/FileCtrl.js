'use strict';

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
        return this.getDropboxContents();
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

    validateDbxFile(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(new ServerError(err, 400));
                }

                if (files && files.ebookfiletoupload) {
                    const tempFilePath = files.ebookfiletoupload.path;
                    const stats = fs.statSync(tempFilePath);

                    if (stats.size > (1024 * 1024 * 10)) {
                        console.error('ERROR: Cannot upload files over 10MB.');
                        reject(new ServerError('File size is over 10MB', 400));
                    } else {
                        const binary = fs.readFileSync(tempFilePath);
                        const filename = files.ebookfiletoupload.name;
                        const bookFile = {
                            filename: filename,
                            binary: binary
                        };
                        resolve(bookFile);
                    }
                } else {
                    reject(new ServerError('Nothing to upload. Is the file empty?', 400));
                }
            });
        });
    }

    async saveFileToDropbox(req) {
        try {
            const bookFile = await this.validateDbxFile(req);
            await dbx.filesUpload({path: '/ebooks/' + bookFile.filename, contents: bookFile.binary});
            return 'File successfully uploaded!';
        } catch (err) {
            console.error(err);
            throw (new ServerError('Error uploading file to server', 400));
        }
    }
}

module.exports = new FileCtrl();
