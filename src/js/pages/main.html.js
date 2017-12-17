window.module.triggers = (() => {
    function _onLoad() {
        Slideshow.create({
            targetSelector: '#slides-games',
            transitionInterval: 3000,
            startDelay: 0,
        });
        Slideshow.create({
            targetSelector: '#slides-images',
            transitionInterval: 3000,
            startDelay: 100,
        });
        Slideshow.create({
            targetSelector: '#slides-resume',
            transitionInterval: 3000,
            startDelay: 200,
        });
        Slideshow.create({
            targetSelector: '#slides-smartlaunch',
            transitionInterval: 3000,
            startDelay: 300,
        });
        BoxSizing.squareUp();
    }

    function _onUnload() {
        Slideshow.destroy('#slides-games');
        Slideshow.destroy('#slides-images');
        Slideshow.destroy('#slides-resume');
        Slideshow.destroy('#slides-smartlaunch');
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();