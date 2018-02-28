const   express     = require("express"),
        app         = express(),
        host        = "127.0.0.1",
        port        = 1337,
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Photo       = require("./models/photos"),
        Comment     = require("./models/comment");

mongoose.connect("mongodb://localhost/zeus_mr_man");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

///RESTFUL Routing

//REST INDEX
app.get('/', function (req, res) {
    res.redirect('/photos');
  });
/////REST INDEX
app.get("/photos", function(req, res){

   Photo.find({}, function(err, allPhotos){
       if(err){
           console.log(err);
       } else {
            res.render("photos/index", {photos: allPhotos})
       }
   });
});

app.post("/photos", function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newPhoto  = {name: name, image: image, description: description};
    Photo.create(newPhoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/photos");
        }
    });
});
///REST NEW PHOTO
app.get("/photos/new", function(req, res){
    res.render("photos/new");
});

///REST SHOW
app.get("/photos/:id", function(req, res){
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            res.render("photos/show", {photo: foundPhoto});
        }
    });
});
/////Comments Routes

////// REST NEW
app.get("/photos/:id/comments/new", function(req, res){
    /// Find Photo By ID
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    });
    

});

//// REST Create
app.post("/photos/:id/comments", function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err) {
            console.log(err);
            res.redirect("/photos");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    photo.comments.push(comment._id);
                    photo.save();
                    res.redirect('/photos/' + photo._id );
                }
            });
        }
    });
});

app.listen(port, host);

