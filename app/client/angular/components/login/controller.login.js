angular
	.module('kmjNVT.controllers')
	.controller('LoginController', LoginController)

LoginController.$inject = ['$scope', 'loginService', 'localStorageService', '$location'];

function LoginController($scope, loginService, localStorageService, $location) {

	var vm = this;
	vm.user = {};
	vm.showError = false;

	vm.login = function () {
		loginService.login(vm.user).then(function (response) {
			if (response.data.message != null) {
				vm.showError = true;
			}
			else {
				localStorage.setItem("user", JSON.stringify(response.data));
				$location.path("/");
			}
		}).catch(function () {
			console.log("Error logging.")
		});
	}

}