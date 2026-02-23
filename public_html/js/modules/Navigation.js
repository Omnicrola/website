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
                _initializeNavigation(_contentContainer);
            })
            .catch((err) => {
                console.log('Error retrieving URL : ' + pageName);
                console.log(err);
            });
    }

    function _recursiveHrefSearch(node) {
        if (node.href) {
            return node.attributes['href'].value;
        } else {
            return _recursiveHrefSearch(node.parentElement);
        }
    }

    function _onAnchorClick(event) {
        event.preventDefault();
        let pagePath = _recursiveHrefSearch(event.target);
        let pageName = pagePath.split('/#/')[1];

        _loadContent(pageName);
        return false;
    }

    function _loadContent(newPage) {
        _clearContent();
        NavigationPath.setPage(newPage);
        return _retrievePageContent(newPage);
    }


    function _initializeNavigation(element) {
        element.querySelectorAll('a')
            .forEach(element => {
                if (element.attributes['data-local'] && element.attributes['data-local'].value == "true") {
                    element.addEventListener('click', _onAnchorClick);
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
            _loadContent(currentPage);
        }
    }

    // runs on startup, hijacks all <a data-local="true" href=""> click events
    _initializeNavigation(document);

    return {
        loadStartingContent: _loadStartingContent,
    };
})('#content');

const NavigationPath = (() => {

    function _getUrlArray() {
        // the expected format of the URL is : 
        // http://www.host.com/#/pagename/param1/param2
        return window.location.href.split('#')[1]?.slice(1).split('/') ?? [];
    }

    function _getCurrentPage() {
        // return just the first element, it is the page name
        return _getUrlArray()[0];
    }

    function _setPage(newPage) {
        let state = {};
        let newUrl = window.location.protocol + '//' + window.location.host + '/#/' + newPage
        window.history.pushState(state, '', newUrl); 
    }

    function _getParams() {
        // drop the first element, it is the page name
        return _getUrlArray.slice(1);
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
        setPage : _setPage,
        params : _getParams,
        getValue : _getValueByParamName
    }
})();