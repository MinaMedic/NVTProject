var kmjNVT = angular.module('kmjNVT.routes', ['ngRoute']);
kmjNVT.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/angular/components/login/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);