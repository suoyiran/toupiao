> 项目介绍

[cnblogs 地址 给个关注 Orz](https://www.cnblogs.com/masterchd/p/14251326.html)

允许商业使用,但必须保存项目介绍页面,如果需要删除，请联系作者邮箱。

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
  CloudId:'',   //云开发环境id
  TraceUser:true,           //记录用户访问日志
  AdaptStorge:true,         //允许缓存用户数据
  SevDomain:'http://localhost',     //服务器的域名
  AdminMode:true,           //管理员权限模式
  OnceLimit:true,           //发布限制，true 每个用户仅可以发布一次
  VoteLimit:1,              //每个用户的可用票数(每天)
  DayFresh:true,            //每天可以重新投票一次
  AdminList:[
    'o8G9I44Wdhx9gxp4m9FE1kz6j96o',
    'o8G9I49pI7GG57qFQFw_NoyQDsJI',
  ]
}
```

3. 根据需要对`OnceLimit`，`VoteLimit`，`DayFresh`进行配置

   | Mode                   | OnceLimit | VoteLimit | DayFresh |
   | ---------------------- | --------- | --------- | -------- |
   | 每个用户仅可投票一次   | true      | 1         | false    |
   | 每个用户可投票三次     | false     | 3         | false    |
   | 每个用户每天可投票一次 | true      | 1         | true     |
   | 每个用户每天可投票三次 | false     | 3         | true     |



**TIPS:不确保不存在BUG，请自行测试，有BUG欢迎在`issue`提出**



>**云环境配置**

1. 上传并部署全部云函数



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
- `VOTE_LOG`同上

>**其他问题**

部署有问题请在 `issue`中提出，或联系kindear@foxmail.com


