# eBook Library Vanilla

 Nth generation of the eBook Library, this time with a nice jQuery Mobile UI and vanilla JavaScript that a Kindle browser likes.

## Setup

Run the usual node install command 
```
$ npm install
```

Currently there are no db starter scripts as of yet. If you'd like to run it yourself you will need to set up a MongoDB database. The collection should be `ebooks`, the default database name `ebook-library` though this shouldn't matter if you put it in the mongoose config url.

Then you will also need to set up a Dropbox Application using the Dropbox Developer here: https://www.dropbox.com/developers

Create the `.env` file from the sample file provided.

```PowerShell
DROPBOX_ACCESS_TOKEN=YOUR-TOKEN-HERE
MONGO_URI=mongo+srv//YOUR//MONGOURI/
```

To start:
```
$ npm start
```

Happy reading! 

### Development

If you'd like to help with developing the project, here's a handy script to run the designated eslint tests on your code on each _$git commit_ command.

Development templates:
```
$ git init --template=git_templates
```
The code might be crap but at least it will be pretty. Unit tests can be added into the setup to be ran on TravisCI together with the linting tests - some day...
