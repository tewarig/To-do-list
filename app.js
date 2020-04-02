const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
var item ="";
let newListItems= "";
//var items=["buy food","get food", "cook food"];
let workItems = [] ;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
const itemsSchema ={
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name:"Welcome to your todolist!"
});
const item2 = new Item({
  name:"Hit the + button to add a new item."
});
const item3 = new Item({
  name:"<-- Hit this to delete an item."
});
const defaultItems =[ item1, item2, item3];
const listSchema ={
  name: String ,
  items:[itemsSchema],
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req,res){
   var today = new Date();
   var currentDay = today.getDay();

  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var day =today.toLocaleDateString("en-US", options);
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success");
        }
      });
      res.redirect("/");
    }
    else{
    res.render("list",{Listtittle:day ,newListItems: foundItems});
}
});
  //   res.render("list",{Listtittle:day ,newListItems: items});

});
app.post("/",function(req,res) {
/*var item =req.body.newItem;
  console.log(item);
 console.log(req.body);
 */
 const itemName = req.body.newItem;
 const listName = req.body.list;
 const item = new Item({
   name: itemName
  });
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }

});
/*if  (req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
}
else{
  items.push(item);
 res.redirect("/");}
})*/
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
app.post("/delete", function(req,res){
  console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){


  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Successfull delete!");
    }
    res.redirect("/");
  })
}else {
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
}
});
app.get("/:customListName",function(req,res){
  const customListName  =req.params.customListName;
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
      //new list
      const list = new List({
        name:customListName,
        items:defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
      }else{
        //show list
        res.render("list",{Listtittle: foundList.name, newListItems: foundList.items});

      }
    }
  });

});
app.listen(3000,function(){
  console.log("server started in port 3000");
});
