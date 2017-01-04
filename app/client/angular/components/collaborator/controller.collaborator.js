angular
    .module('kmjNVT.controllers')
    .controller('ColController', ColController)

ColController.$inject = ['$scope', 'colService', 'localStorageService', '$location', '$routeParams'];

function ColController($scope, colService, localStorageService, $location, $routeParams) {

    var vm = this;
    vm.email = "";
    vm.showErrorBox = false;
    vm.showSuccessBox = false;

    vm.addCollaborator = function () {
        colService.addCollaborator(vm.email, $routeParams.id).then(function (response) {
            if (response.data.email != null) {
                vm.showErrorBox = false;
                vm.showSuccessBox = true;
            }
            else {
                vm.showSuccessBox = false;
                vm.showErrorBox = true;
            }
        }).catch(function () {
            console.log("Error adding collaborator");
        });
    }
}