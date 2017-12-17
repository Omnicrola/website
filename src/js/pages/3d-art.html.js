window.module.triggers = (() => {
    let _gallerySlideshow = {};
    let _slideTitle = document.querySelector('#gallery-title');

    function _bindButton(selector, call) {
        let previous = document.querySelector(selector)
        previous.onclick = call;
    }

    function _onLoad() {
        BoxSizing.squareUp();

        _gallerySlideshow = Slideshow.create({
            targetSelector: '#slides-gallery',
            autoAdvance: false
        });
        _gallerySlideshow.onChange((index, slide) => {
            let title = slide.attributes.title.value;
            console.log(title);
            _slideTitle.innerText = title;
        });
        _bindButton('#nav-previous', () => {
            _gallerySlideshow.previous();
        })
        _bindButton('#nav-next', () => {
            _gallerySlideshow.next();
        })
    }

    function _onUnload() {
        _gallerySlideshow.stop();
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();