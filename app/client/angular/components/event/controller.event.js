angular
    .module('kmjNVT.controllers')
    .controller('EventController', EventController)

EventController.$inject = ['$scope', 'eventService', 'localStorageService', '$location', '$routeParams'];

function EventController($scope, eventService, localStorageService, $location, $routeParams) {

    var vm = this;
    vm.event = {};
    vm.comment = {};

    vm.init = function(){
        if ($routeParams.id != null){
            eventService.getEvent($routeParams.id).then(function(response){
                vm.event = response.data;
            }).catch(function(){
                console.log("Error getting event.")
            });
        }
    }
    vm.init();

    vm.addComment = function(){
        vm.comment.signedBy = localStorage.getItem('email');
        vm.comment.createdAt = new Date();
        eventService.addComment(vm.comment, vm.event._id).then(function(response){
            vm.event.comments.push(vm.comment);
            vm.newCommentForm.$setPristine();
            vm.comment = {};
        }).catch(function(){
            console.log("Error saving comment");
        });
    };
};