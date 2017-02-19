angular.module('OnceOffApp.controllers', [])

/*
 * Main application controller. Also handles the side menu functions,
 * and shows and hides the menu button where appropriate
 */
.controller('MainController', ['$state', '$ionicSideMenuDelegate', '$scope', '$ionicHistory',
  function($state, $ionicSideMenuDelegate, $scope, $ionicHistory) {
    $scope.currentUser = JSON.parse(window.localStorage.getItem('CurrentUser'));

    $scope.$state = $state;

    // console.log(window.localStorage.getItem('CurrentUser'));
    if ($scope.currentUser != null) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.collections');
    }
  }
])

// Loads when a category is selected. Uses chosen Category id to load related products
.service("woocommerce", ['$q', '$ionicScrollDelegate', '$http', 'errorHandler', '$ionicLoading', 'totalProducts',
  function($q, $ionicScrollDelegate, $http, errorHandler, $ionicLoading, totalProducts) {
    //Request Url and method
    var self = this;
    var user = JSON.parse(window.localStorage.getItem('CurrentUser'));

    var request = {
      url: 'https://www.onceoff.com/wp-json/wc/v1/products?category=',
      method: 'get',
      param: '&page='
    };

    //Service Function to get products
    this.products = function(id, page) {
      $ionicLoading.show({
        template: '<ion-spinner class="light"></ion-spinner>'
      });
      var deff = $q.defer();
      $http({
        method: request.method,
        url: request.url + id + request.param + page,
        headers: {
          "Content-Type": "application/JSON",
          Authorization: 'Bearer ' + user[0].token
        },

      }).success(function(objS, status, headers, config) {
        $ionicLoading.hide();
        // Start at top of page
        $ionicScrollDelegate.scrollTop();
        // Total number of pages in response
        totalProducts.setTotalPages(headers('x-wp-totalpages'));

        deff.resolve(objS);
        //    return products;
      }).error(function(objE) {
        $ionicLoading.hide();
        errorHandler.serverErrorhandler(objE);
        deff.reject("server Error");
      });
      return deff.promise;
    };
  }
])

.service('errorHandler', ['$q', function($q) {
  this.serverErrorhandler = function(error) {
    alert("ERROR ::" + JSON.stringify(error));
    // console.log("ERROR ::"+JSON.stringify(error));
  };
}])

.factory('totalProducts', function() {
  var products = {}

  function setTotalPages(p) {
    products = p;
  }

  function getTotalPages() {
    return products;
  }

  return {
    setTotalPages: setTotalPages,
    getTotalPages: getTotalPages
  }
})
