import { cart, totalCartQuantityUpdate } from "./cart.js";
import { orders } from "./orders.js";
import { getProducts, loadProducts } from './products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

document.getElementById('js-cart-quantity').innerHTML = totalCartQuantityUpdate();

loadProducts(
    function renderTracking() {
        const url = new URL(window.location.href);
        const trackingOrderId = url.searchParams.get('orderId');
        const trackingProductId = url.searchParams.get('productId');
        const trackingProduct = getProducts(trackingProductId);

        const trackingOrder = orders.find(order => order.id === trackingOrderId);
        const trackingItem = trackingOrder.products.find(p => p.productId === trackingProductId);

        const arrivingDate = dayjs(trackingItem.estimatedDeliveryTime).format('dddd, MMMM D');

        const orderStart = dayjs(trackingOrder.orderTime).valueOf();
        const deliveryEnd = dayjs(trackingItem.estimatedDeliveryTime).valueOf();
        const now = dayjs().valueOf();

        const totalDuration = deliveryEnd - orderStart;
        const elapsed = now - orderStart;

        let progressPercent = (elapsed / totalDuration) * 100;
        progressPercent = Math.min(Math.max(progressPercent, 0), 100);


        let currentStatus;
        if (progressPercent < 33) {
            currentStatus = 'Preparing';
        } else if (progressPercent < 100) {
            currentStatus = 'Shipped';
        } else {
            currentStatus = 'Delivered';
        }


        let trackingOrderQuantity;
        cart.forEach((cartItem) => {
            if (cartItem.productId === trackingProductId) {
                trackingOrderQuantity = cartItem.quantity;
            }
        })


        let container = document.querySelector('.js-order-tracking');

        let trackingHTML =
            `
                <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
                </a>

                <div class="delivery-date">
                ${arrivingDate}
                </div>

                <div class="product-info">
                ${trackingProduct.name}
                </div>

                <div class="product-info">
                Quantity: ${trackingOrderQuantity}
                </div>

                <img class="product-image" src="${trackingProduct.image}">

                <div class="progress-labels-container">
                <div class="progress-label ${currentStatus === 'Preparing' ? 'current-status' : ''}">
                    Preparing
                </div>
                <div class="progress-label ${currentStatus === 'Shipped' ? 'current-status' : ''}">
                    Shipped
                </div>
                <div class="progress-label ${currentStatus === 'Delivered' ? 'current-status' : ''}">
                    Delivered
                </div>
                </div>

                <div class="progress-bar-container">
                <div class="progress-bar" style="width: 0%"></div>
                </div>
            `

        container.innerHTML = trackingHTML;

        // animate the fill after render

        requestAnimationFrame(() => {
            
            document.querySelector('.progress-bar').style.width = `${progressPercent > 2 ? progressPercent : 2}%`;

        });
    })

document.querySelector('.js-cart-quantity-mobile').innerHTML = totalCartQuantityUpdate();

let menu = document.querySelector('.menu-dropdown');
let isOpen = false;
document.querySelector('.js-mobile-right-section')
    .addEventListener('click', () => {

        if (!isOpen) {
            menu.classList.add('menu-dropdown-show');
            isOpen = true;

        } else {
            menu.classList.remove('menu-dropdown-show');
            isOpen = false;
        }
    })