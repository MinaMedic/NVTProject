angular.module('kmjNVT.services').factory('registrationService', registrationService);

registrationService.$inject = ['$http'];
				
function registrationService($http) {
	return {
		register: register
	}

	function register(user){
		return $http.post(apiRoot+"users/", user);
	}
	
}