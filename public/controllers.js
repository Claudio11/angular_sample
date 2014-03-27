var controllers = angular.module('CEPExample.controllers',[],function(){});

controllers.controller('EmployeesController',function($scope, EmployeesService){
    $scope.empleados = EmployeesService.getEmployeeList();
})

.controller('UpsertEmployeesController',function($scope, $location, $routeParams, EmployeesService, employee){

    if ($routeParams.employeeId) {
        // If it has an id, is updating an employee...
        $scope.employee = employee; // Employee comes from the resolve in the routeprovider....
    }

    /**
     *  Method in charge of ask a service for something and handle the returned promise.
     *
     *  @param servicePromise Service method to call.
     *  @param successMessage Message to display if succeed.
     */
    var requestAndHandlePromise = function(servicePromise, successMessage){
        $scope.loading = true;
        servicePromise($scope.employee)
        .then(function(data) {
                $scope.loading = false;
                alert( successMessage );    // Could use data as success message, but not every server method has a response so had to pass it as parameter...
                $location.path( "/#/list" );
            },
            function(data){
                $scope.loading = false;
                alert( 'Error: ' + data );
            }
        );
    }

    /**
     *  Called when the user clicks on save button of the form (saves or updates an employee).
     */
    $scope.upsert = function(employeeForm){

        if (employeeForm.$valid) {
            // Form elements are valid so we proceed to send the data....
            var servicePromise,
                successMessage;
            if ($routeParams.employeeId) {
                // It's editing...
                servicePromise = EmployeesService.edit;
                successMessage = 'Employee correctly updated';
            }
            else {
                // It's creating a new employee...
                servicePromise = EmployeesService.save;
                successMessage = 'Employee correctly created';
            }
            requestAndHandlePromise(servicePromise, successMessage);
        }
        else{
            alert('The form is not correctly filled, please review it');
        }  
    }

    /**
     *  Called when the user clicks on delete button of the form (deletes the employee).
     */
    $scope.delete = function () {
        if ($scope.employee.id) {
            // Employee already has an id, so we can delete it.
            requestAndHandlePromise(EmployeesService.delete, 'Employee correctly deleted');
        }
    }
});