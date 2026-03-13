export const Template = (() => {

    function _handleRepeating(node, data) {
        let properties = Object.getOwnPropertyNames(data);
        for (let propIndex = 0; propIndex < properties.length; propIndex++) {
            let propName = properties[propIndex];
            let repeatElement = node.querySelector(`[template-for~="${propName}"]`);
            if (repeatElement) {
                let repeatData = data[propName];
                let alias = repeatElement.attributes['template-for'].value.replace(propName + ' as ', '');
                let templateHtml = repeatElement.innerHTML;
                let newInnerHtml = '';
                for (let dataIndex = 0; dataIndex < repeatData.length; dataIndex++) {
                    let item = repeatData[dataIndex];
                    let itemHtml = templateHtml;
                    if (item !== null && typeof item === 'object') {
                        Object.getOwnPropertyNames(item).forEach(subProp => {
                            itemHtml = itemHtml.replace(new RegExp(`\\{\\{${alias}\\.${subProp}\\}\\}`, 'g'), item[subProp]);
                        });
                    } else {
                        itemHtml = itemHtml.replace(new RegExp(`\\{\\{${alias}\\}\\}`, 'g'), item);
                    }
                    newInnerHtml += itemHtml;
                }
                repeatElement.innerHTML = newInnerHtml;
            }
        }
    }

    function _handleOptional(node, data) {
        node.querySelectorAll('[template-optional]').forEach(el => {
            let prop = el.getAttribute('template-optional');
            if (!data[prop]) {
                el.remove();
            }
        });
    }

    function _apply(node, data) {
        let properties = Object.getOwnPropertyNames(data);
        let innerHtml = node.innerHTML;
        for (let i = 0; i < properties.length; i++) {
            let prop = properties[i];
            let value = data[prop];
            innerHtml = innerHtml.replace(new RegExp(`\\{\\{${prop}\\}\\}`, 'g'), value);
        }
        node.innerHTML = innerHtml;
        _handleOptional(node, data);
        _handleRepeating(node, data);
    }

    return {
        apply: _apply
    };
})();