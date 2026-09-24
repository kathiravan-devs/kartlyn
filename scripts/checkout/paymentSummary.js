import { cart, totalCartQuantityUpdate } from "../../data/cart.js";
import { getProducts } from '../../data/products.js';
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';
import { addOrder } from "../../data/orders.js";
import { renderOrders } from "../../data/orders.js";
import { renderOrderSummary } from "./orderSummary.js";


export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProducts(cartItem.productId);

        productPriceCents += (product.priceCents * cartItem.quantity);

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = Math.round(totalBeforeTaxCents * 0.1);
    const totalCents = totalBeforeTaxCents + taxCents;
    const totalCartQuantity = totalCartQuantityUpdate();
    let paymentSummaryContainer = document.querySelector('.js-payment-summary');

    paymentSummaryContainer.innerHTML =
        `
                <div class="payment-summary-title">
                    Order Summary
                </div>

                <div class="payment-summary-row">
                    <div>Items (${totalCartQuantity}):</div>
                    <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Shipping &amp; handling:</div>
                    <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
                </div>

                <div class="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
                </div>

                <button class="place-order-button button-primary js-place-order ">
                    Place your order
                </button>
            ` ;

    if (cart.length === 0) {
        let placeOrderBtn = document.querySelector('.place-order-button');
        placeOrderBtn.classList.remove('js-place-order')
        placeOrderBtn.style.opacity = 0.5;
        document.querySelector('.cart-empty').style.display = 'initial';
        renderOrderSummary();
    }


    document.querySelector('.js-place-order')
        .addEventListener('click', async () => {

            try {

                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });

                const order = await response.json();
                addOrder(order);
                renderOrders();
                localStorage.removeItem('cart')
                window.location.href = "orders.html";
            } catch (error) {
                alert('Unexpected Error, Please Try Again.' + error)
            }

        });
}
