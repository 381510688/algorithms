# 碰撞检测


item1：
- l1: item1.offsetLeft
- t1: item1.offsetTop
- r1: item1.offsetLeft + item1.offsetWidth
- b1: item1.offsetTop + item1.offsetHeight


只用4中情况不会碰撞：
l1 > r2
t1 > b2
r1 < l2
b1 < t2

- offsetTop：`offsetTop = top + margin`
- offsetLeft：`offsetLeft = left + margin`
- offsetWidth：`offsetWidth = width + padding + border`
- offsetHeight：`offsetHeight = width + padding + border`

JavaScript中并不能获取到元素的width：`item.width` 和 `item.style.width` 统统不行！

**补充：**
- clientWidth：`clientWidth = width + padding`
- clientHeight：`clientHeight = height + padding`

`offsetTop`和`offsetLeft`可以通过`element.getClientRects()`获取，该方法返回一个指向客户端中每一个盒子的边界矩形的矩形集合；
`offsetWidth`和`offsetHeight`可以通过`Element.getBoundingClientRect()`获取，该方法返回元素的大小及其相对于视口的位置。

```javascript
item1.offsetLeft === item1.getClientRects()[0].left + document.body.scrollLeft
item1.offsetTop === item1.getClientRects()[0].top + document.body.scrollTop
```
        
        xw: node.x + node.w,
                        yh: node.y + node.h,
        if (n2.xw > n1.x && n2.x < n1.xw) {
            if (n2.yh > n1.y && n2.y < n1.yh) {