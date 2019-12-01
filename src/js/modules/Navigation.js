let Navigation = ((contentTarget) => {

    let _contentContainer = document.querySelector(contentTarget);
    let _currentUrl = '';

    function _clearContent() {
        _contentContainer.innerHTML = '';
        _contentContainer.classList.add('loading');
    }

    function _retrieveContent(url) {
        return Ajax.get(url)
            .then((content) => {
                _contentContainer.classList.remove('loading');
                _contentContainer.innerHTML = content;

                _currentUrl = url;
                return NavigationCache.load(url);
            })
            .then(() => {
                _initializeNavigation(_contentContainer);
            });
    }

    function _setUrlBar(contentUrl) {
        let state = {contentUrl: contentUrl};
        let baseUrl = window.location.href.split('#')[0];
        window.history.pushState(state, '', baseUrl + '#' + contentUrl);
    }

    function _recursiveHrefSearch(node) {
        if (node.href) {
            return node.href;
        } else {
            return _recursiveHrefSearch(node.parentElement);
        }
    }

    function _onAnchorClick(event) {
        event.preventDefault();
        let linkUrl = _recursiveHrefSearch(event.target);
        let subUrl = linkUrl.split('#')[1];

        NavigationCache.unload(_currentUrl);

        _clearContent();
        _setUrlBar(subUrl);
        _retrieveContent(subUrl);
    }

    function _loadContent(url) {
        _clearContent();
        _setUrlBar(url);
        return _retrieveContent(url);
    }


    function _initializeNavigation(element) {
        element.querySelectorAll('a')
            .forEach(element => {
                if (element.attributes['data-local'] && element.attributes['data-local'].value) {
                    element.onclick = _onAnchorClick;
                }
            });
        window.onpopstate = (event) => {
            // _loadContent(event.state.contentUrl);
        }
    }

    function _loadDefault(defaultUrl) {
        let urlFragments = window.location.href.split('#');
        let subContentIsSpecified = urlFragments.length > 1 && urlFragments[1].length > 0;
        if (subContentIsSpecified) {
            let subContentUrl = urlFragments[1];
            console.log('loading sub-content : ' + subContentUrl);
            return _loadContent(subContentUrl);
        } else {
            console.log('loading default sub-content');
            return _loadContent(defaultUrl);
        }
    }

    _initializeNavigation(document);
    return {
        loadDefaultContent: _loadDefault,
    };
})('#content');
