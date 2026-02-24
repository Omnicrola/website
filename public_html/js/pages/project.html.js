window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let slideshowSelectors = [];

    function _onLoad() {
        let projectId = NavigationPath.getValue('id');
        let projectElement = document.querySelector('#project-template');

        if (!projectId) {
            projectElement.innerHTML = '<p>No project selected. <a data-local="true" href="#projects.html">&#8592; Back to Projects</a></p>';
            return;
        }

        Ajax.get('data/projects-data.json')
            .then(json => {
                let projects = JSON.parse(json);
                let projectData = projects.find(p => p.id === projectId);

                if (!projectData) {
                    projectElement.innerHTML = '<p>Project not found.</p>';
                    return;
                }

                let projectDate = new Date(projectData.updated);
                projectData.updated = MONTHS[projectDate.getMonth()] + ' ' + projectDate.getFullYear();

                Template.apply(projectElement, projectData);

                if (!projectData['play-link']) {
                    let playLink = projectElement.querySelector('.play');
                    if (playLink) playLink.parentNode.removeChild(playLink);
                }

                if (!projectData['youtube-link']) {
                    let youtubeLink = projectElement.querySelector('.youtube');
                    if (youtubeLink) youtubeLink.parentNode.removeChild(youtubeLink);
                }

                let slideDisplaySelector = '.image-slideshow';
                if (projectData.screenshots.length > 1) {
                    Slideshow.create({
                        targetSelector: slideDisplaySelector,
                        transitionInterval: 6000,
                        startDelay: 0
                    });
                    slideshowSelectors.push(slideDisplaySelector);
                }
            });
    }

    function _onUnload() {
        window.currentProjectId = null;
        slideshowSelectors.forEach(selector => Slideshow.destroy(selector));
        slideshowSelectors = [];
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();
