const handlerSpy = function() {
    $(window).off('scroll');
    var menu = {};

    $('article, footer').each(function() {
        var $el = $(this);
        menu[$el.offset().top] = $el.prop('id');
    });

    var tops = Object.keys(menu).sort(function(a, b){return b-a});
    var plusTop = $(window).height() / 2;

    scrollHandler = function() {
        var top = $(this).scrollTop() + plusTop;

        for(var i=0; i < tops.length; i++) {
            if((top - tops[i]) >= 0 ) {
                var $el = $("a[href='#" + menu[tops[i]] + "']");
                if(!$el.hasClass('current')) {
                    $('.current').removeClass('current');
                    $el.addClass('current');
                }
                return true;
            }
        }

    }

    $(window).on('scroll', scrollHandler );
    scrollHandler();
}

$(function() {
    $(window).on('resize', handlerSpy);
    handlerSpy();

    $('nav a, .readmore a').on('click', function() {
        $.scrollTo($($(this).attr('href')), 500);
        return false;
    });
});
