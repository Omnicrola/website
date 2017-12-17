let Navigation = ((contentTarget) => {

    let _contentContainer = document.querySelector(contentTarget);
    let _currentUrl = '';

    function _clearContent() {
        _contentContainer.innerHTML = '';
        _contentContainer.classList.add('loading');
    }

    function _retrieveContent(url) {
        Ajax.get(url, (response) => {
            _contentContainer.classList.remove('loading');
            _contentContainer.innerHTML = response;
            document.dispatchEvent(new Event('ajax-load'));

            _currentUrl = url;
            NavigationCache.load(url);
            _initializeNavigation(_contentContainer);
        });
    }

    function _setUrlBar(contentUrl) {
        let state = {contentUrl: contentUrl};
        let baseUrl = window.location.href.split('#')[0];
        window.history.pushState(state, '', baseUrl + '#' + contentUrl);
    }

    function _onAnchorClick(event) {
        event.preventDefault();
        let target = event.srcElement.target;
        let subUrl = event.srcElement.href.split('#')[1];

        NavigationCache.unload(_currentUrl);

        _clearContent(target);
        _setUrlBar(subUrl);
        _retrieveContent(subUrl);
    }

    function _loadContent(url) {
        _clearContent();
        _setUrlBar(url);
        _retrieveContent(url);
    }


    function _initializeNavigation(element) {
        element.querySelectorAll('a')
            .forEach(element => {
                if (element.attributes.local && element.attributes.local.value) {
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
            _loadContent(subContentUrl);
        } else {
            console.log('loading default sub-content');
            _loadContent(defaultUrl);
        }
    }

    _initializeNavigation(document);
    return {
        loadDefaultContent: _loadDefault,
    };
})('#content');
