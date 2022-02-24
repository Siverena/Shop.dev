//*************   cart.js *******/

/** 
 * Устанавливает счетчик на иконке корзины в хэдере
 */
let setCartCounter = () => {
        let cartCounter = document.querySelector('.cart-link__count');
        if (localStorage.cart) {
            cartCounter.textContent = JSON.parse(localStorage.cart).length;
            cartCounter.classList.remove('visually-hidden');
        } else {
            cartCounter.textContent = "";
            cartCounter.classList.add('visually-hidden');
        }
    }
    (function() {
        let clearCartButton;
        let cartList;
        let subTotal;
        let grandTotal;
        if (document.querySelector('#clear-cart-btn')) {
            clearCartButton = document.querySelector('#clear-cart-btn');
        }
        if (document.querySelector('.cart')) {
            cartList = document.querySelector('.cart');
        }
        /**
         * Считает итоговую сумму в корзине
         * @returns {float} сумма
         */
        let calcTotal = () => {
                let cartItems;
                if (!localStorage.cart) {
                    return 0;
                }
                let total = 0
                cartItems = JSON.parse(localStorage.cart);
                cartItems.forEach(item => {
                    total += item.price * item.quantity;
                })
                return total;
            }
            /**
             * Обновляет значения sub total и grand total в корзине
             * @param {int} discount - скидка в процентах, по умолчанию 0
             */
        let updateTotals = (discount = 0) => {
                let total = calcTotal();
                subTotal.textContent = `$${total}`;
                grandTotal.textContent = `$${(total * (1 - discount / 100)).toFixed(2)}`;
            }
            /**
             * Создать элемент корзины
             * @param {} item - элемент корзины
             * @param {} cin - порядковый номер элемента корзине
             * @returns {HTMLElement} - разметка элемента корзины
             */
        let createCartItem = (item, cin) => {
                let itemData = productsDataList.find(prod => prod.id === item.id);
                let cartElem = document.createElement('li');
                cartElem.dataset.id = item.id;
                cartElem.className = 'cart__item goods';
                let img = document.createElement('img');
                img.src = `img/product/${itemData.img[0]}`;
                img.alt = itemData.name;
                img.setAttribute('width', '262');
                img.setAttribute('height', '306');
                img.className = 'goods__img';
                let description = document.createElement('div');
                description.className = 'goods__description';
                let itemName = document.createElement('a');
                itemName.className = 'goods__name';
                itemName.href = `product-page.html?id=${item.id}`;
                itemName.innerHTML = itemData.name;
                let price = document.createElement('p');
                price.className = 'goods__text goods__text--price';
                price.innerText = 'Price: ';
                let priceValue = document.createElement('span');
                priceValue.innerText = `$${itemData.price}`;
                price.append(priceValue);
                let color = document.createElement('p');
                color.className = 'goods__text';
                color.innerText = 'Color: ';
                let colorValue = document.createElement('span');
                colorValue.innerText = item.color;
                color.append(colorValue);
                let size = document.createElement('p');
                size.className = 'goods__text';
                size.innerText = 'Size: ';
                let sizeValue = document.createElement('span');
                sizeValue.innerText = item.size;
                size.append(sizeValue);
                let quantity = document.createElement('div');
                quantity.className = 'goods__input-wrap';
                let quantityLabel = document.createElement('label');
                quantityLabel.className = 'goods__quantity';
                quantityLabel.htmlFor = `quantity${cin}`;
                quantityLabel.innerText = 'Quantity:';
                let quantityInput = document.createElement('input');
                quantityInput.id = `quantity${cin}`;
                quantityInput.name = `quantity${cin}`;
                quantityInput.type = 'number';
                quantityInput.value = item.quantity;
                quantity.append(quantityLabel, quantityInput);
                let removeBtn = document.createElement('button');
                removeBtn.className = 'goods__delete';
                let removeBtnText = document.createElement('span');
                removeBtnText.className = 'visually-hidden';
                removeBtnText.innerText = 'Удалить';
                removeBtn.append(removeBtnText);
                description.append(itemName, price, color, size, quantity, removeBtn);
                cartElem.append(img, description);
                return cartElem; // через clonenode было бы короче...
            }
            /**
             * Обработчик события изменения товара в корзине
             * @param {Event} evt 
             */
        let onCartChange = (evt) => {
                let changed = { id: evt.target.id, value: evt.target.value };
                if (changed.id.match(/quantity/i)) {
                    changed.type = 'quantity';
                    changed.value = parseInt(changed.value);
                }
                //тут аналогично дописать для изменений цвета и размера
                let cartDataList = JSON.parse(localStorage.cart);
                cartDataList[evt.currentTarget.dataset.cin][changed.type] = changed.value;
                localStorage.cart = JSON.stringify(cartDataList);
                fillCartList(cartDataList, cartList);
            }
            /**
             * Отрисовыввает элементы корзины
             * @param {} items коллекция товаров в корзине
             * @param {HTMLElement} parent родительский элемент, в который будем вставлять 
             */
        let fillCartList = (items, parent) => {
                while (parent.firstElementChild && !parent.firstElementChild.classList.contains('cart__button-wrap')) {
                    parent.removeChild(parent.firstElementChild);
                }
                for (let i = 0; i < items.length; i++) {
                    let insertedElem = parent.insertBefore(createCartItem(items[i], i), parent.querySelector('.cart__button-wrap'));
                    insertedElem.dataset.cin = i;
                    insertedElem.addEventListener('click', onRemoveButtonClick);
                    insertedElem.addEventListener('change', onCartChange);
                }
                setCartCounter();
                updateTotals();
            }
            /**
             * Удалить товар из корзины
             * @param {int} i 
             */
        let removeItemFromCart = (i) => {
                let cartDataList = JSON.parse(localStorage.cart);
                cartDataList.splice(i, 1);
                localStorage.cart = JSON.stringify(cartDataList);
                fillCartList(cartDataList, cartList);
            }
            /**
             * Обработчик клика на удаление товара
             * @param {Event} evt 
             */
        let onRemoveButtonClick = (evt) => {
                if (evt.target.classList.contains('goods__delete')) {
                    evt.preventDefault();
                    removeItemFromCart(evt.currentTarget.dataset.cin);
                }

            }
            /**
             * Очистить корзину
             */
        let clearCart = () => {
                localStorage.clear();
                fillCartList('', cartList, 0);
            }
            /**
             * Обработчик клика на кнопку очистки
             * @param {Event} evt 
             */
        let onClearCartButtonClick = (evt) => {
            evt.preventDefault();
            clearCart();
        }

        /**************** Вешаем обработчики, если страница корзины ************************/

        if (window.location.pathname === '/cart-page.html') {
            let cartList = document.querySelector('.cart');
            subTotal = document.querySelector(".checkout__grand span");
            grandTotal = document.querySelector(".checkout__sub span");
            if (localStorage.cart) {
                fillCartList(JSON.parse(localStorage.cart), cartList);
            } else {
                fillCartList("", cartList);
            }
            calcTotal();
        } else {
            setCartCounter();
        }
        if (clearCartButton) {
            clearCartButton.addEventListener('click', onClearCartButtonClick);
        }

        /*************************Очистить локальное хранилище при закрытии окна ******************* */
        window.onclose = () => {
            localStorage.clear();
        }
    })();
//*************   cart.js *******/