# Gakki

> This is a third-part client of [Mastodon](https://joinmastodon.org/) written by `React Native`（only Android is considered recently）.
>

[中文](./README.ZH.md)

**[Download APK Directly](https://github.com/shuiRong/Gakki/releases)**

[<img src="https://i.imgur.com/fTum3oy.png" alt="Get it on F-Droid" height="80" />](https://apt.izzysoft.de/fdroid/index/apk/com.gakki)

> a series of development tutorials are being prepared.


#### Features

---

* Immersive design
* Most Mastodon functions implemented
* Multi-Account support
* Night, Day mode
* Custom emoticon support (belong to cmx.im)
* Open-source completely
* No permission required（allow permission yourself if take pictures）




#### Getting Started：

---

**First of all**, You need to having required environment of `React Native` .（just Android） [Official Documentation](https://facebook.github.io/react-native/docs/getting-started).

**Download Project：**

```bash
git clone https://github.com/shuiRong/Gakki
cd ./Gakki
yarn // or npm i
```

**Create Local Config file**

create file in `src/utils/config.js`, it contains：

```javascript
export const token = 'Bearer xxxxxxxx'  // required. (Watch out: there is a blank space.)
export const version = '1.0' // required. app version used in About.js
```

> How to get my token?
>
> 1. You need a mastodon account and then open your setting page. For example: https://cmx.im/settings/applications.
> 2. Create a new application in Development-->Yout applications.
> 3. set `Redirect URI` to `https://linshuirong.cn` this version temporarily (will be optimized in the next version).
> 4. select all Scopes.
> 5. click `Submit` button
>
> Click the Application you just created. You can see `Your access token`, that's it.



**[Signing APK](https://facebook.github.io/react-native/docs/signed-apk-android):**

First of all, type this: `keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`

and then: 

1. Place the `my-release-key.keystore` file under the `android/app` directory in your project folder.
2. Edit the file `~/.gradle/gradle.properties` or `android/gradle.properties`, and add the following (replace `*****` with the correct keystore password, alias and key password),

```bash
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```



**Connect Phone:** connect your phone to the computer using USB. see [Offcial Documentation](https://facebook.github.io/react-native/docs/running-on-device) and Google your question. 

**Run Project:**

```bash
react-native run-android
```

P.S. Submit an [issue](https://github.com/shuiRong/Gakki/issues) if you have a problem with Gakki.

#### Page Preview

---
| ![gakki](./preview/1.png) | ![gakki](./preview/2.png) |![gakki](./preview/3.png)  |
|-|-|-|
|  ![gakki](./preview/4.png)   |   ![gakki](./preview/5.png)   |   ![gakki](./preview/6.png)   |
|   ![gakki](./preview/7.png)   | ![gakki](./preview/8.png)     |   ![gakki](./preview/9.png)    |
|  ![gakki](./preview/10.png)    |  ![gakki](./preview/11.png)    |      |




#### Todo List

---

[Github Projects](https://github.com/shuiRong/Gakki/projects/2)
