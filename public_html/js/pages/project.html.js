window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let slideshowSelectors = [];

    function _renderMainBlock(projectElement, json, projectId) {
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

    }

    function _renderBlock(blockData) {
        let templateSelector = `[template=${blockData.template}]`;
        let templateBlock = document.querySelector(templateSelector);
        if(!templateBlock) {
            console.error('No template found for : ' + blockData.template);
            return;
        }
        let newBlock = templateBlock.cloneNode(true);
        newBlock.removeAttribute('template');
        Template.apply(newBlock, blockData);
        return newBlock;
    }

    function _onLoad() {
        let projectId = NavigationPath.getValue('id');
        let projectElement = document.querySelector('#project-template');

        if (!projectId) {
            projectElement.innerHTML = '<p>No project selected. <a data-local="true" href="#projects.html">&#8592; Back to Projects</a></p>';
            return;
        }

        Ajax.get('data/projects-data.json')
            .then(jsonData => {
                _renderMainBlock(projectElement, jsonData, projectId);
            })
            .then(() => {
                return Ajax.get('data/projects/' + projectId + '.data.json');
            })
            .then((extendedDataJson )=> {
                let extendedData = JSON.parse(extendedDataJson);
            
                let containerNode = document.querySelector('#extended-content');
                
                extendedData.blocks.forEach((blockData) => {
                    containerNode.appendChild(_renderBlock(blockData));
                });  
            })
            .catch((err)=> {
                console.log(err);
            })
            .finally(()=>{ 
                document.querySelectorAll('[template]').forEach(e=>e.remove());
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
