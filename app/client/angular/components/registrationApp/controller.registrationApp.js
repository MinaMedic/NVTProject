angular
	.module('kmjNVT.controllers')
	.controller('RegistrationAppController', RegistrationAppController)
	
RegistrationAppController.$inject = ['$scope','registrationAppService','$location'];
	
function RegistrationAppController($scope, registrationAppService, $location){
	
	var vm = this;
    vm.showSuccessMessage = false;
    vm.showErrorMessage = false;
	vm.app = {};
	vm.registerApp = function(){
        userId = localStorage.getItem('userId');
		registrationAppService.registerApp(userId,vm.app).then(function(response){
			 vm.showSuccessMessage = true;
		}).catch(function(){
			vm.showErrorMessage = true;
		});
	}
	
}