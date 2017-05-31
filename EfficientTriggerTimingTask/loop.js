/**
 * Created by ligang on 17/5/31.
 * 有这样一个需求：
 *  “如果连续30s没有请求包（例如登录，消息，keepalive包），服务端就要将这个用户的状态置为离线”。
 */

// 方式一：将所有任务都添加到某集合中，轮询扫描，如果达到条件则进行相关处理；

let map = new Map();
function doAction(uid) {
    map.set(uid, new Date().getTime());
}

setInterval(function(){
    for(let uid of map.keys()) {
        if(+new Date() - map.get(uid) > 10000) {
            map.delete(uid);
            console.log(`${uid}超过10s未做任何操作，设置为离线！`);
        }
    }
}, 1000);


// 方式二：每来一个任务，启动一个定时器，达到定时器时间，执行相关处理；

function doAction(uid) {
    map.set(uid, new Date().getTime());
    setTimeout(function() {
        console.log(`${uid}超过10s未做任何操作，设置为离线！`);
    }, 10000);
}


// 方式三：环形队列法

// new Array(31).fill(new Set())
// No，数组中所有Set集合为同一个

let listLoop = new Array(31),
    map = new Map(),  // 记录每个uid的slitIndex
    currentSlotIndex = 1; // 当前要检测的slot

function doAction(uid) {
    // 如果循环队列中已存在该uid，需要先干掉，重新计时
    let slotIndex = map.get(uid);
    slotIndex && listLoop[slotIndex].delete(uid);
    // 将该uid重现添加到循环队列中
    // 周期31，新插入的置入当前的后一个（即，30s后可以扫描到它）
    // 更新map中这个uid的最新slotIndex
    slotIndex = currentSlotIndex - 1;
    listLoop[slotIndex] = listLoop[slotIndex] ?
        listLoop[slotIndex].add(uid) : new Set().add(uid);
    map.set(uid, slotIndex);
}

// 每秒钟移动一个slot，这个slot对应的set集合中所有uid都为超时
// 如果所有slot对应的set集合都为空，则表示没有uid超时
setInterval(function() {
    var slotSet = listLoop[currentSlotIndex];
    if(slotSet && slotSet.size > 0) {
        for(let uid of slotSet.values()) {
            // 执行完的uid从map集合中剔除
            map.delete(uid);
            console.log(`<${uid}>超过30s未做任何操作，设置为离线！`);
        }
        // 置空该集合
        slotSet.clear();
    }
    // 指标继续+1
    currentSlotIndex = (++currentSlotIndex) % 31;
}, 1000);

// 思路、注意Map集合的内心移除情况。