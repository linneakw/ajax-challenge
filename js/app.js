"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/
var commentUrl = 'https://api.parse.com/1/classes/comments';

angular.module('AjaxApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'OXPiD8azvPp4izEydaAIuXDgJWNYeais7UhHQ0ie';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'zVaOx00PAEEQ9Idbb32Q9BJa0MDkIbCemeoB2wpr';
    })

    .controller('CommentController', function($scope, $http) {

        $scope.getComments = function() {
            $http.get(commentUrl + '?order=-score') // get full list of comments from parse
                .success(function(data) {
                    $scope.comments = data.results;

                    //if ($scope.comments.length == 0) {
                    //    $('#comments').html("No comments yet. Be the first to review this!");
                    //}
                });
        };
        $scope.getComments();

        $scope.newComment = {
            score: 0
        };
        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(commentUrl, $scope.newComment)
                .success(function(response) {
                    $scope.newComment.objectId = response.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                })

                .finally(function() {
                    $scope.inserting = false;
                });
        };

        $scope.incrementVotes = function(comment, amount) {
            var postData = {
                score: {
                    __op: "Increment",
                    amount: amount
                }
            };
            // declares postData that we want to send from parse REST API updating object documentation
            //{"score":{"__op":"Increment","amount":1}}

            $scope.updating = true;
            $http.put(commentUrl + '/' + comment.objectId, postData)
                .success(function(respData) {
                    comment.score = respData.score;
                })
                .error (function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

        $scope.sortBy = function(sortCol) {
            $scope.sortCol = sortCol;
        };

        $scope.deleteComment = function(object) {
            $scope.deleting = true;
            $http.delete(commentUrl + '/' + object)
                .success(function(response) {
                    $scope.getComments();
                })

                .finally(function() {
                    $scope.deleting = false;
                })
        };
    });
