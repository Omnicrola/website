window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let slideshowSelectors = [];

    function _onLoad() {
        let projectId = window.currentProjectId;
        let detailEl = document.querySelector('#project-detail');

        if (!projectId) {
            detailEl.innerHTML = '<p>No project selected. <a data-local="true" href="#projects.html">&#8592; Back to Projects</a></p>';
            return;
        }

        Ajax.get('data/projects-data.json')
            .then(json => {
                let projects = JSON.parse(json);
                let projectData = projects.find(p => p.id === projectId);

                if (!projectData) {
                    detailEl.innerHTML = '<p>Project not found.</p>';
                    return;
                }

                let projectDate = new Date(projectData.updated);
                projectData.updated = MONTHS[projectDate.getMonth()] + ' ' + projectDate.getFullYear();

                Template.apply(detailEl, projectData);

                if (!projectData['play-link']) {
                    let playLink = detailEl.querySelector('.play');
                    if (playLink) playLink.parentNode.removeChild(playLink);
                }

                if (!projectData['youtube-link']) {
                    let youtubeLink = detailEl.querySelector('.youtube');
                    if (youtubeLink) youtubeLink.parentNode.removeChild(youtubeLink);
                }

                if (projectData.screenshots.length > 1) {
                    let selector = '#project-detail .image-slideshow';
                    Slideshow.create({
                        targetSelector: selector,
                        transitionInterval: 6000,
                        startDelay: 0
                    });
                    slideshowSelectors.push(selector);
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
