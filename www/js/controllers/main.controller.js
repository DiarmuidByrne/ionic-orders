angular.module('OnceOffApp.controllers')

.controller('MainController', ['$scope', 'MainService', function ($scope, MainService) {
    $scope.curDate = MainService.getCurrentDate();
    $scope.testStr = MainService.getTestString();
}]);
