angular.module('OnceOffApp.controllers.productView', [])

 .controller('ProductViewCtrl', function($rootScope, $scope, $sce) {
    // Get objects in cart if any exist
    var cartObj = window.localStorage.getItem('Cart');
    var cartDict = {}
    if (cartObj != null) {
        cartDict = JSON.parse(cartObj);
    }

    $scope.noPrice = true;
    $scope.selectedProduct = $rootScope.currentProduct;
    $scope.productDesc = $sce.trustAsHtml($scope.selectedProduct.description);
    $scope.productDesc = $scope.productDesc ? String($scope.productDesc).replace('Description: ', '') : '';
    $scope.productDesc = $scope.productDesc ? String($scope.productDesc).replace('href: ', 'browse-to') : 'browse-to';
    $scope.productDesc = $scope.productDesc ? String($scope.productDesc).replace('target="_blank"', '') : '';

    if($scope.selectedProduct.price > 0) {
        $scope.noPrice = false;
    }

    $scope.addToCart = function() {

        if (!($scope.selectedProduct.id in cartDict)) {
            cartDict[$scope.selectedProduct.id] = $scope.selectedProduct;
            window.localStorage.setItem('Cart', JSON.stringify(cartDict));
            $scope.$apply();
        } else {
            
            console.log("Already added");
        }
    }
 })

.filter('removeHTMLTags', function() {
	return function(text) {
        var strippedString = text ? String(text).replace(/<[^>]+>/gm, '') : '';
		strippedString = strippedString ? String(strippedString).replace('&euro;', '€') : '€';
        if(strippedString.length < 2) return '';
        else return strippedString;
	};
})


.directive('browseTo', function ($ionicGesture, $cordovaInAppBrowser) {
 return {
  restrict: 'A',
  link: function ($scope, $element, $attrs) {
   var handleTap = function (e) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
   };
    // todo: capture Google Analytics here
    $cordovaInAppBrowser.open(encodeURI($attrs.browseTo), '_blank', options);
   };
   var tapGesture = $ionicGesture.on('tap', handleTap, $element);
   $scope.$on('$destroy', function () {
    // Clean up - unbind drag gesture handler
    $ionicGesture.off(tapGesture, 'tap', handleTap);
   });
  }
 }
});