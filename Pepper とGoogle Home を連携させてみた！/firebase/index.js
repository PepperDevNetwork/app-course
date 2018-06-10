const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.pepperSay = functions.https.onRequest((request, response) => {
    console.log(request.body);

    var result = {};
    try {
        //Dialogflowからのパラメータ取得
        const message = request.body.result.parameters.message
        const action = request.body.result.parameters.action

        result = { "speech": "了解！", "displayText": "了解！" };

        // slackへpost
        var slack = require('request');
        var options = {
            uri: "https://hooks.slack.com/services/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",
            headers: {
                "Content-type": "application/json",
            },
            json: {
                "channel": "#pepper",
                "username": "Google Home",
                "text": "@Pepper" + message
            }
        };
        slack.post(options, function (error, response, body) {
            // nop
        });
    }
    catch (exception) {
        console.log(exception)
        result = {
            "followupEvent": {
                "name": "UNKNOWN"
            }
        };
    }

    //Dialogflowへ応答
    response.setHeader("Content-Type", "application/json")
    response.send(
      JSON.stringify(result)
    );
});