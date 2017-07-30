var express = require('express');
var router = express.Router();
const passport = require('passport');
const requestify = require('requestify');
const handlebars = require('handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    //console.log(req.user);
    //requestify.get("https://www.strava.com/api/v3/segments/" + 10112025 + "/leaderboard?&access_token=" + req.user.accessToken + "")
    //requestify.get("https://www.strava.com/api/v3/athletes/" + req.user.id + "/koms?access_token=" + req.user.accessToken)

    // step #1: Get the list of activities
    // step #2: Get the list of segments within each activity (https://www.strava.com/api/v3/activities/:id)

    let segmentIDs = new Set();
    let segments = [];
    let target = undefined;
    let count = 0;

    requestify.get("https://www.strava.com/api/v3/athlete/activities?access_token=" + req.user.accessToken).then(response => {
        let activities = JSON.parse(response.body);
        target = activities.length;
        activities.forEach(activity => { // activity.name, activity.id
          requestify.get("https://www.strava.com/api/v3/activities/" + activity.id + "?access_token=" + req.user.accessToken).then(activityDetailsResponse => {
            let activityDetails = JSON.parse(activityDetailsResponse.body);
            activityDetails.segment_efforts.forEach(segment => {
              let pr_rank = segment.pr_rank;
              segment = segment.segment;
              if (!segmentIDs.has(segment.id) && !segmentIDs.has(segment.name)){
                segmentIDs.add(segment.id);
                segmentIDs.add(segment.name);
                
                segments.push({name: segment.name, id: segment.id, distance: segment.distance, average_grade: segment.average_grade, maximum_grade: segment.maximum_grade, ranking: pr_rank, city: segment.city, province: segment.state, country: segment.country});
              }
            });
            count++;
            if (count == target){
              let data = {};
              data.segments = segments;
              res.render('segments', data);
            }
          });
        })
    });
    // Async
  }
});

router.get('/details', (req, res, next) => {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else if (req.query.id == undefined){
    res.render('error', {message: "No supplied segment id!"});
  }
  else{
    let leaderboard = [];
    let segmentID = req.query.id;
    requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "/leaderboard?&access_token=" + req.user.accessToken).then(response => {
        const leaderboardResponse = JSON.parse(response.body);
        leaderboardResponse.entries.forEach(effort => {
          leaderboard.push(effort);
        });
        // Get segment information
        // https://www.strava.com/api/v3/segments/
        requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "&access_token=" + req.user.accessToken).then(segmentResponse => {
          const segmentDetails = segmentResponse.body;
          res.render('details', {segmentDetails: segmentDetails, leaderboard: leaderboard});
        });
        res.send("<h1> Ok </h1>");
    });
    
  }
});

module.exports = router;