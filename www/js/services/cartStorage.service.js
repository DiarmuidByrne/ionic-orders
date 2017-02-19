angular.module('OnceOffApp.services')

.factory('CartService', [function() {
    var cartContents = [];

    return {
        getCart: getCart,
        addToCart: addToCart,
        emptyCart: emptyCart
    };

    function getCart(){
        return cartContents;
    }

    function addToCart(item) {
        cartContents.push(item);
        console.log(cartContents);
    }

    function emptyCart(){
        cartContents = [];
    }
}]);
