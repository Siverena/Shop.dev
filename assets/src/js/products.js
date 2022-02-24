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