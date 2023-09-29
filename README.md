# QSCTech 2023 Autumn Round Two

~~PS：记错时间了，以为 30 号交，来不及做了qwq。~~

## common

没时间了花了两个小时画的，[原型图](https://www.figma.com/file/hsyel4vvGpm4PYt3wouYZ9/Untitled?type=design&node-id=3%3A2&mode=design&t=H6gWivRepEXf3wno-1)略显简陋。

## magicClock

**Question 1**

从 package.json 可知 `npm start ` 就是 `node achieveSys.js`，作用大概是根据 `achieveSys.js` 来维持一个类似于服务器+后端的东西。

**Question 2**

在 canvas 中`e.offsetX` 可以求出坐标到 canvas 左侧的距离，一般情况下大概是坐标距离该点所属的 `element` 的距离。

`e.clientX` 大概是坐标到浏览器界面的左侧的距离。

**Question 3**

1. 直接输入时间
2. 用两个按钮控制小时加减，两个按钮控制分钟加减

3. random!

**Question 4**

看上去此题需要用到 html, javascript（还用的 canvas）, Node.js（甚至用了 express），属实是一道不错的《前端零基础》题。





**心路历程 ~~（血泪史）~~**

1. 完全没有 javascript 的经验，因此先浅浅学习了一下 js 以及 canvas，然后把 clockboard 和 bolt 给贴上去了。

2. 卡在插销的移动上，因为了解到 mouse 事件控制，也搜索借鉴了鼠标拖动相关的blog等，大概花了一个晚上来解决。

3. 卡在时针分针控制上，几经辗转意识到 canvas 的 rotate 和 translate 结合可以实现图片平移旋转的问题，又有之前 mouse 触发器的经验，直接自己整出来一个时针分针旋转定位的东西。（计算角度和位置差量真难调）。**到此**体验还是很不错的，甚至给人一种胜券在握的错觉。
4. 尝试 node.js 的连接，结果发现啥信息都接收不到，127.0.0.1:9998 显示 cannot GET /。
5. 尝试了在 achieveSys.js 把 listen 的 host 换成 'localhost' 无果
6. 尝试了把所有 host 换成 127.0.0.1 无果
7. 尝试了更改 IPv6 和 IPv4 的优先级，无果
8. 尝试了更改防火墙设置 9998 端口开放，无果
9. 通读若干源码后，尝试清空 dialogMETA.json 为 {}，5500 无法连接到 9998，但可以显示注入的对话了（伴随着时停会重置的“特性”）。
10. 尝试修改 dialogMachine.js 防止它频繁重置，但是对话没了。
11. 尝试更改在 json 文件里添加信息防止它做无谓的 connect。
12. 因此**目前时钟在不连接服务器的时候是表现良好的**，连接服务器就会出现莫名其妙的情况，无法**在5500上显示对话，但是在 Node.js 上可以正确显示对话信息**。

**Ver 0.1~0.4** 

忘记了

**Ver 0.5**

- 增加animation实时反馈

**Ver 0.6**

- 插销横向固定
- 插销设置下界
- 完成插销冻结时间
- 修改插销控制范围
- 调整拖动机制
- 添加钟面判定

**Ver 0.7**

- 完成钟面时间更改
- 修复了插销乱动的bug

**Ver 0.8~0.9**

- 一直在调试Node.js，啥也没干
- 代码已经被瞎改得面目全非了





虽然后半程的体验让人抓狂，但还是学到了很多新东西。通过一遍又一遍翻看 javascript 的代码让我对 express 有所熟悉，让我对 api 的连接使用有了认知，让我对前端、服务器、后端有了更深的体会。



对于文章打**9**分，原因：

1. “本题面向志在前端的零基础开发者/产品方向的同学”
2. “只需要学习node.js环境的简单配置”
3. “甚至无需掌握`HTML`和`css`”
4. Node.js部分 "需要注意的是，如果你在上述步骤中遇到什么问题，请善用搜索引擎解决。"



最后感谢 qsc 和各位出题人提供的资源，游玩很愉快！