
let GLOBALS = {
    version : "20260221"
};


let modules = [
    'modules/Slideshow',
    'modules/Ajax',
    'modules/PageScriptLoader',
    'modules/Navigation',
    'modules/Template'
];
ModuleLoader.loadModules(modules)
    .then(() => {
        console.log('modules loaded!');
        return Navigation.loadStartingContent('main');
    });
