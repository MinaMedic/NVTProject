angular.module('kmjNVT.services').factory('registrationAppService', registrationAppService);

registrationAppService.$inject = ['$http'];
				
function registrationAppService($http) {
	return {
		registerApp: registerApp
	}

	function registerApp(userId, app){
		return $http.post(apiRoot+"applications/user/"+userId, app);
	}
	
}