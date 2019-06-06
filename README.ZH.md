# Gakki

> 这是一个用`React Native`写的 [Mastodon](https://joinmastodon.org/) 客户端（近期只考虑 Android）
>

[English](./README.md)

**[直接下载APK](https://github.com/shuiRong/Gakki/releases)**

[<img src="https://i.imgur.com/fTum3oy.png" alt="Get it on F-Droid" height="80" />](https://apt.izzysoft.de/fdroid/index/apk/com.gakki)

> Gakki开发系列文章/教程正在紧张的书写中.


#### 特性

---

* 沉浸式设计
* 实现Mastodon稳定版大多数功能
* 多账户支持
* 白天、夜间双模式支持
* 草莓县（cmx.im）自定义表情包支持；
* 代码完全开源
* 无必须权限（拍照和上传图片自行开启权限）





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
export const token = 'Bearer xxxxxxxx'  // 必须。
export const version = '1.0' // 当前应用的版本，会用在About页面，必须
```

其中`xxxxxxxxx`为你申请的实例`token`，申请方法如下：

1. 打开你所在实例的**设置页面**，比如草莓县的：https://cmx.im/settings/applications
2. 在 开发-你的应用 中**创建新应用**：应用名称随便填写，应用网站任意网站，比如：`https://google.com`， 重定向 URI 不必修改，权限范围根据需要选择（建议全部勾选），最后**提交**
3. 点击查看你刚创建的应用详情，上方**你的访问令牌**即为你需要添加到`config.js`中的值（注意`Bearer` 后面有个空格哦～）



**[签名 APK](https://reactnative.cn/docs/signed-apk-android):**

首先输入这条命令: `keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`

然后：

1. 把`my-release-key.keystore`文件放到你工程中的`android/app`文件夹下。
2. 编辑`~/.gradle/gradle.properties`（全局配置，对所有项目有效）或是`项目目录/android/gradle.properties`（项目配置，只对所在项目有效）。如果没有`gradle.properties`文件你就自己创建一个，添加如下的代码（注意把其中的`****`替换为相应密码）

```bash
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```



**运行项目前**需要通过 USB 将手机连接到电脑上，遵循[官方教程](https://facebook.github.io/react-native/docs/running-on-device) [中文教程](https://reactnative.cn/docs/0.51/getting-started/)或者自行 Google 教程

然后运行项目：

```bash
react-native run-android
```

P.S. 如果遇到任何项目上的问题都可以在[issue](https://github.com/shuiRong/Gakki/issues)区提出。




#### 效果预览

---
| ![gakki](./preview/1.png) | ![gakki](./preview/2.png) |![gakki](./preview/3.png)  |
|-|-|-|
|  ![gakki](./preview/4.png)   |   ![gakki](./preview/5.png)   |   ![gakki](./preview/6.png)   |
|   ![gakki](./preview/7.png)   | ![gakki](./preview/8.png)     |   ![gakki](./preview/9.png)    |
|  ![gakki](./preview/10.png)    |  ![gakki](./preview/11.png)    |      |




#### 待办事项

---

[功能管理](https://github.com/shuiRong/Gakki/projects/2)