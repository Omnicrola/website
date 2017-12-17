let NavigationCache = (() => {
    let cache = [];

    function _waitUntilLoaded(url) {
        if (window.module && window.module.triggers) {
            cache[url] = window.module.triggers;
            delete window.module.triggers;
            _load(url);
        } else {
            setTimeout(() => {
                _waitUntilLoaded(url);
            });
        }
    }

    function _performLoad(url) {
        window.module={};
        let element = document.createElement('script');
        element.src = 'js/pages/' + url + '.js';
        console.log('LOAD: ' + element.src);
        document.head.appendChild(element);
        _waitUntilLoaded(url);
    }

    function _load(url) {
        if (cache[url]) {
            if (cache[url].onLoad) {
                cache[url].onLoad();
            }
        } else {
            _performLoad(url);
        }
    }

    function _unload(url) {
        if (cache[url] && cache[url].onUnload) {
            cache[url].onUnload();
        }
    }

    return {
        load: _load,
        unload: _unload,
    };
})();