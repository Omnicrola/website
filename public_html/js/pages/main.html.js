window.module.triggers = (() => {
    const TILE_COLORS = ['green', 'red', 'yellow'];

    function _renderRecentTiles(projects) {
        let tileContainer = document.querySelector('#recent-project-tiles');
        let sortedProjects = projects
            .sort((a, b) => new Date(b.updated) - new Date(a.updated))
            .slice(0, 3);

        sortedProjects.forEach((p, i) => {
            let tile = document.createElement('div');
            tile.className = 'tile ' + TILE_COLORS[i];

            let link = document.createElement('a');
            link.setAttribute('data-local', 'true');
            link.href = '/#/project/id/' + p.id;

            let title = document.createElement('div');
            title.className = 'tile-title';
            title.textContent = p.title;
            link.appendChild(title);

            if (p.screenshots && p.screenshots.length > 0) {
                let img = document.createElement('img');
                img.className = 'responsive';
                img.src = 'images/projects/' + p.screenshots[0];
                link.appendChild(img);
            }

            tile.appendChild(link);
            tileContainer.appendChild(tile);
        });

        Navigation.overrideLocalLinks(tileContainer);
    }

    function _onLoad() {
        return Ajax.get('data/projects-data.json')
            .then((responseText) => {
                let projects = JSON.parse(responseText);
                let sorted = projects.sort((a, b) => new Date(b.updated) - new Date(a.updated));

                let slideshowEl = document.querySelector('#slides-projects');
                sorted
                    .filter((p) => p.screenshots && p.screenshots.length > 0)
                    .slice(0, 5)
                    .forEach((p) => {
                        let img = document.createElement('img');
                        img.className = 'responsive slide';
                        img.src = 'images/projects/' + p.screenshots[0];
                        slideshowEl.appendChild(img);
                    });
                Slideshow.create({
                    targetSelector: '#slides-projects',
                    transitionInterval: 3000,
                    startDelay: 0,
                });

                _renderRecentTiles(projects);
            });
    }

    function _onUnload() {
        Slideshow.destroy('#slides-projects');
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();