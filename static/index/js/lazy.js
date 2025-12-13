$(document).ready(function () {
    if ($("img.lazy").length) {
        new LazyLoad({})
    }
    ;
});


function search() {
    var keyword = $('#searchB').val().trim() || $('#searchA').val().trim();
    if (!keyword) {
        layer.alert('请输入搜索内容')
        return false
    } else {
        window.location.href = '/search?key=' + keyword;
    }
}

// 键盘按键提交
$("#searchA").keydown(function (e) {
    if (e.keyCode == 13) {
        search();
    }
});
$("#searchB").keydown(function (e) {
    if (e.keyCode == 13) {
        search();
    }
});