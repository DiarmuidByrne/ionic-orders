angular.module('OnceOffApp.controllers')

.controller('MainController', ['$scope', function ($scope) {
    $scope.setActive = function(id) {
        console.log("Test: " + id);
        alert(id);
    }

}])

// Populates list once when page is loaded
.controller('CollectionsCtrl', function($scope, $location) {
  $scope.collections = [{
	    'src' : 'img/Category Images/Aircraft.png',
        'page' : 'dashboard'
	}, {
	    'src' : 'img/Category Images/Antiques & Furniture.png',
        'link' : '"#/app/aircraft'
	}, {
		'src' : 'img/Category Images/Art & Sculpture.png',
        'link' : '"#/app/aircraft'
	}, {
		'src' : 'img/Category Images/Antiques & Furniture.png',
        'link' : '"#/app/aircraft'
	}, {
	    'src' : 'img/Category Images/Antiques & Furniture.png',
        'link' : '"#/app/aircraft'
	}];
  $scope.goToURL = function(path) {
    $location.path(path);
  };
  $scope.alertTest = function(msg) {
    alert(msg);
  };
})