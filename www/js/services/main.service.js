angular.module('OnceOffApp')

    .factory("MainService", [function() {
        return {
            getTestString: function () {
                return "Test";
            },
            getCurrentDate: function() {
                return new Date();
            }
        }
    }]);
