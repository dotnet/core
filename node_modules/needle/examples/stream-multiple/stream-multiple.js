var needle = require('needle');
const fs = require('fs-extra')

function stream_multiple(req, res, _urls, stream_dir, index = 0) {
    if (index == 0) {
        // initial state
    }

    let writeStream;
    const uri = _urls[index];

    if (index == undefined) {
        index = 0;
        stream_multiple(req, res, _urls, stream_dir, index);
    } else {

        writeStream = fs.createWriteStream(`${stream_dir}` + `${index}.jpeg`);

        writeStream.on("ready", () => console.log({ msg: `STREAM::WRITE::READY::${index}` }));
        writeStream.on("open", () => console.log({ msg: `STREAM::WRITE::OPEN::${index}` }));
        writeStream.on("finish", () => console.log({ msg: `STREAM::WRITE::DONE::${index}` }));

        writeStream.on('close', () => {
            if (index >= _urls.length - 1) {
                res.redirect('/');
            } else {
                stream_multiple(req, res, _urls, stream_dir, index + 1);
            }
        })

        needle
            .get(uri, function (error, response) {
                if (response.bytes >= 1) {
                    // you want to kill our servers
                }

                if (!error && response.statusCode == 200) {
                    // good
                } else {
                    // then we can retry later
                }
            })
            .pipe(writeStream)
            .on('done', function () {
                // needle 
            });
    }
}

module.exports = { stream_multiple }