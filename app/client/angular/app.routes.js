var kmjNVT = angular.module('kmjNVT.routes', ['ngRoute']);
kmjNVT.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/angular/components/login/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        })
        .when('/register', {
            templateUrl: '/angular/components/registration/registration.html',
            controller: 'RegistrationController',
            controllerAs: 'registrationCtrl'
        })
        .when('/registerApp', {
            templateUrl: '/angular/components/registrationApp/registrationApp.html',
            controller: 'RegistrationAppController',
            controllerAs: 'registrationAppCtrl'
        })
         .when('/apps', {
            templateUrl: '/angular/components/app/allApps.html',
            controller: 'AppController',
            controllerAs: 'appCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);