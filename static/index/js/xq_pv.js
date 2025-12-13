$(function () {
    var isOverGoogleAdinfo = false;
    $('.xq1').on('mouseover', function () {
        isOverGoogleAdinfo = true
    });
    $('.xq1').on('mouseout', function () {
        isOverGoogleAdinfo = false
    });

    $(window).blur(function (e) {
        if (isOverGoogleAdinfo == true) {
            console.log('info_blur');
            dataLayer.push({'event': 'xq-ad'})
        }

    })
});