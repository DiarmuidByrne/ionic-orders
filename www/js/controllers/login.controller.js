// Populates list once when page is loaded
angular.module('OnceOffApp.controllers.login', [])

.controller('LoginCtrl', function($scope, logout, $ionicSideMenuDelegate, $ionicHistory, $http, $ionicLoading, $state, $ionicPopup, $rootScope) {
    $scope.loginData = {};

    $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.clearData();
    }); $scope.$on('$ionicView.leave', function(){
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.clearData = function() {
        $scope.loginData.username = "";
        $scope.loginData.password = "";

        // Delete current user token if user exists (Log out)
        if (window.localStorage.getItem('CurrentUser') != null ) logout.logout();

        $timeout(function () {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          console.log('clearing cache')
        },300) 

    }

    $scope.login = function() {
        $ionicLoading.show({
                template: '<ion-spinner class="light"></ion-spinner>'
        });

        var apiHost = 'https://onceoff.com/wp-json';
        $http.post( apiHost + '/jwt-auth/v1/token', {
            username: $scope.loginData.username,
            password: $scope.loginData.password
        })
        .then( function( response ) {
            var token = response.data.token;

            $http ({
                method: 'GET',
                url: apiHost + '/wp/v2/users/me',
                headers: {
                    Authorization: 'Bearer ' + response.data.token
                }
            })
            .then( function(res) {
                $ionicLoading.hide();

                $scope.user= []
                $scope.user.push(res.data);
                console.log("New Token: " + token)
                $scope.user[0].token = token;

                console.log("ID", $scope.user[0].id);
                // Saves current user as Stringified JSON.
                // Can be parsed to JSON object when retrieved
                window.localStorage.setItem('CurrentUser', JSON.stringify($scope.user));

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.collections');
                $scope.$apply();

            })
        })
        .catch( function( error ) {
            var errMessage;
            if(error.status == '403') errMessage = 'Invalid Username or Password. Please Try again'
            else errMessage = 'Something went wrong. Please try again later'
            $scope.showAlert = function() {
                var loginErrorPopup = $ionicPopup.alert({
                    title: 'Login Error',
                    template: errMessage
                });
                loginErrorPopup.then(function(res) {
                    $scope.clearData();
                });
            };
            $ionicLoading.hide();
            $scope.showAlert();
            console.error( 'Error', JSON.stringify(error));
        });
    }
})

.service("logout",[ function(){
    
    // Logout function
    this.logout = function() {
        window.localStorage.removeItem( 'CurrentUser' );
        window.localStorage.removeItem( 'Cart' );
    }
}])

.config( function( $httpProvider ) {
    var user = JSON.parse(window.localStorage.getItem( 'CurrentUser' ));

    if (user != null) {
        $httpProvider.interceptors.push( ['$q', '$location', function($q, $location) {
            return {
                'request': function( config ) {
                    
                    config.headers = config.headers || {};
                    //add the Authorization header for each subsequent request
                    if ( user[0].token && config.headers.Authorization == null && config.url.indexOf('https://api.stripe.com/v1/') == -1) {
                        config.headers.Authorization = 'Bearer ' + user[0].token;
                    }
                    return config;
                }
            };
        }]);
    } else {
        return {
            'request': function ( config) {
                config.headers = config.headers || {};
                config.headers.Authorization = null;

                return config;
            }
        }
    }
})