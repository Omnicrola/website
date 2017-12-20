window.module.triggers = (() => {

    function _compareSkins(a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    }

    function _showTiles() {
        let template = document.querySelector('#tile-template');
        let containerNode = template.parentNode;
        containerNode.removeChild(template);

        Ajax.get('data/smartlaunch-data.json')
            .then(json => {
                let skins = JSON.parse(json)
                    .sort(_compareSkins);
                for (let i = 0; i < skins.length; i++) {
                    let tile = template.cloneNode(true);
                    Template.apply(tile, skins[i]);
                    containerNode.appendChild(tile);
                }

            });
    }

    function _onLoad() {
        _showTiles();
        BoxSizing.squareUp();
    }

    function _onUnload() {
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();