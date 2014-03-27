var directives = angular.module('CEPExample.directives',[],function(){});

directives.directive('ngConfirm', [
    function(){
        // Emulates javascript confirm behavior.
        return {
            priority: 1,
            link: function (scope, element, attr) {
                if (attr.ngClick) {
                    var clickAction = attr.ngClick;
                    attr.ngClick = undefined;
                    element.bind('click', function() { 
                        if (window.confirm('Are you sure?')) {
                            scope.$apply(clickAction);
                        }
                    });
                }
            }
        };
    }
])

.directive('ngNumeric', [
    function(){
        // Had some troubles validating numeric inputs the standard way in chrome(known issue for that, and later angular versions), 
        // so created a directive as a workaround (had to remove the "number" value of "type" attribute of the input).
        var INTEGER_REGEXP = /^\-?\d+$/;

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {

                ctrl.$parsers.push(function(value) {
                    if (INTEGER_REGEXP.test(value)) {
                        ctrl.$setValidity('integer', true);
                        return value;
                    } else {
                        ctrl.$setValidity('integer', false);
                        return undefined;
                    }
                });
            }
        };
    }
])

.directive('vote', [
    function(Employee){

        return {
            restrict: 'AE',
            templateUrl: '/templates/vote.html',
            link: function (scope, element, attrs) {

               /* //scope.prom.then( function(){scope.created='yep';});
                scope.$on('employeeLoaded', function(){
                    console.info(scope.employee);
                });

                var dummyEmp = new Employee(scope.employee.name, scope.employee.salary);
                console.info(dummyEmp);
                // Careful with coupled directive and controller (is not that bad because the directive needs to be used in this context,
                // it will always need an employee (current)).
                // It can be decoupled creating an isolated scope and passing the employee as "itemToVote" or something, in this
                // case I will use the controller scope.

                scope.like = function(){
                    console.info(scope.employee);
                }

                scope.nope = function(){
                    console.info('nop');   
                }*/
            }
        };
    }
])

.directive('autoComplete', ['$timeout', 
    function ($timeout) {
        // Directive that autocompletes lists (the controller should pass the array in the "items" attribute).
        // This directive is completely decoupled from controllers, so it can be used anywhere.
        // TODO Should check for names only after mySearch has 3 characters
        return {
            restrict: 'EA',
            templateUrl: '/templates/autoComplete.html',
            scope:{
                items: '=',
                mySearch: '@'
            },
            controller: function($scope, $element, $attrs) {
                $scope.items = angular.fromJson($scope.items);
                $scope.listVisible = false;

                $scope.$watch('mySearch', function(){
                    $scope.listVisible = true;   // When the user is writing we should display the list...
                });
                
                $scope.setItem = function(itemName){
                    $scope.mySearch = itemName;
                    $timeout( function() {
                        // Timeout created to allow digest cycle to finish (so when I set mySearch attr, the full cycle
                        // is run and AFTER that, the listVisible is set to false).
                        $scope.listVisible = false; 
                    }, 0);
                };
            }
        }
    }
])