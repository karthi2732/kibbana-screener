
const axios = require('axios');
const response = require('./response.json')
const req = require('./request')


var STARTING_TIME_ISO_STRING    = '';
var ENDING_TIME_ISO_STRING      = '';
var searchCompleted             = false;

var search = true;


// TILL HOURS is multiple of days * hours
var TILL_HOURS  = 1 * 1;
var BATCH_HOURS = 2;

var INTERVAL_MS = BATCH_HOURS*60*60*1000;


function init() {
    var dateVal     = new Date();

    if(STARTING_TIME_ISO_STRING == '') {
        STARTING_TIME_ISO_STRING = dateVal.toISOString();
    }

    if(ENDING_TIME_ISO_STRING == '') {
        dateVal.setTime(dateVal.getTime()-(TILL_HOURS*60*60*1000));
        ENDING_TIME_ISO_STRING = dateVal.toISOString();
    }
}


function processResonse(response) {
    if(response?.data?.body?.responses.length>0 && response?.data?.body?.responses[0]?.hits?.hits.length>0) {
        for(hit of response.data.body.responses[0].hits.hits) {
            console.log(hit);
        }
    }
}


async function doHaystackSearch(batchStart, batchEnd) {
    req.payload.searches[0].body.query.bool.filter[0].range["@timestamp"].gte = batchStart.toISOString();
    req.payload.searches[0].body.query.bool.filter[0].range["@timestamp"].lte = batchEnd.toISOString();

    req.options.data = JSON.stringify(req.payload);

    try {
        var response = await axios.request(req.options);
        var responseData = {
            timeWindow: `${batchStart.toISOString()} -- ${batchEnd.toISOString()}`,
            haystack: response
        };
        return responseData;
    } catch (err) {
        console.log(`ExecutionError: ${err}`);
        return undefined;
    }

}


function searchAndProcess() {
    
    init();
    
    let batchStartTime = new Date(ENDING_TIME_ISO_STRING);
    let endTime = new Date(STARTING_TIME_ISO_STRING);
    let batchEndTime;

    var responsePromises = [];

    for(let i=0;i<100;i++) {
        
        if((batchStartTime.getTime()+INTERVAL_MS) > endTime.getTime()) {
            batchEndTime = new Date(endTime.getTime());
        } else {
            batchEndTime = new Date(batchStartTime.getTime()+INTERVAL_MS);
        }

        if(batchStartTime.getTime()<batchEndTime.getTime()) {
            // console.log(`${batchStartTime.toISOString()} - ${batchEndTime.toISOString()}`);
            var haystackResponse = doHaystackSearch(batchStartTime, batchEndTime);
            responsePromises.push(haystackResponse);
        } else {
            break;
        }
        batchStartTime.setTime(batchEndTime.getTime())
    }

    Promise.all(responsePromises).then(promises => {
        promises.forEach(promise => {

            console.log("---------------------------------------------------------------------------------")
            console.log(`TimeWindow: ${promise.timeWindow}`)

            if(promise.haystack?.data?.body?.responses.length>0 && promise.haystack?.data?.body?.responses[0]?.hits?.hits.length>0) {
                
                for(let response of promise.haystack.data.body.responses){
                    for(let hit of response.hits.hits) {
                        // console.dir(hit, { depth: null });
                        // process.exit();

                    }
                }
            }
        });
    });

}


// ---------------------------------------------------------------------------------

if(search) {
    searchAndProcess()
} else {
    processResonse(response);
}

// ---------------------------------------------------------------------------------


