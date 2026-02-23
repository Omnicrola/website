let PageScriptLoader = (() => {

    function _performLoad(pageName) {
        let element = document.createElement('script');
        element.src = 'js/pages/' + pageName + '.html.js';
        document.head.appendChild(element);

        return new Promise((resolve, reject) => {
            element.onload = () => {
                resolve(pageName);
            };
            element.onreadystatechange = () => {
                if (this.readyState === 'loaded') {
                    resolve();
                }
            };
        });
    }

    function _load(pageName) {
        _unloadCurrentPage();

        window.module = {};
        return _performLoad(pageName)
            .then(() => {
                if (!window.module || !window.module.triggers) {
                    throw new Error('Module "' + pageName + '" has no load triggers');
                }
                _currentPage = pageName;
                window.module.triggers.onLoad();
            });
    }

    function _unloadCurrentPage() {
        window.module?.triggers?.onUnload();
        window.module = {};
    }

    return {
        loadScript: _load,
        unloadCurrentPage: _unloadCurrentPage,
    };
})();