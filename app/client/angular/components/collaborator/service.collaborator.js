angular.module('kmjNVT.services').factory('colService', colService);

colService.$inject = ['$http'];
				
function colService($http) {
	return {
		addCollaborator: addCollaborator
	}

	function addCollaborator(email, appId){
        email = "{\"email\":\""+email+"\"}";
		return $http.post(apiRoot+"users/applicationNew/"+appId, email);
	}
	
}