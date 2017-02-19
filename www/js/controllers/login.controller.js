// Populates list once when page is loaded
angular.module('OnceOffApp.controllers.login', [])

.controller('LoginCtrl', ['$scope', 'logout', '$ionicSideMenuDelegate', '$ionicHistory', '$http', '$ionicLoading', '$state', '$ionicPopup', '$timeout',
  function($scope, logout, $ionicSideMenuDelegate, $ionicHistory, $http, $ionicLoading, $state, $ionicPopup, $timeout) {
    $scope.loginData = {};

    $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.clearData();
    });
    $scope.$on('$ionicView.leave', function() {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.clearData = function() {
        $scope.loginData.username = "";
        $scope.loginData.password = "";

        // Delete current user token if user exists (Log out)
        if (window.localStorage.getItem('CurrentUser') != null) {
            logout.logout();
        }

      $timeout(function() {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
      }, 300);
    }

    $scope.login = function() {
      $ionicLoading.show({
        template: '<ion-spinner class="light"></ion-spinner>'
      });

      var apiHost = 'https://onceoff.com/wp-json';
      $http.post(apiHost + '/jwt-auth/v1/token', {
          username: $scope.loginData.username,
          password: $scope.loginData.password
        })
        .then(function(response) {
          var token = response.data.token;

          $http({
              method: 'GET',
              url: apiHost + '/wp/v2/users/me',
              headers: {
                Authorization: 'Bearer ' + response.data.token
              }
            })
            .then(function(res) {
              $ionicLoading.hide();

              $scope.user = []
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
        .catch(function(error) {
          var errMessage;
          if (error.status == '403') errMessage = 'Invalid Username or Password. Please Try again'
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
          console.error('Error', JSON.stringify(error));
        });
    }
  }
])

.service("logout", [function() {

    // replace with sessionservice and cartService
  // Logout function
  this.logout = function() {
    window.localStorage.removeItem('CurrentUser');
    window.localStorage.removeItem('Cart');
  }
}]);
