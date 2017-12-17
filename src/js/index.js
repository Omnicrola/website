let modules = [
    'modules/Slideshow',
    'modules/BoxSizing',
    'modules/Ajax',
    'modules/NavigationCache',
    'modules/Navigation',
];
AsyncLoader.loadModules(modules)
    .then(() => {
        console.log('modules loaded!');

        document.addEventListener('ajax-load', (event) => {
            BoxSizing.squareUp();
        });

       Navigation.loadDefaultContent('main.html');
    });



function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

    for (var i = 0; i < 81; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
console.log(makeid())