Ext.define('EIM.controller.Login', {
    extend: 'Ext.app.Controller',

    models: [
        //        'User'
    ],
    stores: [
        //        'Users'
    ],
    views: [
        'login.Form',
        'login.Display'
    ],

    refs: [{
        ref: 'loginForm',
        selector: 'form'
    }, {
        ref: 'loginButton',
        selector: 'loginform button[action=login]'
    }],

    init: function() {
        var me = this;
        if (islogin === false) {
            me.loginWindow = Ext.create('widget.loginform');
            me.control({
                'loginform textfield': {
                    keypress: function(textfield, e, eOpts) {
                        //                        console.log(e.button === 12);
                        if (e.button === 12) {
                            this.loginsubmit();
                        }
                    }
                },
                'loginform button[action=login]': {
                    click: function(button) {
                        this.loginsubmit(button);

                    }
                }
            });
        } else {
            me.onFormSubmit();
        }
    },
    onFormSubmit: function() {
        var me = this;
        //        console.log(userName);
        var remind = "";
        if (unreadReminds > 0) {
            remind = "，你有" + unreadReminds + "条未读提醒。";
        } else {
            remind = "";
        }
        Ext.example.msg("欢迎登录", userName + remind);
        load_uniq_controller(me, 'Layout');
        load_uniq_controller(me, 'Functions');

        Ext.widget('eim_layout', {
            //            这里可以这样传参数过去
            //            padding: 20
        }).show();
    },
    loginsubmit: function(button) {
        var me = this;
        this.getLoginForm().form.submit({
            waitTitle: '登录中',
            waitMsg: '正在登录，请稍候……',
            url: '/login/login',
            standardSubmit: true,
            width: 200,
            method: 'POST',
            success: function(form, action) {
                me.loginWindow.destroy();
                //最后还是得这么写才能带上用户名之类
                location.reload();
                //                me.onFormSubmit();
            },
            failure: function(form, action) {
                Ext.Msg.show({
                    title: '错误',
                    msg: '用户名/密码输入错误！',
                    width: 300,
                    buttons: Ext.Msg.OK,
                    animateTarget: button,
                    fn: function() {
                        //                        console.log(wrong_time);
                        if (wrong_time > 1) {
                            me.generateThreeLegitimateWindow();
                        }
                        wrong_time = wrong_time + 1;
                        Ext.ComponentQuery.query("loginform [name=reg_name]")[0].focus();
                    }
                });
                // Ext.MessageBox.alert('错误', "用户名/密码输入错误！");
                //                            },
                //                            params: {
                //                                view: 'sencha',
                //                                json: true
            }
        });
    },

    generateLegitimateWindow: function() {
        var browser_width = Ext.getBody().getViewSize().width;
        var browser_height = Ext.getBody().getViewSize().height;

        //最大宽度和最大高度是浏览器窗口宽高的一半
        //最小宽度和最小高度是浏览器窗口宽高的1/6
        var win_width = (browser_width / 6) + (Math.random() * browser_width / 3);
        var win_height = (browser_height / 6) + (Math.random() * browser_height / 3);

        var win_x = Math.random() * (browser_width - win_width);
        var win_y = Math.random() * (browser_height - win_height);
        Ext.create('Ext.window.Window', {
            name: 'captcha_window',
            title: '验证窗口',
            width: win_width,
            height: win_height,
            html: '<p style="font-size: 14px; text-align: center;">请关掉这三个窗口中<b>最宽的</b>一个以证明你不是机器人。</p>',
            x: win_x,
            y: win_y,
            closable: true,
            closeAction: 'destroy',
            renderTo: Ext.getBody()
        }).show();
    },

    checkCaptcha: function(window, captcha_windows) {
        var me = this;
        //先全关了再说
        Ext.Array.each(captcha_windows, function(item) {
            item.un('close', function(window) {
                me.checkCaptcha(window, captcha_windows);
            });
            item.close();
        });
        var width_array = Ext.Array.pluck(captcha_windows, "width");
        if (window.width === Ext.Array.max(width_array)) {
            Ext.ComponentQuery.query("loginform [id=Login]")[0].enable();
        } else {
            me.generateThreeLegitimateWindow();
        }
    },

    generateThreeLegitimateWindow: function() {
        var me = this;
        //生成三个窗口
        me.generateLegitimateWindow();
        me.generateLegitimateWindow();
        me.generateLegitimateWindow();
        //加载关闭事件
        var captcha_windows = Ext.ComponentQuery.query('[name=captcha_window]');
        Ext.Array.each(captcha_windows, function(item) {
            item.on('close', function(window) {
                me.checkCaptcha(window, captcha_windows);
            });
        });
        //灰掉提交按钮
        Ext.ComponentQuery.query("loginform [id=Login]")[0].disable();
    }
});