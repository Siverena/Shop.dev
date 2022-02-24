import { productsDataList } from './modules/productsdata.min.js';
//*************   product.js *******/
(function() {
    if (!document.querySelector('.products__wrap')) {
        return;
    }

    let getRandomElem = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)]
        }
        /**
         * Переводит GET-параметры страницы объект. 
         * @returns {Object} - объект с названиями параметров в ключах и значениями
         */
    let gets = (() => {
        let a = window.location.search;
        if (!a) {
            return;
        }
        let b = new Object();
        a = a.substring(1).split("&");
        for (let i = 0; i < a.length; i++) {
            let c = a[i].split("=");
            b[c[0]] = c[1];
        }
        return b;
    })();
    //для фильтров, но пока не реализовано
    // let sizeList = ['xs', 's', 'm', 'l', 'xl'];
    // let colorList = ['white', 'black', 'blue', 'red', 'green'];
    /**
     * Создает элемент разметки одного товара
     * @param {*} productData - объект с данными продукта
     * @returns {HTMLElement} Элемент разметки
     */
    let createProductElement = (productData) => {
            let item = document.createElement('li');
            item.dataset.id = productData.id;
            item.className = 'products__item  product';
            let imgWrapper = document.createElement('div');
            imgWrapper.classList.add('product__image-wrap');
            let img = document.createElement('img');
            img.src = `./img/product/${productData.img[0]}`;
            img.alt = productData.name;
            img.setAttribute('width', '360');
            img.setAttribute('height', '420');
            let btnWrapper = document.createElement('div');
            btnWrapper.classList.add('product__add-to-box-wrap');
            let button = document.createElement('button');
            button.classList.add('product__add-to-box-btn');
            let footer = document.createElement('footer');
            footer.classList.add('product__footer');
            let link = document.createElement('a');
            link.classList.add('product__link');
            let name = document.createElement('h3');
            name.classList.add('product__name');
            let descr = document.createElement('p');
            descr.classList.add('product__description');
            let price = document.createElement('p');
            price.classList.add('product__price');
            name.textContent = productData.name;
            descr.textContent = productData.descr;
            price.textContent = `$${productData.price.toFixed(2)}`;
            link.href = `product-page.html?id=${productData.id}`;
            link.append(name, descr, price);
            footer.append(link);
            button.textContent = 'Add to Cart';
            btnWrapper.appendChild(button);
            imgWrapper.append(img, btnWrapper);
            item.append(imgWrapper, footer);
            return item;
        }
        /** Заполнить карточку товара на странице товара
         * @param {} productItem - продукт, пока выводится первый элемент вместо 404, если нет гет-параметра id
         */
    let fillProductPage = (productItem = productsDataList[0]) => {
            if (window.location.pathname !== "/product-page.html") {
                return;
            }
            let sliderEl = document.querySelector('.slider__item__cont');
            sliderEl.innerHTML = "";
            productItem.img.forEach((image, i) => {
                let slide = document.createElement('div');
                slide.classList.add('slider__item');
                if (i === 0) {
                    slide.classList.add('slider__item--active');
                }
                let imageEl = document.createElement('img');
                imageEl.src = `img/product/${image}`;
                imageEl.className = "slider__image";
                imageEl.width = 597;
                imageEl.height = 724;
                imageEl.alt = productItem.name;
                slide.append(imageEl);
                sliderEl.append(slide);
            })

            let productCard = document.querySelector('.item__description');
            productCard.dataset.id = productItem.id;
            productCard.querySelector('.item__category').textContent = productItem.category;
            productCard.querySelector('.item__name').textContent = productItem.name;
            productCard.querySelector('.item__text').textContent = productItem.descr;
            productCard.querySelector('.item__cost').textContent = '$' + productItem.price;
        }
        /** Отрисовка списка продуктов
         * @param productsDataList - массив данных продуктов
         * @param {HTMLElement} parent - родительский узел, в котором будем отрисовывать
         * @param {int} limit - количество элементов на страницу пагинации
         * @param {int} page - текущая страница
         */
    let renderProductsList = (productsDataList, parent, limit = 0, page = 0) => {
        let startNumber = 0;
        let endNumber = limit;
        if (limit === 0) {
            productsDataList.forEach((product) => {
                parent.appendChild(createProductElement(product));
            });
        } else {
            if (page > 0) {
                startNumber = limit * (page - 1);
                endNumber = limit * page;
            }
            if (productsDataList.length < limit) {
                limit = productsDataList.length;
            }
            for (let i = startNumber; i < endNumber; i++) {
                parent.appendChild(createProductElement(productsDataList[i]));
            }
        }
    }

    //где будет отрисовка продуктов
    let productsListParent = document.querySelector('.products__wrap');

    let productsPerPage = 0;
    //определяем, где мы
    switch (window.location.pathname) {
        case "/index.html":
            productsPerPage = 6;
            break;
        case "/catalog-page.html":
            productsPerPage = 9;
            break;
        case "/product-page.html":
            productsPerPage = 3;
            break;
        default:
            productsPerPage = 0;
    }
    // сбрасываем пагинацию на 0
    let currentPage = 0;

    /**
     * Добавляет в localStorage.cart  товар и вызывает обновление счетчика
     * @param {*} cartObj - объект корзины, {id,color,size,quantity}
     */
    let addToCart = (cartObj) => {
        let cartDataList = Array();
        if (localStorage.cart) {
            cartDataList = JSON.parse(localStorage.cart);
        }
        cartDataList.push(cartObj);
        localStorage.cart = JSON.stringify(cartDataList);
        setCartCounter();
    }

    /**
     * Обработчик нажатия на кнопку добавить в корзину, вызывает addToCart()
     * @param {Event} evt 
     */
    let onAddToCartClick = (evt) => {
        evt.preventDefault();
        let inputs = evt.target.parentNode.querySelectorAll('input:checked');
        let cartObj = {
            id: currentProduct.id,
            color: 'black',
            size: 'm',
            price: currentProduct.price,
            quantity: 1
        };
        inputs.forEach(input => {
            if (input.name === "color") { cartObj.color = input.id; }
            if (input.name === "size") { cartObj.size = input.id; }
            if (input.name === "quantity") { cartObj.quantity = +input.parentNode.lastChild.data; }
        });
        addToCart(cartObj);
    }
    renderProductsList(productsDataList, productsListParent, productsPerPage, currentPage);
    document.querySelectorAll('.item__add-to-box-btn').forEach(
        (addBtn) => {
            addBtn.addEventListener('click', onAddToCartClick);
        }
    );
    let currentProduct = productsDataList[0];
    if (gets && gets['id']) { currentProduct = productsDataList[gets['id']]; }
    fillProductPage(currentProduct);
})();
//*************   end of product.js *******/
(function() {
    function nextSlide(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('slider__item--active')) {
                items[i].classList.remove('slider__item--active');
                if (i == items.length - 1) {
                    items[0].classList.add('slider__item--active');
                } else {
                    items[i + 1].classList.add('slider__item--active');
                }
                i = items.length;
            }
        }
    }

    function prevSlide(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('slider__item--active')) {
                items[i].classList.remove('slider__item--active');
                if (i == 0) {
                    items[items.length - 1].classList.add('slider__item--active');
                } else {
                    items[i - 1].classList.add('slider__item--active');
                }
                i = items.length;
            }
        }
    }

    let slider = document.querySelector(".slider");
    console.log(slider);
    if (slider) {
        let items = slider.querySelectorAll(".slider__item");
        let btnPrew = slider.querySelector(".slider__link--prew");
        let btnNext = slider.querySelector(".slider__link--next");

        btnNext.addEventListener('click', () => { nextSlide(items) });
        btnPrew.addEventListener('click', () => { prevSlide(items) });
    }
})();
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