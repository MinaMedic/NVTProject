angular
    .module('kmjNVT.controllers')
    .controller('EventController', EventController)

EventController.$inject = ['$scope', 'eventService', 'localStorageService', '$location', '$routeParams'];

function EventController($scope, eventService, localStorageService, $location, $routeParams) {

    var vm = this;
    vm.event = {};
    vm.comment = {};
    vm.showCommentBox = false;
    vm.showMoreComments = false;

    vm.init = function () {
        if ($routeParams.id != null) {
            eventService.getEvent($routeParams.id).then(function (response) {
                vm.event = response.data;
            }).catch(function () {
                console.log("Error getting event.")
            });
        }
    }
    vm.init();

    vm.addComment = function () {
        vm.comment.signedBy = localStorage.getItem('email');
        vm.comment.createdAt = new Date();
        eventService.addComment(vm.comment, vm.event._id).then(function (response) {
            vm.event.comments.push(vm.comment);
            vm.newCommentForm.$setPristine();
            vm.comment = {};
        }).catch(function () {
            console.log("Error saving comment");
        });
    };

    vm.list = [];
    vm.getComments = function (comment) {
        eventService.getComments(comment._id).then(function (response) {
            vm.list =  response.data;
        }).catch(function () {
            console.log("Error getting comments.");
        });
    };
    
    vm.showComments = function(id){
        for (i in vm.event.comments){
            div =  document.getElementById(vm.event.comments[i]._id);
            if (vm.event.comments[i]._id == id){
               div.style.display = "block";
            }
            else{
                if (div.style.display !== 'none') {
                    div.style.display = 'none';
                }
            }
        }
    };
};