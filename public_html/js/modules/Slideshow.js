let Slideshow = (() => {

    let defaultConfig = {
        transitionInterval: 1000,
        hiddenClass: 'slide-hidden',
        activeClass: 'slide-active',
        autoAdvance: true,
        startDelay: 0
    };

    function _initSlideshow(config, slideshowElement) {
        let images = slideshowElement.querySelectorAll('img.slide');
        images.forEach((image) => {
            image.classList.add(config.hiddenClass);
            image.style['z-index'] = 0;
        });
        slideshowElement.slideshow.next();
    }


    function _create(userConfig) {
        userConfig = userConfig || {};
        let config = {};
        Object.assign(config, defaultConfig);
        Object.assign(config, userConfig);

        let slideshowElement = document.querySelector(config.targetSelector);
        if (!slideshowElement) {
            throw new Error('Cannot attach slideshow, no element found with selector : ' + config.targetSelector);
        }
        let newSlideshow = _startSlideshow(slideshowElement, config);
        slideshowElement.slideshow = newSlideshow;
        _initSlideshow(config, slideshowElement);

        if (config.autoAdvance) {
            setTimeout(() => {
                slideshowElement.slideshow.start();
            }, config.startDelay);
        }
        else {
            slideshowElement.slideshow.stop();
        }
        return newSlideshow;
    }

    function _destroy(selector) {
        let element = document.querySelector(selector);
        if (!element) {
            throw new Error('Cannot destroy slideshow, element not found : ' + selector);
        }
        if (!element.slideshow) {
            throw new Error('Element does not contain a slideshow : ' + selector);
        }
        element.slideshow.stop();
    }

    function _startSlideshow(element, config) {
        let _running = true;
        let _images = element.querySelectorAll('img.slide');
        let _currentIndex = 0;

        let _onChangeCallback = () => {
        };

        function _onChange(callback) {
            _onChangeCallback = callback;
            _onChangeCallback(_currentIndex, _images[_currentIndex]);
        }

        function _transitionSlide(config) {
            _next();
            if (_running) {
                setTimeout(() => {
                    _transitionSlide(config)
                }, config.transitionInterval);
            }
        }

        function _next() {
            _gotoSlide(_currentIndex + 1, _currentIndex);
            _currentIndex++;
            _onChangeCallback(_currentIndex, _images[_currentIndex]);
            if (_currentIndex >= _images.length) {
                _currentIndex = 0;
            }
        }

        function _previous() {
            _gotoSlide(_currentIndex - 1, _currentIndex);
            _currentIndex--;
            _onChangeCallback(_currentIndex, _images[_currentIndex]);
            if (_currentIndex < 0) {
                _currentIndex = _images.length - 1;
            }
        }

        function _gotoSlide(indexToShow, indexToHide) {
            indexToShow = (indexToShow > _images.length - 1) ? 0 : indexToShow;
            indexToShow = (indexToShow < 0) ? _images.length - 1 : indexToShow;

            _images[indexToShow].classList.remove(config.hiddenClass);
            _images[indexToShow].classList.add(config.activeClass);
            _images[indexToShow].style['z-index'] = 20;
            _images[indexToHide].style['z-index'] = 10;
            _images[indexToHide].classList.add(config.hiddenClass);
            _images[indexToHide].classList.remove(config.activeClass);
        }

        return {
            start: () => {
                _running = true;
                setTimeout(() => {
                    _transitionSlide(config)
                });
            },
            stop: () => {
                _running = false;
            },
            onChange: _onChange,
            next: _next,
            previous: _previous,
        };
    }

    return {
        create: _create,
        destroy: _destroy
    }
})();

