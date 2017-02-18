// Populates list once when page is loaded
angular.module('OnceOffApp.controllers.collections', [])
.controller('CollectionsCtrl', function($scope, $location, $ionicHistory) {
    $ionicHistory.clearHistory();
    $scope.collections = [{
        'name' : 'All Categories',
        'src' : 'img/Category Images/All Categories.png',
        'id' : '73'
        },{
        'name' : 'Aircraft',
        'src' : 'img/Category Images/Aircraft.png',
        'id' : '66'
        }, {
        'name' : 'Antiques & Furniture',
        'src' : 'img/Category Images/Antiques & Furniture.png',
        'id' : '69'
        }, {
        'name' : 'Art & Sculpture',
        'src' : 'img/Category Images/Art & Sculpture.png',
        'id' : '13'
        }, {
        'name' : 'Automobiles',
        'src' : 'img/Category Images/Automobiles.png',
        'id' : '63'
	}];
})