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