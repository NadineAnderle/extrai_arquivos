// import { throws, doesNotThrow } from 'assert';
const fs = require('fs');
const gracefulFs = require('graceful-fs');
const FileQueue = require('filequeue');

gracefulFs.gracefulify(fs);

let fq = new FileQueue(100);

let path = "extrai_auditoria/auditoria";
let pathresult = 'extrai_auditoria/result'
let pathresultProc = 'extrai_auditoria/resultProc'
let pathresultfail = 'extrai_auditoria/resultfail'


fs.readdir(path, (err, file) => {
    if (err) console.log(err);

    let totalfiles = file.length;

    for (var i = 0; i < totalfiles; i++) {
        let filename = file[i];
        fq.readFile(path + '/' + filename, { encoding: 'utf8' }, function (err, data) {
            if (err) console.log(err);
            texto(data, filename);
            textoProc(data, filename);
        });
    }

});



function texto(data, filename) {

    let iniT = data.indexOf('fnEnviarNF_WS_Daruma(<NFe') + 4;
    let fimT = data.indexOf('</NFe>') + 6;
    let count = 0;
    let ini, fim;

    while (true) {
        count++;

        if (fim < 0) {
            ini = data.indexOf('Id="', iniT) + 44;
            fim = 47;
            fs.writeFile(pathresultfail + '/' + filename, data, 'utf8', (err) => {
                if (err) console.log(err);
                console.log('erro file has been saved!');
            });
        } else {


            let xml = data.substring(iniT, fimT);
            // let decode = new Buffer(base64, 'base64').toString('utf8');

            ini = xml.indexOf('Id="') + 4;
            fim = 47;

            let nameResult = Math.random().toString()+ '.xml';

            fs.writeFileSync(pathresult + '/' + nameResult, xml, 'utf8', (err) => {
                if (err) console.log(err);
                console.log('The file has been saved!')
            });
        }

        iniT = 0;
        iniT = data.indexOf('fnEnviarNF_WS_Daruma(<NFe', fimT) + 4;
        fimT = 0;
        fimT = data.indexOf('</NFe>', iniT) + 6;
        // console.log("Count: " + count + " Ini: " + iniT + " Fim: " + fimT);
        if (iniT <= 4) {
            break;
        }
    }

}

function textoProc(data, filename) {

    let iniT2 = data.indexOf('<DocXMLBase64>') + 14;
    let fimT2 = data.indexOf('</DocXMLBase64>');
    ini = 0;
    fim = 0;

    while (true) {

        xml = '';
        xml = data.substring(iniT2, fimT2);
        xml = new Buffer(xml, 'base64').toString('utf8');

        ini = xml.indexOf('Id="') + 4;
        fim = 47;

        nameResult = decode.substr(ini, fim) + "-proc" + '.xml';

        fs.writeFileSync(pathresultProc + '/' + nameResult, xml, 'utf8', (err) => {
            if (err) console.log(err);
            console.log('The file has been saved!')
        });


        iniT2 = 0;
        iniT2 = data.indexOf('<DocXMLBase64>', fimT2) + 14;
        fimT2 = 0;
        fimT2 = data.indexOf('</DocXMLBase64>', iniT2);

        if (iniT2 <= 14) {
            break;
        }
    }
}