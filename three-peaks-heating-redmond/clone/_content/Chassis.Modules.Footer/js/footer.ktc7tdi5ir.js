$(function () {
    var $fnav = $('.fnav');
    var $fbtn = $('.floc-btn');
    var $fvlinks = $('.fnav .links');
    var $fhlinks = $('.fnav .hidden-links');

    var $flocmenu = $('.floc-btn, .floc-moremenu');

    var fnumOfItems = 0;
    var ftotalSpace = 0;
    var fbreakWidths = [];

    // Get initial state
    $fvlinks.children().outerWidth(function (i, w) {
        ftotalSpace += w;
        fnumOfItems += 1;
        fbreakWidths.push(ftotalSpace);
    });

    var favailableSpace, fnumOfVisibleItems, frequiredSpace;

    function check() {
        // Get instant state
        favailableSpace = $fvlinks.width() - 10;
        fnumOfVisibleItems = $fvlinks.children().length;
        frequiredSpace = fbreakWidths[fnumOfVisibleItems - 1];

        // There is not enought space
        if (frequiredSpace > favailableSpace) {
            $fvlinks.children().last().prependTo($fhlinks);
            fnumOfVisibleItems -= 1;
            check();
            // There is more than enough space
        } else if (favailableSpace > fbreakWidths[fnumOfVisibleItems]) {
            $fhlinks.children().first().appendTo($fvlinks);
            fnumOfVisibleItems += 1;
        }
        // Update the button accordingly
        $fbtn.attr("count", fnumOfItems - fnumOfVisibleItems);
        if (fnumOfVisibleItems === fnumOfItems) {
            $fbtn.addClass('hidden');
        } else $fbtn.removeClass('hidden');
    }

    // Window listeners
    $(window).resize(function () {
        check();
    });

    $fbtn.on('click', function () {
        $fhlinks.toggleClass('hidden');
    });

    check();
});

//Close more locations menu on click outside
$(document).mouseup(function (e) {
    var fcontainer = $(".fnav-btn-panel");
    if ($(".floc-moremenu").not("hidden")) {
        if (!fcontainer.is(e.target)
            && fcontainer.has(e.target).length === 0) {
            $(".floc-moremenu").addClass("hidden");
        };
    };
});

