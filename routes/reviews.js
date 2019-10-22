let reviews = require('../models/reviews');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(reviews,null,5));
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

router.findOne = (req, res) => {
 var review = getByValue(reviews,req.params.id);
    res.setHeader('Content-Type', 'application/json');
    if (review != null){
        res.send(JSON.stringify(review,null,5));
    }
else {
    res.send("Review not Found")
    }

}
function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

router.addReview = (req, res) => {
    //Add a new review to our list
    var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
    var currentSize = reviews.length;

    reviews.push({"id" : id, "review" : req.body.review,"upvotes" : 0});

    if((currentSize + 1) == reviews.length)
        res.json({ message: 'Review Added Successfully!'});
    else
        res.json({ message: 'Review NOT Added!'});
}

router.incrementUpvotes = (req, res) => {
    // Find the relevant review based on params id passed in
    // Add 1 to upvotes property of the selected review based on its id
    var review = getByValue(reviews,req.params.id);

    if (review != null) {
        review.upvotes += 1;
        res.json({status : 200, message : 'UpVote Successful' , review : review });
    }
    else
        res.send('Review NOT Found - UpVote NOT Successful!!');
}

router.deleteReview = (req, res) => {
    //Delete the selected review based on its id
    var review = getByValue(reviews,req.params.id);
    var index = reviews.indexOf(review);

    var currentSize = reviews.length;
    reviews.splice(index, 1);

    if((currentSize - 1) == reviews.length)
        res.json({ message: 'Review Deleted!'});
    else
        res.json({ message: 'Review NOT Deleted!'});
}

router.findTotalVotes = (req, res) => {

    let votes = getTotalVotes(reviews);
    res.json({totalvotes : votes});
}


module.exports = router;