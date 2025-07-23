
const axios = require('axios');
const req = require('./request')


var iterationLimit = 3;
var windowExhausted = false;

var searchWindowStart = undefined;
var searchWindowStop = undefined;

var searchWindowMin = 13;

var searchWindowIntervalMin = 1;


async function searchAndFetch(startTime, endTime) {
    
    let searchResponse = { startTime: startTime.toISOString(), endTime: endTime.toISOString() }
    // console.log(`CurrentWindow startTime: ${startTime.toISOString()} endTime: ${endTime.toISOString()}`)

    let reqPayload = req.getPayload();
    reqPayload.searches[0].body.query.bool.filter[0].range["@timestamp"].gte = startTime.toISOString();
    reqPayload.searches[0].body.query.bool.filter[0].range["@timestamp"].lte = endTime.toISOString();

    let reqData = req.getOptions();
    
    reqData.data = JSON.stringify(reqPayload);
    var haystackResponse = await axios.request(reqData);

    if(haystackResponse?.data?.body?.responses.length>0 && haystackResponse?.data?.body?.responses[0]?.hits?.hits.length>0) {
        
        if(haystackResponse?.data?.body?.responses[0]?.hits.total >1999) {
            // console.log(`------------ Revisit Time Frame: startTime: ${startTime} endTime: ${endTime} totalHits: ${haystackResponse?.data?.body?.responses[0]?.hits.total} ------------`);
            searchResponse.hitsCount = haystackResponse?.data?.body?.responses[0]?.hits.total;
        }

        searchResponse.hits = [];
        for (hit of haystackResponse.data.body.responses[0].hits.hits) {
            // console.log(`${hit._source.msg}`);
            searchResponse.hits.push(hit._source.msg)
        }
    }
    return searchResponse;
}

async function main() {

    if(searchWindowStart==undefined && searchWindowStop==undefined) {
        if(searchWindowMin==undefined) {
            console.error(`Search Window is not defined`);
            process.exit();
        } else {
            searchWindowStop = new Date();
            searchWindowStart = new Date(searchWindowStop.getTime()-(searchWindowMin*60*1000));
        }
        console.log(`Search Window startTime: ${searchWindowStart.toISOString()} endTime: ${searchWindowStop.toISOString()}`)
    }

    let iterationCount = 0;
    while(!windowExhausted && iterationCount<iterationLimit) {
        iterationCount++;

        let currentWindowStop = new Date(searchWindowStart.getTime() + searchWindowIntervalMin*60*1000);
        if(searchWindowStart.getTime()>searchWindowStop.getTime()) {
            windowExhausted = true;
            break;
        }

        let kibanaResponse = await searchAndFetch(searchWindowStart, currentWindowStop);
        processResponse(kibanaResponse);
        searchWindowStart = currentWindowStop;
    }
}

function processResponse(response) {
    console.dir(response, {depth: null});
}

main();

