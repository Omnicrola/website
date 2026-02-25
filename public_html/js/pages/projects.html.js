window.module.triggers = (() => {

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let activeTags = new Set();
    let slideshowSelectors = [];

    function _extractTagCounts(projects) {
        let counts = {};
        projects.forEach(project => {
            (project.tags || []).forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }

    function _renderTagFilter(tagCounts) {
        let container = document.querySelector('#tag-filter-buttons');
        if (!container) return;
        let tags = Object.keys(tagCounts).sort();
        tags.forEach(tag => {
            let btn = document.createElement('button');
            btn.className = 'tag-filter-btn';
            btn.textContent = tag + ' (' + tagCounts[tag] + ')';
            btn.dataset.tag = tag;
            btn.addEventListener('click', () => _onTagClick(tag, btn));
            container.appendChild(btn);
        });
    }

    function _updateProjectCount() {
        let all = document.querySelectorAll('.project[data-tags]');
        let visible = Array.from(all).filter(p => p.style.display !== 'none').length;
        let countEl = document.querySelector('#project-count');
        if (countEl) {
            countEl.textContent = 'Showing ' + visible + ' of ' + all.length + ' projects';
        }
    }

    function _onTagClick(tag, btn) {
        if (activeTags.has(tag)) {
            activeTags.delete(tag);
            btn.classList.remove('active');
        } else {
            activeTags.add(tag);
            btn.classList.add('active');
        }
        _filterProjects();
    }

    function _filterProjects() {
        let projects = document.querySelectorAll('.project[data-tags]');
        projects.forEach(project => {
            if (activeTags.size === 0) {
                project.style.display = '';
            } else {
                let projectTags = JSON.parse(project.dataset.tags);
                let hasMatch = projectTags.some(tag => activeTags.has(tag));
                project.style.display = hasMatch ? '' : 'none';
            }
        });
        _updateProjectCount();
    }
    
    function _byProjectUpdated(p1, p2) {
        return new Date(p2.updated) - new Date(p1.updated);
    }

    function _loadProjectsFromJson() {
        let template = document.querySelector('#project-template');
        let containerNode = template.parentNode;
        containerNode.removeChild(template);

        return Ajax.get('data/projects-data.json')
            .then(json => {
                let projects = JSON.parse(json);
                projects = projects.sort(_byProjectUpdated);

                let tagCounts = _extractTagCounts(projects);
                _renderTagFilter(tagCounts);

                let newSlideshowSelectors = [];
                for (let i = 0; i < projects.length; i++) {
                    let projectElement = template.cloneNode(true);
                    let singleProjectData = projects[i];
                    let projectDate = new Date(singleProjectData.updated);
                    singleProjectData.updated = MONTHS[projectDate.getMonth()] + ' ' + projectDate.getFullYear();
                    Template.apply(projectElement, singleProjectData);

                    projectElement.dataset.tags = JSON.stringify(singleProjectData.tags || []);

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
                        newSlideshowSelectors.push(slideshowSelector);
                    }
                }
                console.log('created all projects')
                _updateProjectCount();
                return newSlideshowSelectors;
            });
    }

    function _onLoad() {
        activeTags = new Set();
        return _loadProjectsFromJson()
            .then((newSlideshowSelectors) => {
                slideshowSelectors = newSlideshowSelectors;
            });
    }

    function _onUnload() {
        activeTags = new Set();
        slideshowSelectors.forEach(selector => {
            Slideshow.destroy(selector);
        });
    }

    return {
        onLoad: _onLoad,
        onUnload: _onUnload
    };
})();
