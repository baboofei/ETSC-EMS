Ext.define('EIM.controller.PersonalMessages', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridPersonalMessages'
    ],
    models: [
        'GridPersonalMessage'
    ],

    views: [
        'personal_message.Grid',
        'personal_message.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'personal_message_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'personal_message_grid': {
                selectionchange: this.selectionChange,
                cellclick: this.markThisAsRead
            },
            'personal_message_grid button[action=markAsRead]': {
                click: this.markAsRead
            },
            'personal_message_grid button[action=markAsUnread]': {
                click: this.markAsUnread
            },
            'personal_message_form button[action=save]': {
                click: this.submit
            }
        });
    },

    selectionChange: function(selectionModel, selected) {
        var btn_mark_as_read = Ext.ComponentQuery.query('personal_message_grid button[action=markAsRead]')[0];
        var btn_mark_as_unread = Ext.ComponentQuery.query('personal_message_grid button[action=markAsUnread]')[0];
        if(selected.length > 0) {
            btn_mark_as_read.enable();
            btn_mark_as_unread.enable();
        }else{
            btn_mark_as_read.disable();
            btn_mark_as_unread.disable();
        }
    },

    markThisAsRead: function(table, td, cellIndex, record) {
        var td_inner = td.innerHTML;
        if(!record.get("flag")) {
            if(td_inner.indexOf("<a href=") != -1 && td_inner.indexOf("filterStr") != -1){
                //如果点击的这一行有一个“外tag链接”，则点完算已读
                Ext.Ajax.request({
                    url: 'personal_messages/mark_as_read',
                    params: {
                        personal_message_ids: record["data"]["id"]
                    },
                    success: function() {
                        Ext.getStore('GridPersonalMessages').load();
                    }
                });
            }
        }
    },

    markAsRead: function(button) {
        var grid = button.up('grid');
        var selected_personal_messages = Ext.Array.pluck(Ext.Array.pluck(grid.getSelectedItems(), 'data'), 'id');
        //        console.log(selected);
        Ext.Ajax.request({
            url: 'personal_messages/mark_as_read',
            params: {
                personal_message_ids: selected_personal_messages.join("|")
            },
            success: function() {
                Ext.getStore('GridPersonalMessages').load();
            }
        });
    },

    markAsUnread: function(button) {
        var grid = button.up('grid');
        var selected_personal_messages = Ext.Array.pluck(Ext.Array.pluck(grid.getSelectedItems(), 'data'), 'id');
//        console.log(selected_personal_messages);
        Ext.Ajax.request({
            url: 'personal_messages/mark_as_unread',
            params: {
                personal_message_ids: selected_personal_messages.join("|")
            },
            success: function() {
                Ext.getStore('GridPersonalMessages').load();
            }
        });
    },

    submit: function(button){
        var win = button.up('window');
        var form = win.down('form', false);

        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url:"personal_messages/save_personal_message",
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                }
            });
        }
    }
});