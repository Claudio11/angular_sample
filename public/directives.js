var directives = angular.module('CEPExample.directives',[],function(){});

directives

.directive('ngConfirm', [
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

.directive('vote', [ 'Employee',
    function(Employee){
        // Directive that allows upvote or downvote something, it needs to pass the object to vote in the item attribute of the directive.
        // For now it's coupled with the controller because it creates an Employee object 
        // TODO: Do it totally decoupled from the controller.

        return {
            restrict: 'E',
            templateUrl: '/templates/vote.html',
            scope: {
                item: '='
            },
            link: function (scope, element, attrs) {
                // This will be always executed after all promises (resolve method of the routeprovider, public/app.js) are resolved...
                // We converted employee to a factory employee (and because of the two way communication between controller and 
                // directive (scope:{item: '='}) it's already saved in the attribute employee of the controller (parent scope))....
                scope.item = new Employee(scope.item.name, scope.item.salary, scope.item.rating, scope.item.id);

                // Employee received a like...
                scope.like = function(){
                    scope.item.addUpVote();
                }

                // Employee received a nope...
                scope.nope = function(){
                    scope.item.addDownVote();
                }
            }
        };
    }
])

.directive('autoComplete', ['$timeout', 
    function ($timeout) {
        // Directive that autocompletes lists (the controller should pass the array in the "items" attribute).
        // This directive is completely decoupled from controllers, so it can be used anywhere.
        // TODO: Should check for names only after mySearch has 3 characters
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

.directive('csSpinner', [ 
    function(){
        // Directive in charge of display a swirling (from $http interceptors)
        // This directive is created to display a single message on the page (it isnt created to be put inside a repeat 
        // for example, because each time the interceptors intercepts an http, will display the spinner (in a repeat will
        // display a spinner for each element, that's not ok)).
        return{
            restrict: 'E',
            template: '<span ng-show="spinner">Wait...</span>',
            scope: {},
            link: function(scope, elem, attrs){
                scope.$on('startSpinner', function(evt){
                    scope.spinner = true;
                });

                scope.$on('endSpinner', function(evt){
                    scope.spinner = false;
                });
            }
        }

    }
])

.directive('targetElement', [ 'Target', '$timeout',
    function(Target, $timeout){
        // Directive in charge of create an inner element that will have a shadow from the light of the cursor,
        // (the cursor is the lighthouse), when the cursor is over the directive (in this version the element cannot change positions,
        //  TODO: make that it can change positions).

        return{
            restrict: 'E',
            replace: true,
            require: '^lighthouse',
            template: '<div ng-style="boxShadowStyle">Target</div>',
            compile: function(elem, attrs, ctrl){             

                return function(scope, elem, attrs, ctrl){
                    var el = elem[0];
                    var shadowTarget = new Target(el.clientWidth, 
                                                  el.clientHeight, 
                                                  el.getBoundingClientRect().left, 
                                                  el.getBoundingClientRect().top);

                    scope.$on('coordinateChanged', function(){
                        $timeout( function() {
                            // Timeout created to allow digest cycle to finish.
                            scope.boxShadowStyle = shadowTarget.createShadow({left: ctrl.getX(), top: ctrl.getY()}); 
                        }, 0);
                    });
                }
            }
        }

    }
])

.directive('lighthouse', [ 
    function(){
        // Directive in charge of create an inner element that will have a shadow from the light of the cursor,
        // (the cursor is the lighthouse), when the cursor is over the directive.
        var mouseX,
            mouseY;

        return{
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div class="container"><div class="shadow-element" ng-transclude></div></div>',
            controller: function(){
                this.getX = function(){
                    return mouseX;
                }
                this.getY = function(){
                    return mouseY;
                }
            },
            link: function(scope, elem, attrs){
                elem.bind('mousemove', function(event){
                    mouseX = parseInt(event.clientX, 10);
                    mouseY = parseInt(event.clientY, 10);
                    scope.$broadcast('coordinateChanged');
                });

                elem.bind('mouseleave', function(event){
                    console.info('leaving');
                });
            }
        }

    }
])
;