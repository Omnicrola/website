let Template = (() => {
    function _apply(node, data, customParseFunctions = {}) {
        let properties = Object.getOwnPropertyNames(data);
        let innerHtml = node.innerHTML;
        for (let i = 0; i < properties.length; i++) {
            let prop = properties[i];
            let value = data[prop];
            if (customParseFunctions[prop]) {
                value = customParseFunctions[prop](data[prop]);
            }
            innerHtml = innerHtml.replace('{{' + prop + '}}', value);
        }
        node.innerHTML = innerHtml;
    }

    return {
        apply: _apply
    };
})();