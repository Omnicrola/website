import { Ajax } from '../modules/Ajax.js';
import { Slideshow } from '../modules/Slideshow.js';
import { Template } from '../modules/Template.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let slideshowSelectors = [];

function _renderMainBlock(projectElement, projectData) {
    projectData.tags = projectData.tags ? projectData.tags.split(',').map(t => t.trim()) : [];

    let projectUpdatedDate = new Date(projectData.updated);
    projectData.updated = MONTHS[projectUpdatedDate.getMonth()] + ' ' + projectUpdatedDate.getFullYear();

    let projectCompletedDate = new Date(projectData.completed);
    projectData.completed = MONTHS[projectCompletedDate.getMonth()] + ' ' + projectCompletedDate.getFullYear();

    Template.apply(projectElement, projectData);

    if (projectData.screenshots.length > 1) {
        Slideshow.create({
            targetSelector: '.image-slideshow',
            transitionInterval: 6000,
            startDelay: 0
        });
        slideshowSelectors.push('.image-slideshow');
    }
}

let projectId = new URLSearchParams(window.location.search).get('id');
let projectElement = document.querySelector('#project-template');

if (!projectId) {
    projectElement.innerHTML = '<p>No project selected. <a href="projects.html">&#8592; Back to Projects</a></p>';
} else {
    Ajax.get('api/project.php?id=' + projectId)
        .then(jsonData => {
            _renderMainBlock(projectElement, JSON.parse(jsonData));
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            document.querySelectorAll('[template]').forEach(e => e.remove());
        });
}
