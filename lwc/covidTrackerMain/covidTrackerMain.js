import { LightningElement, track, api, wire } from 'lwc';
import getCovidSummary from '@salesforce/apexContinuation/CovidTrackerController.getCovidSummary';
import { loadScript } from 'lightning/platformResourceLoader';

// Summary Table columns
const columns = [
    {
        label: 'Country',
        fieldName: 'Country',
        type: 'text',
        sortable: "true",
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'New Confirmed',
        fieldName: 'NewConfirmed',
        type: 'number',
        sortable: "true",
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'Total Confirmed',
        fieldName: 'TotalConfirmed',
        type: 'number',
        sortable: "true",
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'New Deaths',
        fieldName: 'NewDeaths',
        type: 'number',
        sortable: 'true',
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'Total Deaths',
        fieldName: 'TotalDeaths',
        type: 'number',
        sortable: 'true',
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'New Recovered',
        fieldName: 'NewRecovered',
        type: 'number',
        sortable: 'true',
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }, {
        label: 'Total Recovered',
        fieldName: 'TotalRecovered',
        type: 'number',
        sortable: 'true',
        cellAttributes: { class: { fieldName: 'covidStatus' }}
    }
];
                        
export default class CovidTrackerMain extends LightningElement {
    jsonObj;
    data;
    columns = columns;
    showSpinner = false;
    showError = false;
    errorMessage;

    //sorting
    sortBy;
    sortDirection;

    connectedCallback(){
        this.showSpinner = true;
        this.getCovidSummaryData();
    }

    //get getCovidSummaryData
    getCovidSummaryData(){
        getCovidSummary()
            .then(result => {
                
                if(result) { 

                    this.data = [];
                    this.jsonObj = JSON.parse(result); 
                    for(let i = 0; i < this.jsonObj.Countries.length; i++){
                        let covidResult = this.jsonObj.Countries[i];

                        let covidStatusVal = 'slds-text-color_success';
                        if(covidResult.TotalDeaths > 0) {
                            covidStatusVal = 'slds-text-color_error'; //error color code to display if total deaths > 0
                        }
                        //format each row & push it into the data
                        let row = {
                            id : covidResult.Country,
                            Country : covidResult.Country,
                            NewConfirmed : covidResult.NewConfirmed,
                            TotalConfirmed : covidResult.TotalConfirmed,
                            NewDeaths : covidResult.NewDeaths,
                            TotalDeaths : covidResult.TotalDeaths,
                            NewRecovered : covidResult.NewRecovered,
                            TotalRecovered : covidResult.TotalRecovered,
                            covidStatus : covidStatusVal
                        }
                        if(covidResult.Country) {
                            this.data.push(row); // Summary Table data values
                        }
                    }
                    this.showSpinner = false;
                    this.showError = false;
                } else {
                    this.showError = true;
                    this.error = 'Live data - Not Found';
                }
            })
            .catch(error => {
                this.showError = true;
                this.error = errorMessage;
            });
    }
    
    //sorting methods
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;
        // sort direction
        this.sortDirection = event.detail.sortDirection;
        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        // set the sorted data to data table data
        this.data = parseData;
    }
}