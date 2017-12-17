let BoxSizing = (() => {
    function squareUp() {
        let squares = document.querySelectorAll('.box-square')
        squares.forEach((element) => {
            let width = element.offsetWidth;
            element.style['height'] = width + 'px';
        });
    }

    window.onresize = () => {
        squareUp();
    };
    return {
        squareUp: squareUp
    }
})();
