
angular.module('OnceOffApp', ['ionic', 'ngCordova',
'OnceOffApp.controllers', 'OnceOffApp.controllers.collections',
'OnceOffApp.controllers.login', 'OnceOffApp.controllers.products',
'OnceOffApp.controllers.productView', 'OnceOffApp.controllers.stripe', 'OnceOffApp.controllers.cart',
'OnceOffApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MainController'
  })
  .state('app.collections', {
    url: '/collections',
    views: {
      'menuContent': {
        templateUrl: 'templates/collections.html',
        controller: 'CollectionsCtrl'
      }
    }
  })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html'
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app.products', {
    url: '/products/:id/:category',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'ProductsCtrl'
      }
    }
  })
  .state('app.product', {
    url: '/product',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'ProductViewCtrl'
      }
    }
  })
  .state('app.cart', {
    url: '/cart',
    views: {
      'menuContent': {
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'
      }
    }
  });

  var defaultPage = '/app/login';
  var currentUser = window.localStorage.getItem('CurrentUser');

  if(currentUser != null) {
    defaultPage = '/app/collections'
    currentUser = JSON.parse(currentUser)
  }
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(defaultPage);
})

.config(['$httpProvider', function($httpProvider) {
  var user = JSON.parse(window.localStorage.getItem('CurrentUser'));

  if (user != null) {
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'request': function(config) {

          config.headers = config.headers || {};
          //add the Authorization header for each subsequent request
          if (user[0].token && config.headers.Authorization == null && config.url.indexOf('https://api.stripe.com/v1/') == -1) {
            config.headers.Authorization = 'Bearer ' + user[0].token;
          }
          return config;
        }
      };
    }]);
  } else {
    return {
      'request': function(config) {
        config.headers = config.headers || {};
        config.headers.Authorization = null;

        return config;
      }
    }
  }
}]);
