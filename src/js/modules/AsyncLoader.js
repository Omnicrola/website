let ModuleLoader = ((scriptContainer, srcPrefix) => {
    function _import(container, module) {
        let scriptElement = document.createElement('script');
        scriptElement.src = srcPrefix + module + '.js';

        container.appendChild(scriptElement);

        return new Promise((resolve, reject) => {
            scriptElement.onload = () => {
                console.log('finished load: ' + scriptElement.src);
                resolve(scriptElement);
            };
            scriptElement.onreadystatechange = () => {
                if (this.readyState === 'loaded') {
                    console.log('ready state' + scriptElement.src);
                    resolve();
                }
            }
        });
    }

    function _loadModules(modules) {
        let promises = [];
        let containerElement = document.querySelector(scriptContainer);
        modules.forEach((module) => {
            let asyncLoader = _import(containerElement, module);
            promises.push(asyncLoader);
        });
        return Promise.all(promises);
    }

    return {
        loadModules: _loadModules
    };
})('#scripts', './js/');
