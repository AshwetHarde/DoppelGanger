var ProductImg = document.getElementById("ProductImg");
var SmallImg = document.getElementsByClassName("small-img");

$(document).ready(function() {
    // Change main product image on click of small images
    for (let i = 0; i < SmallImg.length; i++) {
        $(SmallImg[i]).click(function() {
            ProductImg.src = SmallImg[i].src;
        });
    }

    // Handle tab navigation in product details
    $('.product-inf a').click(function() {
        $('.product-inf li').removeClass('active');
        $(this).parent().addClass('active');

        let currentTab = $(this).attr('href');
        $('.tabs-content div').hide();
        $(currentTab).show();

        return false;
    });

    // Toggle cart visibility
    $("#toggleCart").click(function () {
        $(".cart-container").toggleClass("show");
    });

    // Close cart when close button is clicked
    $(".cart-close").click(function () {
        $(".cart-container").removeClass("show");
    });

    // Close cart when clicking outside of it
    $(document).mouseup(function(e) {
        var container = $(".cart-container");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass("show");
        }
    });


    // Load cart items from local storage on page load
    loadCartItems();

    // Add product to cart
    $(".add-to-cart").click(function () {
        const productTitle = $(".product-title").text();
        const productPrice = 1250; // Assuming the price is ₹1250
        let quantity = parseInt($(".quantity").val());

        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1; // Set default quantity to 1 if invalid
        } else if (quantity > 10) {
            quantity = 10; // Limit quantity to maximum of 10
        }

        // Check if the product is already in the cart
        const existingItem = $(".cart-items li").filter(function () {
            return $(this).find(".cart-item-title").text().trim() === productTitle;
        });

        if (existingItem.length === 0) {
            // Create new cart item
            const cartItem = `
                <li>
                    <div class="cart-item">
                        <img src="${ProductImg.src}" class="item-img" alt="Product Image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${productTitle}</h4>
                            <div class="cart-item-quantity">
                                Quantity: <span>${quantity}</span>
                            </div>
                            <div class="cart-item-price">
                                Price: &#x20B9; ${(productPrice * quantity).toFixed(2)}
                            </div>
                        </div>
                        <span class="cart-item-remove">&times;</span>
                    </div>
                </li>
            `;
            $(".cart-items").append(cartItem);
        } else {
            // Update existing cart item quantity and total price
            existingItem.find(".cart-item-quantity span").text(quantity);
            existingItem.find(".cart-item-price").text(`Price: \u20B9 ${(productPrice * quantity).toFixed(2)}`);
        }

        // Save updated cart to local storage
        saveCartItems();

        // Show the cart
        $(".cart-container").addClass("show");

        // Update payment summary
        updatePaymentSummary();
    });

    // Remove product from cart
    $(document).on("click", ".cart-item-remove", function() {
        $(this).closest("li").remove();
        
        // Save updated cart to local storage
        saveCartItems();

        // Update payment summary after removing item
        updatePaymentSummary();
    });

    function updatePaymentSummary() {
        let subtotal = 0;
        let itemCount = 0; // Initialize item count
        $(".cart-item").each(function() {
            const price = parseFloat($(this).find(".cart-item-price").text().replace('Price: ₹', ''));
            const quantity = parseInt($(this).find(".cart-item-quantity span").text());
            subtotal += price;
            itemCount += quantity; // Add quantity to item count
        });
    
        // Update the cart item count badge and hide if cart is empty
        if (itemCount > 0) {
            $("#cartItemCount").text(itemCount).show();
        } else {
            $("#cartItemCount").hide();
        }

        const shippingAmount = subtotal >= 2500 ? 'FREE' : '&#x20B9; 149.00';
        const totalAmount = subtotal >= 2500 ? subtotal : subtotal + 149;
        const shippingMessage = subtotal >= 2500 ? 'YOU GOT FREE SHIPPING!' : '';

        $("#subtotalAmount").html('&#x20B9; ' + subtotal.toFixed(2));
        $("#shippingAmount").html(shippingAmount);
        $("#totalAmount").html('&#x20B9; ' + totalAmount.toFixed(2));
        $("#shippingMessage").html(shippingMessage); // Display shipping message conditionally

        if (subtotal >= 2500) {
            $("#shippingMessage").show();
        } else {
            $("#shippingMessage").hide();
        }

        $(".payment-summary-box").show(); // Show the payment summary box

        // Hide payment summary box if cart is empty
        if (subtotal === 0) {
            $(".payment-summary-box").hide();
        }

        // Update the cart item count badge
        $("#cartItemCount").text(itemCount);
    }

    function saveCartItems() {
        const cartItems = [];
        $(".cart-item").each(function() {
            const item = {
                title: $(this).find(".cart-item-title").text().trim(),
                img: $(this).find(".item-img").attr("src"),
                quantity: $(this).find(".cart-item-quantity span").text().trim(),
                price: $(this).find(".cart-item-price").text().replace('Price: ₹', '').trim()
            };
            cartItems.push(item);
        });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Clear existing cart items to avoid duplicates
        $(".cart-items").empty();

        cartItems.forEach(item => {
            const cartItem = `
                <li>
                    <div class="cart-item">
                        <img src="${item.img}" class="item-img" alt="Product Image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-quantity">
                                Quantity: <span>${item.quantity}</span>
                            </div>
                            <div class="cart-item-price">
                                Price: &#x20B9; ${item.price}
                            </div>
                        </div>
                        <span class="cart-item-remove">&times;</span>
                    </div>
                </li>
            `;
            $(".cart-items").append(cartItem);
        });

        // Update payment summary after loading cart items
        updatePaymentSummary();
        
    }


    // Function to update cart status and display message
function updateCartStatus() {
    const cartItems = $(".cart-items").children().length;
    if (cartItems === 0) {
        $("#emptyCartMessage").show();
        $("#shopNowButton").show();
        $(".checkout-button").hide();
        $("#cartTitle").hide(); // Hide Your Cart title
    } else {
        $("#emptyCartMessage").hide();
        $("#shopNowButton").hide();
        $(".checkout-button").show();
        $("#cartTitle").show(); // Show Your Cart title
    }
}

// Call updateCartStatus on page load and after adding/removing items from the cart
$(document).ready(function() {
    updateCartStatus();

    // Add product to cart
    $(".add-to-cart").click(function () {
        // Your existing code to add product to cart

        updateCartStatus();
        $(".cart-container").addClass("show");
        updatePaymentSummary();
    });

    // Remove product from cart
    $(document).on("click", ".cart-item-remove", function() {
        // Your existing code to remove product from cart

        updateCartStatus();
        updatePaymentSummary();
    });

    // Load cart items on page load
    loadCartItems();
});


});
 