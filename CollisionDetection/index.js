/**
 * Created by ligang on 17/5/25.
 */

var item1 = document.getElementById('item1'),
    item2 = document.getElementById('item2');


item1.onmousedown = function (e) {
    // window.event兼容IE,当事件发生时有效
    var e = e || window.event;

    // 获取鼠标点击的位置到所选对象的边框的水平距离
    var diffX = e.clientX - item1.offsetLeft;
    var diffY = e.clientY - item1.offsetTop;

    // 需设为document对象才能作用于整个文档
    document.onmousemove = function (e) {
        var e = e || window.event;

        var t1 = item1.offsetTop;
        var l1 = item1.offsetLeft;
        var r1 = item1.offsetLeft + item1.offsetWidth;
        var b1 = item1.offsetTop + item1.offsetHeight;

        var t2 = item2.offsetTop;
        var l2 = item2.offsetLeft;
        var r2 = item2.offsetLeft + item2.offsetWidth;
        var b2 = item2.offsetTop + item2.offsetHeight;

        if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) {
            // 表示没碰上
            item2.style.background = 'gray';
        } else {
            item2.style.background = 'blue';
        }

        // style.left表示所选对象的边框到浏览器左侧距离
        item1.style.left = e.clientX - diffX + 'px';
        item1.style.top = e.clientY - diffY + 'px';
    };

    //清除鼠标释放时的对象移动方法
    document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
    };
};