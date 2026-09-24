function Cart(localStoragekey) {

    const cart = {
        cartItems: undefined,
        loadFromStorage() {
            this.cartItems = JSON.parse(localStorage.getItem(localStoragekey));

            if (!this.cartItems) {
                this.cartItems = [{
                    productId: "4e72c9a5-83f1-46bd-a027-59c314e68f20",
                    quantity: 2,
                    deliveryOptionId: '1'
                }, {
                    productId: "d84b1e63-97f5-42ca-a806-31e59c724bf8",
                    quantity: 1,
                    deliveryOptionId: '2'
                }];
            }
        },
        saveToStorage() {
            localStorage.setItem(localStoragekey, JSON.stringify(this.cartItems))
        },
        addToCart(productId, quantity) {

            let matchingItem;

            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingItem = cartItem;
                }
            });

            if (matchingItem) {
                matchingItem.quantity += quantity;
            } else {
                this.cartItems.push({
                    productId: productId,
                    quantity: quantity,
                    deliveryOptionId: '1'
                });
            }
            this.saveToStorage();
        },
        removeFromCart(productId) {
            const newCart = [];

            this.cartItems.forEach((cartItem) => {
                if (cartItem.productId !== productId) {
                    newCart.push(cartItem);
                }
            })
            this.cartItems = newCart;

            this.saveToStorage();
        },
        updateDeliveryOption(productId, deliveryOptionId) {
            let matchingItem;

            this.cartItems.forEach((cartItem) => {
                if (productId === cartItem.productId) {
                    matchingItem = cartItem;
                }
            });
            matchingItem.deliveryOptionId = deliveryOptionId;

            this.saveToStorage();
        },
        totalCartQuantityUpdate() {
            let totalCartQuantity = 0;
            this.cartItems.forEach((cartItem) => {
                totalCartQuantity += cartItem.quantity;
            })
            return totalCartQuantity;
        }

    };
    return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');

cart.loadFromStorage();
businessCart.loadFromStorage();


