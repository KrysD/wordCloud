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

var fill = d3.scale.category20();

cloud().size([900, 900])
  .words(wordCloudName)
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function(d) { return d.size/4; })
  .on("end", draw)
	.start();

function draw(words) {
	d3.select("body").append("svg")
/*    .attr("width", 900)
    .attr("height", 900)*/
  .append("g")
    .attr("transform", "translate(150,150)")
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

