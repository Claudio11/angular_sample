describe('EmployeesController', function(){
    var scope, $httpBackend;
 
    beforeEach(angular.module('CEPExample'));

    beforeEach(angular.inject(function(_$httpBackend_, $rootScope, $controller){
        $httpBackend = _$httpBackend_;

        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('EmployeesController', {$scope: scope});
    }));

    it('should create 3 employees', function() {
      expect(scope.empleados).toBe(0);
      $httpBackend.flush();

      expect(scope.empleados).toBe(3);
    });
});