
var haystackSearchQuery = 'passed';

var reg = 'us'

if(reg=='us') {
    var kibanaDomain = 'logs.haystack.es';
    var cookie = '';
} else if (reg=='eu') {
    var kibanaDomain = 'logs-euc.haystack.es';
    var cookie = '';
} else if (reg=='in') {
    var kibanaDomain = 'logs-in.haystack.es';
    var cookie = '';
} else if (reg=='au') {
    var kibanaDomain = 'logs-au.haystack.es';
    var cookie = '';
} else if (reg=='me') {
    var kibanaDomain = 'logs-mec.haystack.es';
    var cookie = '';
}


var payload = {
  "searches": [
      {
          "header": {
              "index": "freshid*",
              "preference": 1742698352587
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
                                  "query": haystackSearchQuery,
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
                                      "gte": "2025-03-23T03:48:34.685Z",
                                      "lte": "2025-03-23T04:48:34.685Z",
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


var options = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${kibanaDomain}/internal/_msearch`,
    headers: { 
      'accept': '*/*', 
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8', 
      'cache-control': 'no-cache', 
      'content-type': 'application/json', 
      'cookie': `${cookie}`, 
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


module.exports = { payload, kibanaDomain, options };
