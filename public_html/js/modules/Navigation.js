let Navigation = ((contentTarget) => {

    let _contentContainer = document.querySelector(contentTarget);

    function _clearContent() {
        _contentContainer.innerHTML = '';
        _contentContainer.classList.add('loading');
    }

    function _retrievePageContent(pageName) {
        return Ajax.get(pageName + '.html')
            .then((content) => {
                PageScriptLoader.unloadCurrentPage();
                _contentContainer.classList.remove('loading');
                _contentContainer.innerHTML = content;
                return PageScriptLoader.loadScript(pageName);
            })
            .then(() => {
                _overrideLocalLinks(_contentContainer);
            })
            .catch((err) => {
                console.error('Error retrieving page : ' + pageName);
                console.error(err);
            });
    }

    function _recursiveHrefSearch(node) {
        if (node.href) {
            return node.attributes['href'].value;
        } else {
            return _recursiveHrefSearch(node.parentElement);
        }
    }

    function _onLocalLinkClick(event) {
        event.preventDefault();
        let newPath = _recursiveHrefSearch(event.target);
        _loadContent(newPath);
        return false;
    }

    function _loadContent(newPath) {
        _clearContent();
        let pageName = NavigationPath.breakUrl(newPath)[0];
        NavigationPath.setPage(newPath);
        return _retrievePageContent(pageName);
    }


    function _overrideLocalLinks(element) {
        element.querySelectorAll('a')
            .forEach(element => {
                if (element.attributes['data-local'] && element.attributes['data-local'].value == "true") {
                    element.addEventListener('click', _onLocalLinkClick);
                }
            });
    }

    function _loadStartingContent(defaultPage) {
        const currentPage = NavigationPath.currentPage();
        if(!currentPage || currentPage.length == 0) {
            console.log('loading default page')
            _loadContent(defaultPage);
        } else {
            console.log('Loading starting content :' + currentPage)
            _loadContent('/#/'+NavigationPath.currentPath());
        }
    }

    // runs on startup, hijacks all <a data-local="true" href=""> click events
    _overrideLocalLinks(document);

    return {
        loadStartingContent: _loadStartingContent,
        overrideLocalLinks: _overrideLocalLinks
    };
})('#content');

const NavigationPath = (() => {

    function _getCurrentUrlArray() {
        // the expected format of the URL is : 
        // http://www.host.com/#/pagename/param1/param2
        return _breakUrl(window.location.href) ?? [];
    }

    function _breakUrl(url) {
        return url?.split('#')[1]?.split('/').filter(s=>s!=='') ?? [];
    }

    function _getCurrentPage() {
        // return just the first element, it is the page name
        return _getCurrentUrlArray()[0];
    }

    function _getCurrentPath() {
        console.log('URL : '+_getCurrentUrlArray().join('/'));
        return _getCurrentUrlArray().join('/');
    }

    function _setPath(newPath) {
        let state = {};
        newPath = newPath.substring(0,2) == '/#' ? newPath : '/#'+newPath;
        let newUrl = window.location.protocol + '//' + window.location.host + newPath
        window.history.pushState(state, '', newUrl); 
    }

    function _getParams() {
        // drop the first element, it is the page name
        return _getCurrentUrlArray().slice(1);
    }

    function _getValueByParamName(paramName) {
        const params = _getParams();
        const index = params.findIndex((str) => str == paramName);
        if(index == -1) { 
            return undefined;
        }
        return params[index + 1];
    }

    return {
        currentPage : _getCurrentPage,
        currentPath : _getCurrentPath,
        setPage : _setPath,
        params : _getParams,
        breakUrl : _breakUrl, 
        getValue : _getValueByParamName
    }
})();