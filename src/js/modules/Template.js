let Template = (() => {

    function _handleRepeating(node, data) {
        let properties = Object.getOwnPropertyNames(data);
        for (let propIndex = 0; propIndex < properties.length; propIndex++) {
            let propName = properties[propIndex];
            let repeatElement = node.querySelector(`[template-for~="${propName}"]`)
            if (repeatElement) {

                let repeatData = data[propName];
                let subSelector = repeatElement.attributes['template-for'].value.replace(propName + ' as ', '');
                let newInnerHtml = '';
                for (let dataIndex = 0; dataIndex < repeatData.length; dataIndex++) {
                    let templateHtml = repeatElement.innerHTML;
                    newInnerHtml += templateHtml.replace('{{' + subSelector + '}}', repeatData[dataIndex]);
                }
                repeatElement.innerHTML = newInnerHtml;
            }
        }
    }

    function _apply(node, data) {
        let properties = Object.getOwnPropertyNames(data);
        let innerHtml = node.innerHTML;
        for (let i = 0; i < properties.length; i++) {
            let prop = properties[i];
            let value = data[prop];
            innerHtml = innerHtml.replace('{{' + prop + '}}', value);
        }
        node.innerHTML = innerHtml;
        _handleRepeating(node, data);
    }

    return {
        apply: _apply
    };
})();