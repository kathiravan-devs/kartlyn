import { addToCart, totalCartQuantityUpdate } from "./cart.js";
import { getProducts, loadProducts } from "./products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "../scripts/utils/money.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function showCartQuantity() {
    const quantityEl = document.querySelector('.cart-quantity');
    if (quantityEl) {
        quantityEl.innerHTML = totalCartQuantityUpdate();
    }

}

export function renderOrders() {

    loadProducts(() => {

        showCartQuantity();

        const container = document.querySelector('.js-order-container');

        if (!container) {
            return;
        }

        // Build ALL orders first
        let ordersHTML = '';

        orders.forEach((order) => {

            const orderDate =
                dayjs(order.estimatedDeliveryTime).format('MMMM D');

            // Products belonging to THIS order
            let orderContainerHTML = '';

            order.products.forEach((orderProduct) => {

                const matchingProduct =
                    getProducts(orderProduct.productId);

                if (!matchingProduct) {
                    return;
                }

                const arrivingDate =
                    dayjs(orderProduct.estimatedDeliveryTime)
                        .format('MMMM D');

                orderContainerHTML += `
                    <div class="product-image-container">
                        <img src="${matchingProduct.image}">
                    </div>

                    <div class="product-details">

                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>

                        <div class="product-delivery-date">
                            Arriving on: ${arrivingDate}
                        </div>

                        <div class="product-quantity">
                            Quantity: ${orderProduct.quantity}
                        </div>

                        <button class="buy-again-button js-buy-again-button button-primary"
                            data-product-id=${matchingProduct.id}>
                            <img
                                class="buy-again-icon"
                                src="images/icons/buy-again.png"
                            >
                            <span class="buy-again-message">
                                Buy it again
                            </span>
                            <img
                                class="buyed-icon"
                                src="images/icons/buyed-check-icon.png"
                            >
                            <span class="buyed-message">
                                Added
                            </span>
                        </button>

                    </div>

                    <div class="product-actions">

                        <a
                            href="tracking.html?orderId=${order.id}&productId=${matchingProduct.id}"
                        >
                            <button class="track-package-button button-secondary">
                                Track package
                            </button>
                        </a>

                    </div>
                `;
            });

            // Add THIS order to the complete HTML
            ordersHTML += `
                <div class="order-container">

                    <div class="order-header">

                        <div class="order-header-left-section">

                            <div class="order-date">
                                <div class="order-header-label">
                                    Order Placed:
                                </div>

                                <div>
                                    ${orderDate}
                                </div>
                            </div>

                            <div class="order-total">
                                <div class="order-header-label">
                                    Total:
                                </div>

                                <div>
                                    $${formatCurrency(order.totalCostCents)}
                                </div>
                            </div>

                        </div>

                        <div class="order-header-right-section">

                            <div class="order-header-label">
                                Order ID:
                            </div>

                            <div>
                                ${order.id}
                            </div>

                        </div>

                    </div>

                    <div class="order-details-grid">
                        ${orderContainerHTML}
                    </div>

                </div>
            `;

        });

        // Render ALL orders only once
        container.innerHTML = ordersHTML;
        document.querySelectorAll('.js-buy-again-button')
            .forEach((button) => {
                button.addEventListener('click', () => {

                    const productId = button.dataset.productId;
                    const quantity = 1;

                    addToCart(productId, quantity);

                    button.classList.add('buyed-button');
                    setTimeout(() => {
                        button.classList.remove('buyed-button');
                    }, 2182);

                    showCartQuantity();
                });
            });
        // Save the complete orders array
        saveToStorage();

    });


}

renderOrders();

