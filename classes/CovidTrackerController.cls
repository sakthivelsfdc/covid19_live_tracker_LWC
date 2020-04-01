/*
This Apex class is used to retrieve the covid19 tracker to each country with counts using covid19api.com API
Author  : Sakthivel Madesh
Date    : 01/04/2020
Comments:
*/
public with sharing class CovidTrackerController {
    //getCovidSummary
    @AuraEnabled(continuation=true cacheable=true)
    public static Continuation getCovidSummary(){ 
        String endpoint = 'https://api.covid19api.com/summary'; // add End Point URL in Remote Site Settings (from Setup -> Security ->Remote Site Settings)
        return requestGenerator('GET', endpoint);
    }

    // passing http method and end point url
    public static Continuation requestGenerator(String httpMethod, String requestUrl){
        HttpRequest req = new HttpRequest();
        req.setEndpoint(requestUrl);
        req.setMethod(httpMethod);

        Continuation con = new Continuation(120);
        con.ContinuationMethod = 'callback';
        con.addHttpRequest(req);
        return con;
    }

    @AuraEnabled(cacheable=true)
    public static Object callback(List<String> labels, Object state) {
        HttpResponse res = Continuation.getResponse(labels[0]); 
        return res.getBody();
    } 
}