window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let slideshowSelectors = [];

    function _renderMainBlock(projectElement, projectData) {
        projectData.tags = projectData.tags ? projectData.tags.split(',').map(t => t.trim()) : [];

        let projectUpdatedDate = new Date(projectData.updated);
        projectData.updated = MONTHS[projectUpdatedDate.getMonth()] + ' ' + projectUpdatedDate.getFullYear();

        let projectCompletedDate = new Date(projectData.completed);
        projectData.completed = MONTHS[projectCompletedDate.getMonth()] + ' ' + projectCompletedDate.getFullYear();

        Template.apply(projectElement, projectData);

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

    function _onLoad() {
        let projectId = NavigationPath.getValue('project');
        let projectElement = document.querySelector('#project-template');

        if (!projectId) {
            projectElement.innerHTML = '<p>No project selected. <a data-local="true" href="#projects.html">&#8592; Back to Projects</a></p>';
            return;
        }

        Ajax.get('api/project.php?id=' + projectId)
            .then(jsonData => {
                _renderMainBlock(projectElement, JSON.parse(jsonData));
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
