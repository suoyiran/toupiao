[部署文档](https://apisev.cn/project-10/doc-30/)

>**下载**

`git clone https://gitee.com/Kindear/mvote.git` 

>**导入**

使用微信小程序开发者工具导入

导入完成后修改如下几个文件
>project.config.json

1. 修改`appid`为自己的小程序`appid`

>common/config/dev.js

1. 修改`CloudId`为自己的云开发环境id
2. 修改`AdminList`为自己设置的管理员`openid`(每个小程序每个用户都是不同的)

```javascript
module.exports={
  UseCloud:true,
  CloudId:'vote-2gfub75a687652ec',   //云开发环境id
  TraceUser:true,           //记录用户访问日志
  AdaptStorge:true,         //允许缓存用户数据
  SevDomain:'http://localhost',     //服务器的域名
  AdminMode:true,           //管理员权限模式
  AdminList:[
    'openid'
  ]
}
```

>**云环境配置**

1. 上传并部署全部云函数

![](/media//202011/2020-11-13_120812.png)

2. 取消`app.js`中的初始化注释，重新运行小程序（只需要一次）

```javascript
  onLaunch: function(options) {
    //初始化集合只用一次就行
    cloud.InitCollection();
  },
```
运行完后云空间生成三个数据集合
1. `VOTE_ACT` 投票活动记录
2. `VOTE_PART` 投票参加人员记录
3. `VOTE_LOG` 投票记录

然后在`app.js`中注释掉`cloud.InitCollection()`
3. 修改云环境数据集合`访问权限`

- `VOTE_ACT`修改为自定义规则
```json
{
  "read": true,
  "write": true
}
```
- `VOTE_PART`同上
- `VOTE_LOG`设置为所有用户可读，仅创建者可写

>**其他问题**

部署有问题请在 `issue`中提出，或联系kindear@foxmail.com


