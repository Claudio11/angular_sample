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
        controller: 'UpsertEmployeesController',
        resolve: {
            employee: function($route, $q, EmployeesService){

                var employeeId = $route.current.params.employeeId;
                var deferred   = $q.defer();
                
                EmployeesService.obtainEmployeeData(employeeId)
                .then(function(data) {
                        deferred.resolve(data); 
                    },
                    function(data){
                        deferred.reject(data);
                    }
                );
                return deferred.promise;
            }
        }
      }).
      otherwise({
        redirectTo: '/list'
      });
  }]);