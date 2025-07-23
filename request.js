const config = require('./config.json')

function getPayload() {
    let payload = {
        "searches": [
            {
                "header": {
                    "index": "freshid*",
                    "preference": 1753250669496
                },
                "body": {
                    "version": true,
                    "size": 2000,
                    "sort": [
                        {
                            "@timestamp": {
                                "order": "desc",
                                "unmapped_type": "boolean"
                            }
                        },
                        {
                            "offset": {
                                "order": "desc",
                                "unmapped_type": "boolean"
                            }
                        }
                    ],
                    "stored_fields": [
                        "*"
                    ],
                    "script_fields": {},
                    "docvalue_fields": [
                        {
                            "field": "@timestamp",
                            "format": "date_time"
                        },
                        {
                            "field": "audit_id",
                            "format": "date_time"
                        },
                        {
                            "field": "eventTime",
                            "format": "date_time"
                        },
                        {
                            "field": "firstTimestamp",
                            "format": "date_time"
                        },
                        {
                            "field": "lastTimestamp",
                            "format": "date_time"
                        },
                        {
                            "field": "start_time",
                            "format": "date_time"
                        },
                        {
                            "field": "time",
                            "format": "date_time"
                        },
                        {
                            "field": "time_local",
                            "format": "date_time"
                        }
                    ],
                    "_source": {
                        "excludes": []
                    },
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "query_string": {
                                        "query": "\"USER_UPDATED\" AND \"Payload is\" AND kubernetes.pod.name: polaris*",
                                        "analyze_wildcard": true,
                                        "default_operator": "AND",
                                        "time_zone": "Asia/Calcutta"
                                    }
                                }
                            ],
                            "filter": [
                                {
                                    "range": {
                                        "@timestamp": {
                                            "gte": "2025-07-23T08:44:39.022Z",
                                            "lte": "2025-07-23T08:45:39.022Z",
                                            "format": "strict_date_optional_time"
                                        }
                                    }
                                }
                            ],
                            "should": [],
                            "must_not": []
                        }
                    },
                    "track_total_hits": false
                }
            }
        ]
    };
    payload.searches[0].body.query.bool.must[0] = { "query_string": { "query": config.haystackSearchQuery, "analyze_wildcard": true, "default_operator": "AND", "time_zone": "Asia/Calcutta"}};
    return payload;
}


function getOptions() {
    let kibanaDomain = undefined;
    let reg = config.region;
    if(reg=='us') {
        kibanaDomain = '';
    } else if (reg=='eu') {
        kibanaDomain = '';
    } else if (reg=='in') {
        kibanaDomain = '';
    } else if (reg=='au') {
        kibanaDomain = '';
    } else if (reg=='me') {
        kibanaDomain = '';
    }

    let options = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${kibanaDomain}/internal/_msearch`,
    headers: { 
      'accept': '*/*', 
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8', 
      'cache-control': 'no-cache', 
      'content-type': 'application/json', 
      'cookie': `${config.cookie}`, 
      'origin': `https://${kibanaDomain}`, 
      'osd-version': '6.1.5-SNAPSHOT', 
      'pragma': 'no-cache', 
      'priority': 'u=1, i', 
      'referer': `https://${kibanaDomain}/app/discover`, 
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"macOS"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-origin', 
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
      'x-env': 'null'
    },
    data: undefined
  };

  return options;

}

module.exports = { getOptions, getPayload }
