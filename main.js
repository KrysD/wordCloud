'use strict'

var d3 = global.d3 = require('d3');
var cloud = require('d3.layout.cloud');
var data = require('./data/liste_des_prenoms_2004_a_2012.json');

var yearSet = new Set();

var cleanData = data.map(function(item){
	yearSet.add(parseInt(item.fields.annee));	
	item.fields.annee = parseInt(item.fields.annee);
	return item.fields;
});

var yearSelected = 2013;

var filteredName = cleanData.filter(function(element){
			return element.annee == yearSelected;
});

var wordCloudName = filteredName.map(function(element){
	return {text: element.prenoms, size: element.nombre, sexe: element.sexe};
});

/*var fill = wordCloudName.map(function(element){
	return element.sexe === 'F' ? 'pink' : '#9CAEEA' ;
});*/

var width = window.innerWidth; // gets the width of your browser window
var height = window.innerHeight; // gets the height of your browser window

var fill = d3.scale.category20();

var layout = cloud().size([width, height]) // your layout (.i.e the svg) will have your window size
  .words(wordCloudName)
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function(d) { return d.size/4; })
  .on("end", draw);

layout.start();

function draw(words) {
	d3.select("body").append("svg")
    .attr("class", "cloud")
  .append("g")
  // This sets the cloud at the center of your svg
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")") // checkout the 'browserify.js' example from d3.layout.cloud library
  .selectAll("text")
    .data(words)
  .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}

