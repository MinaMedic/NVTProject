angular.module('kmjNVT', [ 
		'kmjNVT.controllers',
		'kmjNVT.services',  
		'kmjNVT.routes',
		'ui.bootstrap',
		'LocalStorageModule'
		]);

var apiRoot = 'http://localhost:8080/api/'