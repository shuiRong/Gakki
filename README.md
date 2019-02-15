# Gakki

> 这是一个用`React Native`写的 [Mastodon](https://joinmastodon.org/) 客户端（近期只考虑 Android）
>
> 这是 [开发测试账号](https://cmx.im/web/accounts/81232) ，我会在上面更新最新的项目开发动态



#### 本地运行：

---

**首先**确保你本地有 ReactNative 项目所需环境（不考虑 iOS 环境），官方文档 [英文教程](https://facebook.github.io/react-native/docs/getting-started) [中文教程](https://reactnative.cn/docs/0.51/getting-started/)

**下载项目：**

```bash
git clone https://github.com/shuiRong/Gakki
cd ./Gakki
yarn // or npm i
```



**添加配置文件：**

新建`src/utils/config.js`，内容如下：

```javascript
export const token = 'Bearer xxxxxxxx'  // 必须
export const deploymentKey = 'yyyyyyy'  // CodePush生成的应用发布key，必须，更多详情自行查文档
export const version = '1.0' // 当前应用的版本，会用在About页面，必须
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

P.S. 如果遇到任何项目上的问题都可以在[issue](https://github.com/shuiRong/Gakki/issues)区提出，或者来Mastodon[找我](https://cmx.im/web/accounts/81232)



#### 效果预览

---

![gakki](./preview/1.png)![gakki](./preview/2.png)![gakki](./preview/3.png)![gakki](./preview/4.png)![gakki](./preview/5.png)![gakki](./preview/6.png)![gakki](./preview/7.png)![gakki](./preview/8.png)![gakki](./preview/10.png)![gakki](./preview/11.png)![gakki](./preview/12.png)![gakki](./preview/13.png)![gakki](./preview/14.png)



#### 待办事项

---

- [ ] 通知页面细分为：`提及`、`点赞`、`转发`、`关注`，四个Tab
- [ ] 在本站Tab下，向右滑打开侧栏
- [ ] 屏蔽某人后，其他嘟文中@此人的嘟文一并屏蔽（此功能可在设置页面手动启用）（by @shioko）
- [ ] 支持DNS over HTTPS，免翻墙
- [ ] 嘟文附近添加`翻译`按钮，翻译嘟文
- [ ] 国际化：选择语言
- [ ] 支持列表功能：自定义时间线
- [ ] 支持多账号登陆
- [ ] 增加设置：默认显示所有敏感文件/敏感内容（可手动启用/关闭）
- [ ] 增加设置：删除前增加确认框（可手动启用/关闭）
- [ ] 增加设置：是否启用GIF（因为有损性能）
- [ ] 增加`删除并重新编辑`功能
- [ ] 增加推送功能（附带提示音）
- [ ] 增加设置：管理通知项
- [ ] 增加更多主题