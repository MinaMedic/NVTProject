angular.module('kmjNVT.services').factory('eventService', eventService);

eventService.$inject = ['$http'];
				
function eventService($http) {
	return {
		getEvent: getEvent,
		addComment : addComment,
		getComments : getComments
	}

	function getEvent(eventId){
		return $http.get(apiRoot+"events/"+ eventId);
	}

	function addComment(comment, idEvent){
		return $http.post(apiRoot+"comments/event/"+idEvent, comment);
	}

	function getComments(comment){
		return $http.get(apiRoot+"comments/all/"+ comment);
	}
	
}