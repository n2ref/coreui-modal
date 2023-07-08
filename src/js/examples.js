document.addEventListener('DOMContentLoaded', function () {

    // Simple
    $('#btn-simple').click(function () {
        CoreUI.modal.show("Title modal", "Body content", {
            id: "simple",
            footer: "Footer content",
            onShow: function (event) {
                console.log('Show');
            },
            onShown: function (event) {
                console.log('Shown');
            },
            onHide: function (event) {
                console.log('Hide');
            },
            onHidden: function (event) {
                console.log('Hidden');
            }
        });
    });


    // Sizes
    $('#btn-modal-fullscreen').click(function () {
        CoreUI.modal.show("Title modal", "Body content", {
            footer: "Footer content",
            size: "fullscreen"
        });
    });

    $('#btn-modal-xl').click(function () {
        CoreUI.modal.show("Title modal", "Body content", {
            footer: "Footer content",
            size: "xl"
        });
    });

    $('#btn-modal-lg').click(function () {
        CoreUI.modal.show("Title modal", "Body content", {
            footer: "Footer content",
            size: "lg"
        });
    });

    $('#btn-modal-sm').click(function () {
        CoreUI.modal.show("Title modal", "Body content", {
            footer: "Footer content",
            size: "sm"
        });
    });

    $('#btn-modal-load').click(function () {
        CoreUI.modal.showLoad("Title modal", "data/sample.html", {
            footer: "Footer content",
            size: "lg"
        });
    });


    // Code highlight
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
});