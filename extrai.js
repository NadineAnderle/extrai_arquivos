// import { throws, doesNotThrow } from 'assert';
const fs = require('fs');
const gracefulFs = require('graceful-fs');
const FileQueue = require('filequeue');

gracefulFs.gracefulify(fs);

let fq = new FileQueue(100);

let path = "extrai_zara/xml";
let pathresult = 'extrai_zara/result'
let pathresultfail = 'extrai_zara/resultfail'

fs.readdir(path, (err, file) => {
    if (err) console.log(err);

    let totalfiles = file.length;

    for (var i = 0; i < totalfiles; i++) {
        let filename = file[i];
        fq.readFile(path + '/' + filename, { encoding: 'utf8' }, function (err, data) {
            if (err) console.log(err);
            texto(data, filename);
        });
    }

});


function texto(data, filename) {

    let ini = data.indexOf('<DocXMLBase64>') + 14;
    let fim = data.indexOf('</DocXMLBase64>');

    if (fim < 0) {
        ini = data.indexOf('Id="') + 44;
        fim = 47;
        fs.writeFile(pathresultfail + '/' + filename, data, 'utf8', (err) => {
            if (err) console.log(err);
            // console.log('The file has been saved!');
        });
    } else {
        let base64 = data.substring(ini, fim);
        let decode = new Buffer(base64, 'base64').toString('utf8');

        ini = decode.indexOf('Id="') + 4;
        fim = 47;

        let nameResult = decode.substr(ini, fim) + '.xml';

        fs.writeFile(pathresult + '/' + nameResult+'_'+filename, decode, 'utf8', (err) => {
            if (err) console.log(err);
            // console.log('The file has been saved!')
        });
    }
};
