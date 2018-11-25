exports.get = function(event, context, callback) {
    const ForexDataClient = require("forex-quotes");
    const encrypted = process.env['forexAPIKey'];
    let decrypted;
    if (decrypted) {
        getQuotes(event, context, callback);
    } else {
        // Decrypt code should run once and variables stored outside of the function
        // handler so that these are decrypted once per container
        const kms = new AWS.KMS();
        kms.decrypt({ CiphertextBlob: new Buffer(encrypted, 'base64') }, (err, data) => {
            if (err) {
                console.log('Decrypt error:', err);
                return callback(err);
            }
            decrypted = data.Plaintext.toString('ascii');

            let client = new ForexDataClient(decrypted);
            client.quota().then(response => {
                console.log(response);
            });
        });
    }
}
