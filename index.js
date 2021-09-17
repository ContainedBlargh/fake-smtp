const {SMTPServer} = require('smtp-server');
const fs = require('fs').promises;

const server = new SMTPServer({
    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ['STARTTLS', 'AUTH'],
    logger: true,
    onData(stream, session, callback) {
        let buffer = "";
        stream.pipe(process.stdout); // print message to console
        stream.on('data', (chunk) => {
            buffer += chunk;
        });
        stream.on('end', err => {
            const ts = Date.now();
            const name = `email_${ts}`;
            fs.writeFile(`./${name}.eml`, buffer);
            buffer = "";
            callback(err);
        });
    },
});

server.listen(456);