angular.module('kmjNVT.services').factory('appService', appService);

appService.$inject = ['$http'];
				
function appService($http) {
	return {
		getApps: getApps,
        getApp : getApp
	}

	function getApps(userId){
		return $http.get(apiRoot+"applications/user/"+ userId);
	}

    function getApp(appId){
		return $http.get(apiRoot+"applications/"+ appId);
	}
	
}