import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { normalizeSearchTerm, searchProducts } from './utils/productSearch.js';

const productsGrid = document.querySelector('.js-products-grid');
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
const searchResultsStatus = document.querySelector('.js-search-results-status');
let activeSearchTerm = '';

// Rendering Products
loadProducts(updateSearchResults);

function renderProduct(product) {
    return `
        <div class="product-container js-product-container-${product.id}">
            <div class="product-image-container">
            <img class="product-image" src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
            ${product.name}
            </div>

            <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarUrl()}">
            <div class="product-rating-count link-primary">
                ${product.rating.count}
            </div>
            </div>

            <div class="product-price">
                ${product.getPrice()}
            </div>

            <div class="product-quantity-container js-product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>
            <div class = "product-other-info">
                ${product.getFeatureInfo()}
                ${product.getWarranty()}
            </div>
            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
            Add to Cart
            </button>
      </div> `;
}

function renderProductsGrid(productsToRender = products) {

    let productsHTML = '';

    productsToRender.forEach((product) => {

        productsHTML += renderProduct(product);

    });

    if (!productsHTML) {
        productsGrid.innerHTML = `
          <div class="search-no-results">
            No products found. Try a different search term.
          </div>`;
        return;
    }

    productsGrid.innerHTML = productsHTML;

    updateCartQuantity();

    // to update card quantity

    function updateCartQuantity() {
        let cartQuantity = 0;
        cart.forEach((cartItem) => {

            cartQuantity += cartItem.quantity;
        })

        let showCartQuantity = document.querySelector('.js-cart-quantity');
        showCartQuantity.textContent = cartQuantity;
        document.querySelector('.js-cart-quantity-mobile').textContent = cartQuantity

    }

    document.querySelectorAll('.js-add-to-cart')
        .forEach((button) => {

            button.addEventListener('click', () => {

                const productId = button.dataset.productId;
                const selectedQuantity = selectedCartQuantityInOption(productId);
                products.forEach((product) => {
                    if (product.id === productId) {
                        if (product.stock === 'unavailable') {
                            alert(`Product didn't available in Stock`);
                        } else {
                            addToCart(productId, selectedQuantity);
                            updateCartQuantity();
                            showAdded(productId);
                        }
                    }
                })

            });
        });


    function showAdded(productId) {
        const addedProductId = document.querySelector(`.js-product-container-${productId}`)
        addedProductId.classList.add('js-show-added');
        setTimeout(() => {
            addedProductId.classList.remove('js-show-added');
        }, 4000);
    }


    function selectedCartQuantityInOption(productId) {
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const selectedQuantity = quantitySelector.options[quantitySelector.selectedIndex].value;
        return Number(selectedQuantity);
    }

}

function updateSearchResults() {
    activeSearchTerm = normalizeSearchTerm(searchInput.value);
    const matchingProducts = searchProducts(products, activeSearchTerm);

    renderProductsGrid(matchingProducts);

    if (!activeSearchTerm) {
        searchResultsStatus.textContent = '';
        return;
    }

    searchResultsStatus.textContent = matchingProducts.length === 1
        ? '1 product found.'
        : `${matchingProducts.length} products found.`;
}

searchInput.addEventListener('input', updateSearchResults);

searchButton.addEventListener('click', updateSearchResults);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        updateSearchResults();
    }
});


//hamburger menu for mobile

let menu = document.querySelector('.menu-dropdown');
let isOpen = false;
document.querySelector('.js-mobile-right-section').addEventListener('click', () => {

    if (!isOpen) {
        menu.classList.add('menu-dropdown-show');
        isOpen = true;

    } else {
        menu.classList.remove('menu-dropdown-show');
        isOpen = false;
    }
})
