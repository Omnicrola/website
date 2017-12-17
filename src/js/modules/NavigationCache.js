let NavigationCache = (() => {
    let cache = [];

    function _performLoad(url) {
        let element = document.createElement('script');
        element.src = 'js/pages/' + url + '.js';
        document.head.appendChild(element);
        return new Promise((resolve, reject) => {
            element.onloadend = () => {
                resolve(url);
            }
        })
    }

    function _load(url) {
        if (cache[url]) {
            if (cache[url].onLoad) {
                cache[url].onLoad();
            }
            return Promise.resolve(url);
        } else {
            window.module = {};
            return _performLoad(url)
                .then(() => {
                    if (!window.module || !window.module.triggers) {
                        throw new Error('Module "' + url + '" has no load triggers');
                    }
                    cache.push(window.module.triggers);
                    window.module = {};
                });
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