Ext.define('EIM.controller.Users', {
    extend: 'Ext.app.Controller',

    stores: ['GridUsers'],
    models: ['GridUser'],

    views: [
        'user.Grid',
        'user.Form',
        'user.PasswordForm'
    ],

    refs: [{
        ref: 'grid',
        selector: 'user_grid'
    }],

    init: function() {
        this.control({
            'user_grid': {
                itemdblclick: this.editUser,
                selectionchange: this.selectionChange
            },
            'password_form textfield[name=new_password], password_form textfield[name=confirm_password]': {
                change: this.checkSamePassword,
                blur: this.checkSamePassword
            },
            'password_form button[action=submitPassword]': {
                click: this.submitPassword
            },
            'user_form [name=en_name]': {
                change: this.unifyRegNameEmail
            },
            'user_form [name=reg_name]': {
                change: this.validateRegNameUnique
            },
            'user_form button[action=save]': {
                click: this.updateUser
            },
            'button[action=addUser]': {
                click: this.addUser
            },
            'button[action=print]': {
                click: this.printTest
            }
        });
    },

    addUser: function() {
        var view = Ext.widget('user_form');
        view.show();
    },

    editUser: function() {
        var record = this.getGrid().getSelectedItem();
        if(record.get('editable') === true) {
            var view = Ext.widget('user_form').show();
            view.down('form', false).loadRecord(record);
        }
    },

    updateUser: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url:'users/save_user',
//                params: submit_params,
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridUsers').load();
                }
            });
        }
    },

    selectionChange: function(selectionModel, selections) {
//        var grid = this.getGrid();
//
//        if (selections.length > 0) {
//            grid.enableRecordButtons();
//        } else {
//            grid.disableRecordButtons();
//        }
    },

    checkSamePassword: function(text) {
        var form = text.up('form');
        var new_password_field = form.down('[name=new_password]', false);
        var confirm_password_field = form.down('[name=confirm_password]', false);
        if(new_password_field.getValue() != confirm_password_field.getValue()) {
            new_password_field.markInvalid('两次输入的密码不一致！');
            confirm_password_field.markInvalid('两次输入的密码不一致！');
        }else{
            new_password_field.clearInvalid();
            confirm_password_field.clearInvalid();
        }
    },

    submitPassword: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: '/users/change_password',
                submitEmptyText:false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    win.close();
                    //                                Ext.getStore('GridCustomers').load();
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
        }
    },

    unifyRegNameEmail: function(text, newValue) {
        var form = text.up('form');
        var reg_name_field = form.down('[name=reg_name]', false);
        var etsc_email_field = form.down('[name=etsc_email]', false);
        var surname = newValue.split(" ")[1];
        var given_name = newValue.split(" ")[0];
        reg_name_field.setValue(given_name.toLocaleLowerCase());
        if(surname) {
            var pre = (surname[1] === "h" ? surname.substr(0,2) : surname[0]);
            etsc_email_field.setValue(given_name.toLocaleLowerCase() + pre.toLocaleLowerCase() + "@etsc-tech.com");
        } else {
            etsc_email_field.setValue(given_name.toLocaleLowerCase() + "@etsc-tech.com");
        }
    },

    validateRegNameUnique: function(text, newValue) {
        var form = text.up('form');
        var id = form.down('[name=id]', false).getValue();
        Ext.Ajax.request({
            url: 'users/validate_reg_name_unique',
            params: {
                id: id,
                reg_name: newValue
            },
            success: function(response) {
//                console.log("Y");
                var msg = Ext.decode(response.responseText);
//                Ext.example.msg('失败', msg.message);
//                button.enable();
                if(msg.success === true) {
                    text.clearInvalid();
                } else {
                    text.markInvalid('此登录名已经被占用了，请换一个');
                }
            },
            failure: function() {
//                console.log("N");
            }
        });
    },

    printTest: function() {
        Ext.Ajax.request({
            url: '/users/etsc_print',
            success: function(response){
                var text = Ext.decode(response.responseText);
                console.log(text);
//        Ext.MessageBox.alert("ok", "打印好了");
            }
        });
    }

});
