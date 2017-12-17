let AsyncLoader = ((scriptContainer, srcPrefix) => {
    function _import(container, module) {
        let scriptElement = document.createElement('script');
        scriptElement.src = srcPrefix + module + '.js';
        container.appendChild(scriptElement);
    }

    function _then(resolve) {
        setTimeout(() => {
            resolve();
        }, 100)
    }

    function _loadModules(modules) {
        let containerElement = document.querySelector(scriptContainer);
        modules.forEach((module) => {
            _import(containerElement, module);
        });
        return {
            then: _then
        }
    }

    return {
        loadModules: _loadModules
    };
})('#scripts', './js/');
