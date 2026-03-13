import { Ajax } from '../modules/Ajax.js';
import { Slideshow } from '../modules/Slideshow.js';

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
        link.href = 'project.html?id=' + p.id;

        let title = document.createElement('div');
        title.className = 'tile-title';
        title.textContent = p.title;
        link.appendChild(title);

        if (p.screenshots && p.screenshots.length > 0) {
            let img = document.createElement('img');
            img.className = 'thumbnail';
            let raw = p.screenshots[0];
            let slashIdx = raw.lastIndexOf('/');
            let dir = slashIdx >= 0 ? raw.substring(0, slashIdx) : '';
            let filename = slashIdx >= 0 ? raw.substring(slashIdx + 1) : raw;
            let baseName = filename.substring(0, filename.lastIndexOf('.'));
            let thumbPath = (dir ? dir + '/thumbnail' : 'thumbnail') + '/' + baseName + '-thumb.jpg';
            img.src = 'images/projects/' + thumbPath;
            link.appendChild(img);
        }

        tile.appendChild(link);
        tileContainer.appendChild(tile);
    });
}

Ajax.get('data/projects-data.json')
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
