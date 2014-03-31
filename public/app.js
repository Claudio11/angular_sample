var myAppModule = angular.module('CEPExample',
                                ['CEPExample.controllers',
                                 'CEPExample.services', 
                                 'CEPExample.directives',
                                 'CEPExample.filters']);

myAppModule.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'templates/list.html',
        controller: 'EmployeesController'
      }).
      when('/new', {
        templateUrl: 'templates/detail.html',
        controller: 'InsertEmployeesController'
      }).
      when('/edit/:employeeId', {
        templateUrl: 'templates/detail.html',
        controller: 'UpdateEmployeesController',
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
      when('/gallery', {
        templateUrl: 'templates/gallery.html',
        controller: 'EmployeesController'
      }).
      otherwise({
        redirectTo: '/list'
      });

      // Add interceptors....
      $httpProvider.interceptors.push('httpRequestInterceptor');
  }
]);