angular
    .module('kmjNVT.controllers')
    .controller('EventController', EventController)

EventController.$inject = ['$scope', 'eventService', 'localStorageService', '$location', '$routeParams'];

function EventController($scope, eventService, localStorageService, $location, $routeParams) {

    var vm = this;
    vm.event = {};

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
};