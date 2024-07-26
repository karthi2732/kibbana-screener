
var haystackSearchQuery = 'createRolesOnProduct';

var reg = 'us'

if(reg=='us') {
    var kibanaDomain = '';
    var cookie = '';
}


var payload = {
    "searches": [
      {
        "header": {
          "index": "freshid*",
          "preference": 1721537483833
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
          "script_fields": {
            "sherlock-url": {
              "script": {
                "source": "if (doc.containsKey('Sampled') && !doc['Sampled'].empty && doc['Sampled'].value == \"01\") { \n  return doc['TraceId'].value;\n} \nelse if (doc.containsKey('Sampled') && !doc['Sampled'].empty && doc['Sampled'].value == \"00\") { \n  return \"trace not sampled\"; \n} \nelse if (doc.containsKey('traceparent') && !doc['traceparent'].empty && doc['traceparent'].value != \"-\" && doc['traceparent'].value != \"\" ) {\n  def path = doc['traceparent'].value;\n\tdef first = path.indexOf(\"-\");\n\tdef newfield_one = path.substring(0,first);\n\tdef second = path.indexOf(\"-\", first + 1);\n\tdef newfield_second = path.substring(first + 1, second);\n\tdef last = path.lastIndexOf(\"-\");\n\tdef newfield_last = path.substring(last + 1);\n\treturn newfield_last == \"00\" ? \"trace not sampled\" : newfield_second;\n}\nelse if (doc.containsKey('x_trace_id') && !doc['x_trace_id'].empty && doc['x_trace_id'].value != \"-\" && doc['x_trace_id'].value != \"\" ) {\n  def path = doc['x_trace_id'].value;\n\tdef first = path.indexOf(\"-\");\n\tdef newfield_one = path.substring(0,first);\n\tdef second = path.indexOf(\"-\", first + 1);\n\tdef newfield_second = path.substring(first + 1, second);\n\tdef last = path.lastIndexOf(\"-\");\n\tdef newfield_last = path.substring(last + 1);\n\treturn newfield_last == \"00\" ? \"trace not sampled\" : newfield_second;\n}\nelse { \n  return \"trace not found\"; \n}",
                "lang": "painless"
              }
            }
          },
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
              "field": "message_time",
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
                      "gte": "2024-07-21T05:55:10.432Z",
                      "lte": "2024-07-21T06:00:10.432Z",
                      "format": "strict_date_optional_time"
                    }
                  }
                }
              ],
              "should": [],
              "must_not": []
            }
          },
          "track_total_hits": true
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
