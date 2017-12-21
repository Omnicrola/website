let modules = [
    'modules/Slideshow',
    'modules/Ajax',
    'modules/NavigationCache',
    'modules/Navigation',
    'modules/Template'
];
ModuleLoader.loadModules(modules)
    .then(() => {
        console.log('modules loaded!');
        return Navigation.loadDefaultContent('main.html');
    });
