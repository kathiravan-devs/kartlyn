import { cart, removeFromCart, updateDeliveryOption, saveToStorage } from '../../data/cart.js';
import { products, getProducts } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { checkoutUpdate } from './checkoutHeader.js';



//for rendering checkout products

export function renderOrderSummary() {

    let cartSummaryHTML = '';

    // Generate Cart Products 
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        
        let matchingProduct = getProducts(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        let matchingDeliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(matchingDeliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML += `
        
        <div class="cart-item-container 
                js-test-cart-item-container
                js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-test-product-quantity-${matchingProduct.id}">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link"
                        data-product-id='${matchingProduct.id}'>
                        Update
                    </span>
                    <input type="number" class="quantity-input js-quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-quantity-link"
                         data-product-id='${matchingProduct.id}'>
                    Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link js-test-delete-link-${matchingProduct.id}"
                        data-product-id='${matchingProduct.id}'>
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}   
                </div>
            </div>
        </div>
    `;
    });

    //generate orderSummary in page
    document.querySelector('.js-order-summary')
        .innerHTML = cartSummaryHTML;

    // generating delivery options and 
    // using dayjs external Library for date manipulation
    function deliveryOptionsHTML(matchingProduct, cartItem) {

        let html = '';

        deliveryOptions.forEach((deliveryOption) => {

            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = deliveryOption.priceCents === 0
                ? 'FREE'
                : `$${formatCurrency(deliveryOption.priceCents)}`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html +=
                 `
                    <div class="delivery-option js-delivery-option"
                    data-product-id='${matchingProduct.id}'
                    data-delivery-option-id ='${deliveryOption.id}'>
                        <input type="radio" ${isChecked ? 'checked' : ''} value="${deliveryOption.id}"
                        class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                        <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} - Shipping
                        </div>
                        </div>
                    </div>
                `   
        });
        return html
    }

    // for delete cart products 
    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                renderPaymentSummary();
                checkoutUpdate();

                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.remove();
            });
        });

    // for update and show save options
    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add('is-editing-quantity');
            });

        });


    // for save and update quantity

    document.querySelectorAll('.js-save-quantity-link')
        .forEach((link) => {
            const productId = link.dataset.productId;
            function saveQuantity() {
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.remove('is-editing-quantity');

                const quantityInput = container.querySelector('.js-quantity-input');
                let newQuantity = Number(quantityInput.value);

                const quantityLabel = container.querySelector('.quantity-label');
                let oldQuantity = Number(quantityLabel.textContent);
                let updatedQuantity = oldQuantity + newQuantity;

                if (((updatedQuantity) > 25) || ((updatedQuantity) < 0)) {
                    alert('Cart has limit, 25 per product');
                    quantityInput.value = '';
                    return;
                }

                quantityLabel.textContent = updatedQuantity;
                quantityInput.value = '';



                cart.forEach((cartItem) => {

                    if (cartItem.productId === productId) {

                        cartItem.quantity = updatedQuantity;
                        saveToStorage();
                        renderPaymentSummary();
                        checkoutUpdate();

                    }
                });
            }

            link.addEventListener('click', saveQuantity);

            document.querySelector(`.js-quantity-input-${productId}`)
                .addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        saveQuantity();
                    }
                });
        });


    // for retrieving data for update delivery option
    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const { productId, deliveryOptionId } = element.dataset;

                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();

            });
        });
}


