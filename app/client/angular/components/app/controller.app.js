angular
    .module('kmjNVT.controllers')
    .controller('AppController', AppController)

AppController.$inject = ['$scope', 'appService', 'localStorageService', '$location', '$routeParams'];

function AppController($scope, appService, localStorageService, $location, $routeParams) {

    var vm = this;
    vm.showErrorMessage = false;
    vm.apps = [];
    vm.app = {};
    vm.choices = ['All', 'By fragment', 'By version'];
    vm.option = ""; //'All';
    vm.events = [];
    vm.showAllEvents = false;
    vm.showByFragments = false;
    vm.showByVersion = false;
    vm.filteredLists = [];

    vm.loadApp = function () {
        if ($routeParams.id != null) {
            appService.getApp($routeParams.id).then(function (response) {
                vm.app = response.data;
            }).catch(function () {
                console.log("Error getting info about app.");
            });
        }
    }
    vm.loadApp();

    vm.loadApps = function () {
        userId = localStorage.getItem('userId');
        appService.getApps(userId).then(function (response) {
            if (response.data.length == 0)
                vm.showErrorMessage = true;
            vm.apps = response.data;
        }).catch(function () {
            console.log("Error getting all apps of user.");
        });
    }
    vm.loadApps();

    vm.viewEvents = function (appId) {
        $location.path("/apps/" + appId);
    }

    vm.showEvents = function () {
        vm.events = vm.app.events;
        vm.filteredLists = [];
        if (vm.option == "All") {
            vm.showAllEvents = true;
            vm.showByFragments = false;
            vm.showByVersion = false;
        }
        else if (vm.option == "By fragment") {
            vm.showByFragments = true;
            vm.showAllEvents = false;
            vm.showByVersion = false;
            fragments = [];
            for (i = 0; i < vm.app.events.length; ++i) {  //for petlja koja napravi listu fragments koja sadrzi unique nazive fragmenata
                if (!fragments.includes(vm.app.events[i].fragment))
                    fragments.push(vm.app.events[i].fragment);
            }
            for (i = 0; i < fragments.length; ++i) {  //za svaki taj fragment pozivamo funkciju filter (ugradjena js fja)
                list = vm.events.filter(function (event) {
                    return event.fragment == fragments[i];
                });
                vm.filteredLists.push(list); //listu filtriranu po jednoj vrsti fragmenta smestimo u veliku listu
            }
        }
        else if (vm.option == "By version") {
            vm.showByFragments = false;
            vm.showAllEvents = false;
            vm.showByVersion = true;
            versions = [];
            for (i = 0; i < vm.app.events.length; ++i) {  //for petlja koja napravi listu versions koja sadrzi unique nazive verzija
                if (!versions.includes(vm.app.events[i].version))
                    versions.push(vm.app.events[i].version);
            }
            for (i = 0; i < versions.length; ++i) {  //za svaku verziju pozivamo funkciju filter (ugradjena js fja)
                list = vm.events.filter(function (event) {
                    return event.version == versions[i];
                });
                vm.filteredLists.push(list); //listu filtriranu po jednoj vrsti verzije smestimo u veliku listu
            }
        }
    }

    vm.showEvent = function(eventId){
        $location.path("/events/"+eventId);
    }
}