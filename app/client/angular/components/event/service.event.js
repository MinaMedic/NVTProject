angular.module('kmjNVT.services').factory('eventService', eventService);

eventService.$inject = ['$http'];
				
function eventService($http) {
	return {
		getEvent: getEvent
	}

	function getEvent(eventId){
		return $http.get(apiRoot+"events/"+ eventId);
	}
	
}