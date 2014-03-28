var services = angular.module('CEPExample.services',[]);

services

.service('EmployeesService', function($http, $q){

    /**
     *  Method in charge of make the request given as parameters,
     *  also returns the promise of the response.
     *
     *  @param httpCall $http.verb, to the correct method.
     *  @param parameters Parameters to send to the backend.
     *  @return Response promise.
     */
    var createPromise = function(httpCall, parameters){
        var deferred = $q.defer();
        
        httpCall.apply(this, parameters) // ... used apply to put parameters from an array.
        .success(function(data){
            deferred.resolve(data);
        }) 
        .error(function(data){
            deferred.reject(data);
        });
        
        return deferred.promise;
    }

    var EmployeesService = {};

    // Retrieves the lis of employees.
    EmployeesService.getEmployeeList = function(){
        return createPromise(
                                $http.get, 
                                ["/employees", {"headers" : {"Accept" : "application/json"}}]
                            );
    }

    // Inserts the employee given by parameter.
    EmployeesService.save = function(employee){
        return createPromise(
                                $http.post, 
                                ["/employees", employee, {"headers" : {'Content-Type': 'application/json'}}]
                            );
    }

    // Updates the employee given by parameter.
    EmployeesService.edit = function(employee){
        return createPromise(
                                $http.put, 
                                ["/employees/" + employee.id, employee, {"headers" : {'Content-Type': 'application/json'}}]
                            );
    }

    // Deletes the employee given by parameter.
    EmployeesService.delete = function(employee){
        return createPromise(
                                $http.delete, 
                                ["/employees/" + employee.id, {"headers" : {"Content-Type": 'application/json'}}]
                            );
    }

    // Given an employee id, will retrieve it from the backend.
    EmployeesService.obtainEmployeeData = function(employeeId){
        return createPromise(
                                $http.get, 
                                ["/employees/" + employeeId, {"headers" : {"Accept" : "application/json"}}]
                            );
    }
    
    return EmployeesService;
})

.factory("Employee", ['EmployeesService',
    // Here we see where we should use services or factories, factory allows me to create an "object" that can be instantiated...
    function(EmployeesService) {

        // Define the constructor function.
        function Employee( name, salary, rating, employeeId ) {

            this.name = name;
            this.salary = salary;
            this.rating = rating;
            if (angular.isDefined(employeeId)) {
                this.id = employeeId;
            }
        }

        // Define the "instance" methods using the prototype
        // and standard prototypal inheritance.
        Employee.prototype = {

            saveEmployeeState : function(){
                EmployeesService.edit(this)
                .then(function(data) {
                    },
                    function(data){
                        alert( 'Error: ' + data );
                    }
                );
            },

            addUpVote: function() {
                this.rating++;
                this.saveEmployeeState();
            },

            addDownVote: function() {
                if (this.rating > 0) {
                    this.rating--;
                    this.saveEmployeeState();
                }
            }

        };

        // Return constructor
        return( Employee );
    }
])

.factory('httpRequestInterceptor', function ($rootScope) {
    // Interceptors to load a spinner while waiting for a response.
    return {
        request: function (config) {
            $rootScope.$broadcast('startSpinner');
            return config;
        },

        response: function (config) {
            $rootScope.$broadcast('endSpinner');
            return config;
        }
    }
})

;
