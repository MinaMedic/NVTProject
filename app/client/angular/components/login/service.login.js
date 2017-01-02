angular.module('kmjNVT.services').factory('loginService', loginService);

loginService.$inject = ['$http'];
				
function loginService($http) {
	return {
		login: login
	}

	function login(user){
		return $http.post(apiRoot+"users/login", user);
	}
	
}