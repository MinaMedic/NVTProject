angular
	.module('kmjNVT.controllers')
	.controller('MenuController', MenuController)
	
MenuController.$inject = ['$scope','localStorageService','$location'];
	
function MenuController($scope, localStorageService,$location){
	
	var vm = this;
	
	vm.loggedUser = function() {
		var user = localStorage.getItem('user');
		if(user == null)
			return false;
		else
			return true;
	} 
	
	vm.logout = function() {
		 localStorage.clear();
		 $location.path("/");
	}
}