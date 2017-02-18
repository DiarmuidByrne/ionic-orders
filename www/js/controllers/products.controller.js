// Populates list once when page is loaded
angular.module('OnceOffApp.controllers.products', [])

/*
 * Controller for viewing all the returned products in a selected category. 
 * Handles pagination where appropriate and sends selected product data to the
 * productView Controller
 */

.controller('ProductsCtrl', function($state, $rootScope, $ionicScrollDelegate, $scope, $stateParams, woocommerce, totalProducts) {
    
    $scope.category = $stateParams.category;
    var pages;
    $rootScope.currentPage = 1;
    // Selected product for viewing
    $rootScope.currentProduct = {};
    $scope.pagination = false;

    $scope.getAllProducts = function(id, page){
        woocommerce.products(id, page).then(function(objS){

            // Returned JSON object
            $scope.products = objS;
            pages = totalProducts.getTotalPages();

            if(pages > 1) $scope.pagination = true;
        },function(err){
        });
    }

    $scope.getAllProducts($stateParams.id, $rootScope.currentPage);

    // Remove existing buttons and add contact button to product descriptions
    // angular.forEach($scope.products, function(product) {
    // });

    $scope.changePage=function(direction){
        // Navigate to previous page
        if(direction == 0 && $scope.currentPage > 1) {
            $rootScope.currentPage -= 1;
            $scope.getAllProducts($stateParams.id, $rootScope.currentPage);
        }
        // Navigate to next page
        if(direction == 1 && $scope.currentPage < pages) {
            $rootScope.currentPage +=1;
            $scope.getAllProducts($stateParams.id, $rootScope.currentPage);
        }
    };

    // Set selected product for viewing
    $scope.setProduct = function(id) {
        angular.forEach($scope.products, function(product) {
            if(product.id == id) $rootScope.currentProduct = product;
        });
        $state.go('app.product');
    }
})