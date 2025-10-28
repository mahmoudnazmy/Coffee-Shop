document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const customerInfoSection = document.getElementById('customer-info-section');
    const orderSummarySection = document.getElementById('order-summary-section');
    const cartIcon = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const userInfoForm = document.getElementById('user-info-form');
    const clearCartButton = document.getElementById('clear-cart');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // --- State ---
    let cart = (JSON.parse(localStorage.getItem('cart')) || []).map(item => ({
        ...item,
        id: String(item.id), // Ensure ID is always a string
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10)
    }));

    // --- Core Functions ---

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const updateCartIcon = () => {
        if (cartIcon) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartIcon.textContent = totalItems;
            cartIcon.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    };

    const renderCart = () => {
        // Render Cart Items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = ''; // Clear existing items
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center text-center py-16 min-h-[50vh]">
                        <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">production_quantity_limits</span>
                        <h2 class="mt-4 text-2xl font-bold text-[#181411] dark:text-white">سلة مشترياتك فارغة</h2>
                        <p class="mt-2 text-gray-500 dark:text-gray-400">لم تقم بإضافة أي منتجات بعد. هيا بنا نتسوق!</p>
                        <a href="menu.html" class="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-base font-bold text-white cartoon-border transition hover:scale-105">
                            اذهب للتسوق
                        </a>
                    </div>
                `;
                // Hide customer info and order summary if cart is empty
                if (customerInfoSection) customerInfoSection.style.display = 'none';
                if (orderSummarySection) orderSummarySection.style.display = 'none';
            } else {
                // Show customer info and order summary if cart is not empty
                if (customerInfoSection) customerInfoSection.style.display = 'block'; // Assuming block display
                if (orderSummarySection) orderSummarySection.style.display = 'block'; // Assuming block display

                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('flex', 'items-center', 'gap-4', 'bg-white', 'dark:bg-background-dark/50', 'p-4', 'min-h-[72px]', 'justify-between', 'rounded-lg');
                    cartItemElement.innerHTML = `
                        <div class="flex items-center gap-4">
                            <img src="${item.image || 'https://via.placeholder.com/64'}" alt="${item.name}" class="size-16 rounded-lg object-cover cartoon-border"/>
                            <div class="flex flex-col justify-center">
                                <p class="text-[#181411] dark:text-white text-base font-bold leading-normal line-clamp-1">${item.name || 'منتج غير معروف'}</p>
                                <p class="text-[#897361] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">${item.price ? item.price.toFixed(2) : '0.00'} جنيه</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="shrink-0">
                                <div class="flex items-center gap-2 text-[#181411] dark:text-white">
                                    <button class="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f2f0] dark:bg-primary/20 cursor-pointer transition-transform hover:scale-110" onclick="updateQuantity('${item.id}', -1)">-</button>
                                    <span class="text-base font-bold leading-normal w-5 text-center">${item.quantity}</span>
                                    <button class="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f2f0] dark:bg-primary/20 cursor-pointer transition-transform hover:scale-110" onclick="updateQuantity('${item.id}', 1)">+</button>
                                </div>
                            </div>
                            <button class="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-transform hover:scale-110" onclick="removeFromCart('${item.id}')">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });
            }
        }

        // Render Cart Summary
        if (cartSummaryContainer) {
            if (cart.length === 0) {
                 cartSummaryContainer.innerHTML = ''; // Clear summary if cart is empty
            } else {
                const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                const shipping = 30.00;
                const total = subtotal + shipping;

                cartSummaryContainer.innerHTML = `
                    <h3 class="text-lg font-bold text-[#181411] dark:text-white mb-4">ملخص الطلب</h3>
                    <div class="space-y-2 border-b border-[#f4f2f0] dark:border-primary/20 pb-4 mb-4">
                        <div class="flex justify-between gap-x-6 py-2">
                            <p class="text-[#897361] dark:text-gray-400 text-sm font-normal">المجموع الفرعي</p>
                            <p class="text-[#181411] dark:text-white text-sm font-normal text-right">${subtotal.toFixed(2)} جنيه</p>
                        </div>
                        <div class="flex justify-between gap-x-6 py-2">
                            <p class="text-[#897361] dark:text-gray-400 text-sm font-normal">الشحن</p>
                            <p class="text-[#181411] dark:text-white text-sm font-normal text-right">${shipping.toFixed(2)} جنيه</p>
                        </div>
                    </div>
                    <div class="flex justify-between gap-x-6 py-2">
                        <p class="text-[#181411] dark:text-white text-lg font-bold">الإجمالي</p>
                        <p class="text-primary text-lg font-bold text-right">${total.toFixed(2)} جنيه</p>
                    </div>
                `;
            }
        }
        
        updateCartIcon();
    };

    // --- Event Handlers ---

    window.updateQuantity = (productId, change) => {
        const itemIndex = cart.findIndex(item => String(item.id) === String(productId));
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart();
            renderCart();
        }
    };

    window.removeFromCart = (productId) => {
        cart = cart.filter(item => String(item.id) !== String(productId));
        saveCart();
        renderCart();
    };

    const clearCart = () => {
        if (confirm("هل أنت متأكد أنك تريد إفراغ سلة المشتريات؟")) {
            cart = [];
            saveCart();
            renderCart();
        }
    };

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productElement = button.closest('.product');
            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);
            const productImage = productElement.dataset.image;

            const existingItem = cart.find(item => String(item.id) === String(productId));
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
            }
            saveCart();
            updateCartIcon();
        });
    });

    if (userInfoForm) {
        userInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert("سلتك فارغة! يرجى إضافة منتجات أولاً.");
                return;
            }

            const formData = new FormData(userInfoForm);
            const name = formData.get('name').trim();
            const phone = formData.get('phone').trim();
            const address = formData.get('address').trim();
            const notes = formData.get('notes').trim();

            if (!name || !phone || !address) {
                alert("يرجى إدخال الاسم ورقم الهاتف والعنوان.");
                return;
            }

            const whatsAppNumber = '201000000000'; // Replace with your WhatsApp number
            let message = `*طلب جديد من قهوة عمي سعيد*\n\n`;
            message += `*الاسم:* ${name}\n`;
            message += `*رقم الهاتف:* ${phone}\n`;
            message += `*العنوان:* ${address}\n\n`;
            message += `*الطلبات:*\n`;

            cart.forEach(item => {
                message += `- ${item.name} (الكمية: ${item.quantity}) - ${item.price.toFixed(2)} جنيه\n`;
            });

            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const total = subtotal + 30.00; // with shipping

            message += `\n*المجموع الفرعي:* ${subtotal.toFixed(2)} جنيه\n`;
            message += `*الشحن:* 30.00 جنيه\n`;
            message += `*الإجمالي:* ${total.toFixed(2)} جنيه\n\n`;

            if (notes) {
                message += `*ملاحظات:* ${notes}\n`;
            }

            const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            // Clear cart after successful order
            cart = [];
            saveCart();
            renderCart();

            alert("تم إرسال طلبك بنجاح! سيتم تحويلك إلى واتساب لإتمام الطلب.");
        });
    }

    if(clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    if(mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Category Filtering ---
    const filterContainer = document.getElementById('category-filters');
    const productItems = document.querySelectorAll('#product-grid .product');

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-filter')) {
                e.preventDefault();

                // Update active filter button
                filterContainer.querySelector('.active-filter').classList.remove('active-filter');
                e.target.classList.add('active-filter');

                const filterValue = e.target.dataset.filter;

                // Show/hide products
                productItems.forEach(product => {
                    if (filterValue === 'all' || product.dataset.category === filterValue) {
                        product.style.display = 'flex';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
        });
    }

    // --- Initial Render ---
    renderCart();
});