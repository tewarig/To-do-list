//jshint esversion:6
//console.log(module);
module.exports.getDate = getDate;
function getDate(){
var today = new Date();
var currentDay = today.getDay();

var options = {
 weekday:"long",
 day:"numeric",
 month:"long"
};
var day =today.toLocaleDateString("en-US", options);
return day;
}

//for calling more than 2 function
module.exports.getDay = getDay;
function getDay(){
var today = new Date();
var currentDay = today.getDay();

var options = {
 weekday:"long",
 };
var day =today.toLocaleDateString("en-US", options);
return day;
}
console.log(module.exports);
