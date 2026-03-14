import { Ajax } from '../modules/Ajax.js';
import { Slideshow } from '../modules/Slideshow.js';

const TILE_COLORS = ['green', 'red', 'yellow'];

function _renderRecentTiles(projects) {
    let tileContainer = document.querySelector('#recent-project-tiles');
    projects.forEach((p, i) => {
        let tile = document.createElement('div');
        tile.className = 'tile ' + TILE_COLORS[i];

        let link = document.createElement('a');
        link.href = 'project.html?id=' + p.slug;

        let title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = p.name;
        link.appendChild(title);

        if (p.screenshots && p.screenshots.length > 0) {
            let img = document.createElement('img');
            img.className = 'thumbnail';
            img.src = 'images/projects/' + p.screenshots[0].thumbnail_url;
            link.appendChild(img);
        }

        tile.appendChild(link);
        tileContainer.appendChild(tile);
    });
}

function _renderAllProjectsSlideshow(screenshots) {
    let slideshowEl = document.querySelector('#slides-projects');
    screenshots.forEach(ss => {
        let img = document.createElement('img');
        img.className = 'responsive slide';
        img.src = 'images/projects/' + ss.thumbnail_url;
        slideshowEl.appendChild(img);
    });
    Slideshow.create({
        targetSelector: '#slides-projects',
        transitionInterval: 3000,
        startDelay: 0,
    });
}

Promise.all([
    Ajax.get('api/projects.php?limit=3'),
    Ajax.get('api/projects.php?random_screenshots=5')
]).then(([projectsText, screenshotsText]) => {
    _renderRecentTiles(JSON.parse(projectsText));
    _renderAllProjectsSlideshow(JSON.parse(screenshotsText));
});
