window.module.triggers = (() => {


    let _customTemplateFunctions = {
        screenshots: (screenshots) => {
            let parsedHtml = '';
            for (let i = 0; i < screenshots.length; i++) {
                parsedHtml += `<img class="responsive slide" src="images/games/${screenshots[i]}"/>\n`;
            }
            return parsedHtml;
        },
        description: (descriptions) => {
            let parsedHtml = '';
            for (let i = 0; i < descriptions.length; i++) {
                parsedHtml += `<p>${descriptions[i]}</p>`;
            }
            return parsedHtml;
        }
    };

    function _loadGamesFromJson() {
        let template = document.querySelector('#game-template');
        let containerNode = template.parentNode;
        containerNode.removeChild(template);

        return Ajax.get('data/projects-data.json')
            .then(json => {
                let games = JSON.parse(json);
                let slideshowSelectors = [];
                for (let i = 0; i < games.length; i++) {
                    let gameElement = template.cloneNode(true);
                    let singleGameData = games[i];
                    Template.apply(gameElement, singleGameData, _customTemplateFunctions);

                    if (!singleGameData['play-link']) {
                        let playLink = gameElement.querySelector('.play');
                        playLink.parentNode.removeChild(playLink);
                    }
                    let gameId = 'game-' + singleGameData.title.toLocaleLowerCase().replace(' ', '-');
                    gameElement.id = gameId;
                    containerNode.appendChild(gameElement);

                    if (singleGameData.screenshots.length > 1) {
                        let slideshowSelector = '#' + gameId + ' .image-slideshow';
                        Slideshow.create({
                            targetSelector: slideshowSelector,
                            transitionInterval: 3000,
                            startDelay: Math.random() * 100
                        });
                        slideshowSelectors.push(slideshowSelector);
                    }
                }
                return slideshowSelectors;
            });
    }

    let slideshowSelectors = [];

    function _onLoad() {
        _loadGamesFromJson()
            .then((newSlideshowSelectors) => {
                slideshowSelectors = newSlideshowSelectors;
            });
    }

    function _onUnload() {
        slideshowSelectors.forEach(selector => {
            Slideshow.destroy(selector);
        })
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();