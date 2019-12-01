window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function _byProjectUpdated(p1, p2) {
        return new Date(p2.updated) - new Date(p1.updated);
        2
    }

    function _loadProjectsFromJson() {
        let template = document.querySelector('#project-template');
        let containerNode = template.parentNode;
        containerNode.removeChild(template);

        return Ajax.get('data/projects-data.json')
            .then(json => {
                let projects = JSON.parse(json);
                projects = projects.sort(_byProjectUpdated);
                let slideshowSelectors = [];
                for (let i = 0; i < projects.length; i++) {
                    let projectElement = template.cloneNode(true);
                    let singleProjectData = projects[i];
                    let projectDate = new Date(singleProjectData.updated);
                    singleProjectData.updated = MONTHS[projectDate.getMonth()] + ' ' + projectDate.getFullYear();
                    Template.apply(projectElement, singleProjectData);

                    if (!singleProjectData['play-link']) {
                        let playLink = projectElement.querySelector('.play');
                        playLink.parentNode.removeChild(playLink);
                    }

                    if(!singleProjectData['youtube-link']){
                        let youtubeLink = projectElement.querySelector('.youtube');
                        youtubeLink.parentNode.removeChild(youtubeLink);
                    }

                    let projectId = 'project-' + singleProjectData.title.toLocaleLowerCase().replace(' ', '-');
                    projectElement.id = projectId;
                    containerNode.appendChild(projectElement);

                    if (singleProjectData.screenshots.length > 1) {
                        let slideshowSelector = '#' + projectId + ' .image-slideshow';
                        Slideshow.create({
                            targetSelector: slideshowSelector,
                            transitionInterval: 6000,
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
        _loadProjectsFromJson()
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