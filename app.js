const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://admin-fiorella:DBtest1234@cluster1.tf0bqen.mongodb.net/todolistDB');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = ["Finish lesson", "Cook chicken", "Go get coffee"];
// let workItems = [];
const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model('Item', itemsSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

const item1 = new Item({
    name: 'Write your task'
});
const item2 = new Item({
    name: 'Click "+" to add'
});
const item3 = new Item({
    name: 'It will get added to this list!'
});

const defaultItems = [item1, item2, item3];

const cDay = date.todayIsName();
const day = date.getDate();

app.get("/", function (req, res) {
    Item.find()
        .then(function (items) {
            if (items.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('success');
                        }
                    });
                res.redirect("/");
            } else {
                console.log(items.length);
                res.render("list", { currentDay: day, listName: cDay, newListItems: items });
            }
        });
});

app.post("/", function (req, res) {
    // console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    });
    if (listName === cDay) {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            });
    }

});

app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    Item.deleteOne({ _id: checkedItem })
        .then(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });

    if (listName === cDay) {
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItem } } })
            .then(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('successful redirect');
                }
                res.redirect("/" + listName);
            })

    }

});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(function (foundList) {

            if (!foundList) {
                const newList = new List({
                    name: customListName,
                    items: defaultItems
                });
                newList.save();
                res.redirect("/" + customListName);

            } else {
                let day = date.getDate();
                res.render('list', { currentDay: day, listName: foundList.name, newListItems: foundList.items });
            }
        });




})

app.get("/about", function (req, res) {
    res.render("about");
})

app.listen(3000, function () {
    console.log('server is up and running!');
})