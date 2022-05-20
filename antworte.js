const request = require('request');
let requestpromise = require('request-promise');
let querystring = require('querystring');
// Analyze text
//
getPrediction = async (question) => {
    // Hier steht der Starter KEY aus LUIS
    var endpointKey = "5d4f5c51cdc9445783069c59b300439c"; //ihre ID
    // Hier steht die Zugriffs http
    var endpoint = "driveai-authoring.cognitiveservices.azure.com/"; //Ohne https// // Set the LUIS_APP_ID environment variable 
    // which is the ID
    // of a public sample application. 
    var appId = "84a8cf10-5438-4774-8a97-db0971fe485f"; //Aus der Anfrage suchen
    var utterance = question;
    // Hier wird der Suchstring erzeugt
    var queryParams = {
        "show-all-intents": true,
        "verbose": true,
        "query": utterance,
        "subscription-key": endpointKey
    }
    // Hier erstellen wir den REST Call
    var URI = `https://${endpoint}/luis/prediction/v3.0/apps/${appId}/slots/production/predict?${querystring.stringify(queryParams)}`
    // Hier schicken wir die Anfrage und erhalten eine Antwort 
    // in 
    const antwort = await requestpromise(URI);
    // Wir geben die Antwort aus. Diese enthält nur! Die 
    // Absicht mit einer Wahrscheinlichkeit. Wir müssen die 
    // Antwort selber generieren.
    console.log(JSON.parse(antwort));
    try {
        return JSON.parse(antwort);
    }
    catch (e) {
        return undefined;
    }
}
// Lass es laufen …
// getPrediction("welche führerscheinklassen gibt es?").then(() => console.log("done")).catch((err) => console.log(err));

module.exports = getPrediction