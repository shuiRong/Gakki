# gakki

> 这是一个用`React Native`写的 [Mastodon](https://joinmastodon.org/) 客户端（近期只考虑 Android）
>
> 这是 [开发测试账号](https://cmx.im/web/accounts/81232) ，我会在上面更新最新的项目开发动态

#### 本地运行：

---

**首先**确保你本地有 ReactNative 项目所需环境（不考虑 iOS 环境），官方文档 [英文教程](https://facebook.github.io/react-native/docs/getting-started) [中文教程](https://reactnative.cn/docs/0.51/getting-started/)

**下载项目：**

```bash
git clone https://github.com/shuiRong/gakki
cd ./gakki
yarn // or npm i
```



**添加配置文件：**

新建`src/utils/config.js`，内容如下：

```javascript
export default {
  token: 'Bearer xxxxxxxxx'
}

```

其中`xxxxxxxxx`为你申请的实例`token`，申请方法如下：

1. 打开你所在实例的**设置页面**，比如草莓县的：https://cmx.im/settings/applications
2. 在 开发-你的应用 中**创建新应用**：应用名称随便填写，应用网站任意网站，比如：https://google.com，重定向 URI 不必修改，权限范围根据需要选择（建议全部勾选），最后**提交**
3. 点击查看你刚创建的应用详情，上方**你的访问令牌**即为你需要添加到`config.js`中的值（注意`Bearer` 后面有个空格哦～）



**运行项目前**需要通过 USB 将手机连接到电脑上，遵循[官方教程](https://facebook.github.io/react-native/docs/running-on-device) [中文教程](https://reactnative.cn/docs/0.51/getting-started/)或者自行 Google 教程

然后运行项目：

```bash
react-native run-android
```

P.S. 如果遇到任何项目上的问题都可以在[issue](https://github.com/shuiRong/gakki/issues)区提出，或者来Mastodon找[我](https://cmx.im/web/accounts/81232)



#### 预览

---

![gakki](./preview/1.png)![gakki](./preview/2.png)
![gakki](./preview/3.png)![gakki](./preview/4.png)
![gakki](./preview/5.png)![gakki](./preview/6.png)
![gakki](./preview/7.png)![gakki](./preview/8.png)
![gakki](./preview/10.png)![gakki](./preview/11.png)
![gakki](./preview/12.png)