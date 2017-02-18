// Populates list once when page is loaded
angular.module('OnceOffApp.controllers.cart', [])
.controller('CartCtrl', function( $rootScope, $scope, $state, $ionicHistory, $ionicPopup ) {
    $scope.showCart = false;
    //Populate cart dictionary with saved items (If any)
    var cartObj = window.localStorage.getItem('Cart');
    if (cartObj != null) {
        $scope.cart = JSON.parse(cartObj);
        console.log(JSON.stringify($scope.cart));
    }

    // Add all cart items to page
    if ($scope.cart != null) {
        $scope.showCart = true;
    }

    $scope.clearCart = function() {
        console.log("Clearing");       
        // A confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: 'Clear Cart?',
            template: 'Remove all items from cart?'
        });

        confirmPopup.then(function(res) {
            console.log("Cleared");       
            window.localStorage.removeItem('Cart');
            $scope.showCart = false;
            $scope.cart = null;
        });
    }

    $scope.goToCollections = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('app.collections');
    }

    // Go to product page when cart item is selected
    // Set selected product for viewing
    $scope.viewProduct = function(id) {
        angular.forEach($scope.cart, function(product) {
            if(product.id == id) $rootScope.currentProduct = product;
        });
        $state.go('app.product');
    }   
})