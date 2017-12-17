window.module.triggers = (() => {
    let skins = [{
        title: 'League of Legends',
        screenshotUrl: 'http://via.placeholder.com/300x250?text=Skin',
        skinFileUrl: '#'
    }];

    function _showTiles() {
        let template = document.querySelector('#tile-template');
        let containerNode = template.parentNode;
        containerNode.removeChild(template);

        for (let i = 0; i < skins.length; i++) {
            let tile = template.cloneNode(true);
            Template.apply(tile, skins[i]);
            containerNode.appendChild(tile);
        }
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