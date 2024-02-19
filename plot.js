const url = 'http://127.0.0.1:5000/get_city_zipcodes';
// use d3 to fetch data from JSON
d3.json(url).then(function(data){
    console.log(data);
}); 

function init(){
    // populate the dropdown list with zipcodes in the dataset by appending each zipcode as a new value
    let dropdown = d3.select("#selDataset");
    // use d3 to access sample data
    d3.json(url).then((data) => {
      for (let i = 0; i < data.length; i++) {
        let currentObject = data[i];
      
        // Check if the current object has a 'zipcode' property
        if (currentObject.hasOwnProperty("zipcode")) {
          let zipcode = currentObject.zipcode;
          console.log(zipcode);
          dropdown.append("option").attr("value", zipcode).text(zipcode);
        }
      }
     let defaultSample = data[0].zipcode;
     createDemographicsPanel(defaultSample);
     createLineGraph(defaultSample)
    }); 
  };

function createDemographicsPanel(sample){
    let sample_int = parseInt(sample)
    d3.json(url).then((data) => {
    if (data && data.length > 0) {
        let targetData = data.find(function(item) {
          return item.hasOwnProperty("zipcode") && item.zipcode === sample_int;
        });
    
        // Display the result
        if (targetData) {
          console.log("Zipcode:", targetData.zipcode);
          console.log("City:", targetData.city);
          console.log("State:", targetData.state);
          d3.select('#sample-metadata').text('');
          d3.select('#sample-metadata').append('h4').html(`Zipcode: <span style="margin-right: 20px;">${targetData.zipcode}</span>
          City: <span style="margin-right: 20px;">${targetData.city}</span>
          State: ${targetData.state}`);
          //d3.select('#sample-metadata').append('p').text(`City: ${targetData.city}`);
          //d3.select('#sample-metadata').append('p').text(`State: ${targetData.state}`);
        } else {
          console.log(`Data not found for zipcode ${sample}`);
        }
      } else {
        console.log("Data not loaded or empty");
      }
    });
};

function createLineGraph(sample){
    // get the data from sample list 
    let sample_int = parseInt(sample)
    d3.json(url).then((data) => {
    if (data && data.length > 0) {
        let targetData = data.find(function(item) {
          return item.hasOwnProperty("zipcode") && item.zipcode === sample_int;
        });
    
        // Display the result
        if (targetData) {
            let list_2019 = []
            for (let i = 0; i < 12; i++) {
                //console.log("values:", targetData.yearly_values[0].monthly_values[i].values);
                list_2019.push(targetData.yearly_values[0].monthly_values[i].values);
                console.log(list_2019[i]);
            }

            let list_2020 = []
            for (let i = 0; i < 12; i++) {
                //console.log("values:", targetData.yearly_values[1].monthly_values[i].values);
                list_2020.push(targetData.yearly_values[1].monthly_values[i].values);
            }
            
            let list_2021 = []
            for (let i = 0; i < 12; i++) {
                //console.log("values:", targetData.yearly_values[2].monthly_values[i].values);
                list_2021.push(targetData.yearly_values[2].monthly_values[i].values);
            } 

            let list_2022 = []
            for (let i = 0; i < 12; i++) {
                //console.log("values:", targetData.yearly_values[3].monthly_values[i].values);
                list_2022.push(targetData.yearly_values[3].monthly_values[i].values);
            } 

            let list_2023 = []
            for (let i = 0; i < 12; i++) {
                //console.log("values:", targetData.yearly_values[4].monthly_values[i].values);
                list_2023.push(targetData.yearly_values[4].monthly_values[i].values);
            } 

              let trace1 = {
                x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                y: list_2019,
                type: 'scatter',
                mode: 'lines',
                name: '2019',
              };
              
              let trace2 = {
                x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                y: list_2020,
                type: 'scatter',
                mode: 'lines',
                name: '2020',
              };
              
              let trace3 = {
                x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                y: list_2021,
                type: 'scatter',
                mode: 'lines',
                name: '2021',
              };
              
              let trace4 = {
                x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                y: list_2022,
                type: 'scatter',
                mode: 'lines',
                name: '2022',
              };

              let trace5 = {
                x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                y: list_2023,
                type: 'scatter',
                mode: 'lines',
                name: '2023',
              };
              
              let data = [trace1, trace2, trace3, trace4, trace5];
              
              // Layout configuration
              let layout = {
                title: 'Home Values Over Time',
                xaxis: {
                  title: 'Month',
                },
                yaxis: {
                  title: 'Home Value',
                },
              };
              
              // Create the plot
              Plotly.newPlot('line', data, layout);

        } else {
          console.log(`Data not found for zipcode ${sample}`);
        }
      } else {
        console.log("Data not loaded or empty");
      }
    });
  };

function optionChanged(value){
    console.log("Selected Value:", value, typeof(value));
    createDemographicsPanel(value);
    createLineGraph(value)
};

init();