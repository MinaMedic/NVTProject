angular
	.module('kmjNVT.controllers')
	.controller('RegistrationController', RegistrationController)
	
RegistrationController.$inject = ['$scope','registrationService','$location'];
	
function RegistrationController($scope, registrationService, $location){
	
	var vm = this;
	vm.user = {};
	vm.register = function(){
		registrationService.register(vm.user).then(function(response){
			$location.path("/login");
		}).catch(function(){
			console.log("Error registrating.");
		});
	}
	
}