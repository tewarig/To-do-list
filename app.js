const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var item ="";
let newListItems= "";
var items=["buy food","get food", "cook food"];
let workItems = [] ;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
   var today = new Date();
   var currentDay = today.getDay();

  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var day =today.toLocaleDateString("en-US", options);

     res.render("list",{Listtittle:day ,newListItems: items});

});
app.post("/",function(req,res) {
var item =req.body.newItem;
  console.log(item);
 console.log(req.body);
if  (req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
}
else{
  items.push(item);
 res.redirect("/");}
})
app.get("/work",function(req,res){
  res.render("list",{Listtittle:"Work List", newListItems:workItems});
});
app.post("/work",function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
});
app.listen(3000,function(){
  console.log("server started in port 3000");
});
