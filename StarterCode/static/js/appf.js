//Define url
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data = {};

// Fetch JSON data 
d3.json(samples).then(function(result) {
  data = result
    console.log(data);
    updateDropdown()
  });

// Create functions
function updateDropdown() {
  const dropdownMenu = d3.select("#selDataset");

  let names = data.names;

  // Clear existing options
  dropdownMenu.html("");

  // Iterate over names to create options
  names.forEach(id => {
    dropdownMenu.append("option").text(id).property("value", id);
  });

  // Populate with ID
  optionChanged(names[0]);
  populateBarChart(names[0]);

}

// Call updateDropdown() 
updateDropdown();

function populateMetadata(selectedID) {
    // Add data 
    d3.json(samples).then((data) => {
        let metadata =  data.metadata;
        let value = metadata.find(result => result.id == selectedID);

        // Check for matching values
        if (value) {
            // Clear 
            d3.select("#sample-metadata").html("");

            // Log the individual key/value pairs
            for (const [key, val] of Object.entries(value)) {
                console.log(key, val);
                d3.select("#sample-metadata").append("h5").text(`${key}: ${val}`);
            }
            console.log(selectedID);
        } else {
            // Check for no matching IDs
            console.log(`No data found for ID: ${selectedID}`);
        }
    });
}

function populateBarChart(id) {
    // Create a horizontal bar chart with a dropdown menu 
    d3.json(samples).then((data) => {
        let selecteddata = data.samples;
        let value = selecteddata.find(results => results.id === id);
        let valuedata = value;
        let otuLabels = valuedata.otu_labels;
        let otuIDs = valuedata.otu_ids;
        let sampleValues = valuedata.sample_values;
        let yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sampleValues.slice(0, 10).reverse();
        let labels = otuLabels.slice(0, 10).reverse();

        // Trace for MB data
        let trace1 = {
            x: xticks,
            y: yticks,
            type: "bar",
            text: labels,
            orientation: "h"
        };

        let layout = {
            title: `Top 10 OTUs for Individual ${id}`,
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU ID" }
        };

        // Plotly bar chart
        Plotly.newPlot("bar", [trace1], layout);
    });

    console.log(id);
}

function populateBubbleChart(id) {
    // Create bubble chart w dropdown menu
    d3.json(samples).then((data) => {
        let selecteddata = data.samples;
        let value = selecteddata.find(results => results.id === id);
        let valuedata = value;
        let otuLabels = valuedata.otu_labels;
        let otuIDs = valuedata.otu_ids;
        let sampleValues = valuedata.sample_values;

        // Trace MB Data
        let trace1 = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: 'Viridis',
                opacity: 0.7
            },
            text: otuLabels
        };

        let layout = {
            title: `Bubble Chart for Individual ${id}`,
            xaxis: { title: 'OTU ID' },
            YAXIS: { TITLE: 'Sample Values'}
        };

        // Plotly bubble chart
        Plotly.newPlot("bubble", [trace1], layout);
    });

    console.log(id);
}

function optionChanged(id) {
    populateMetadata(id)
    populateBarChart(id)
    populateBubbleChart(id)
    console.log(id);
};