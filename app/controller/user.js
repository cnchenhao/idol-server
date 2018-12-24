'use strict';
const jwt = require('jsonwebtoken');
const message = require('../../config/message');
const config = require('../../config/config.default')('');
const tronService = require("../service/tronService");
const Controller = require('egg').Controller;

class UserController extends Controller {
    async login() {
        const ctx = this.ctx;
        const { address } = ctx.request.body;

        await tronService.getBalance();
        const str1 = "tron idol 111";
        const str2 = "tron idol 222";

        const address1 = "TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY";
        const address2 = "TVjmtiAVdbox9LYtZ7eu8Bq7mHJFZCZ3dg";

        let signValue = await tronService.signMessage(str1);
        let a = await tronService.verifyMessage(str1, signValue, address1);
        let b = await tronService.verifyMessage(str2, signValue, address1);
        let c = await tronService.verifyMessage(str1, signValue, address2);

        console.log("a=" + a);
        console.log("b=" + b);
        console.log("c=" + c);

        let msg = message.returnObj('zh');
        let userId = await ctx.service.userService.login(address);

        if (userId <= 0) {
            ctx.body = msg.addressNotFound;
            return;
        }

        let content = { UserId: userId, Address: address };
        // 过期时间
        const expires = config.login.expires;
        // 生成token
        let token = jwt.sign(content, config.login.secretKey, {
            expiresIn: expires,
        });

        //下发cookies
        await ctx.cookies.set(config.keys, token);

        // 返回
        let retObj = msg.success;
        retObj.data = {
            access_token: token,
            expires_in: Math.floor(Date.now() / 1000) + expires,
            token_type: 'Bearer',
        };

        ctx.body = retObj;
    };

    async register() {
        const ctx = this.ctx;
        const { address, name } = ctx.request.body;

        let msg = message.returnObj('zh');
        let result = ctx.service.userService.register(address, name);

        ctx.body = msg.success;
    }

    async getUserInfo() {

    };

}

module.exports = UserController;