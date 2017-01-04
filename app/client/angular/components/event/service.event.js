angular.module('kmjNVT.services').factory('eventService', eventService);

eventService.$inject = ['$http'];
				
function eventService($http) {
	return {
		getEvent: getEvent,
		addComment : addComment,
		addComment2 : addComment2,
		getComments : getComments,
		getChartData : getChartData
	}

	function getEvent(eventId){
		return $http.get(apiRoot+"events/"+ eventId);
	}

	function addComment(comment, idEvent){
		return $http.post(apiRoot+"comments/event/"+idEvent, comment);
	}

	function addComment2(commentId, comment){
		return $http.post(apiRoot+"comments/comment/"+commentId, comment);
	}

	function getComments(comment){
		return $http.get(apiRoot+"comments/all/"+ comment);
	}

	function getChartData(idEvent, fragment){
		return $http.post(apiRoot+"events/fragments/"+idEvent, fragment);
	}
	
}