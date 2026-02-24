window.module.triggers = (() => {
    function _onLoad() {
        Slideshow.create({
            targetSelector: '#slides-projects',
            transitionInterval: 3000,
            startDelay: 0,
        });
        return Promise.resolve();
    }

    function _onUnload() {
        Slideshow.destroy('#slides-projects');
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();