var myAppModule = angular.module('CEPExample',
                                ['CEPExample.controllers',
                                 'CEPExample.services', 
                                 'CEPExample.directives',
                                 'CEPExample.filters']);

myAppModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'templates/list.html',
        controller: 'EmployeesController'
      }).
      when('/new', {
        templateUrl: 'templates/detail.html',
        controller: 'UpsertEmployeesController'
      }).
      when('/edit/:employeeId', {
        templateUrl: 'templates/detail.html',
        controller: 'UpsertEmployeesController'
      }).
      otherwise({
        redirectTo: '/list'
      });
  }]);