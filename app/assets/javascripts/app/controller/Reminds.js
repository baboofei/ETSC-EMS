Ext.define('EIM.controller.Reminds', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridReminds'
    ],
    models: [
        'GridRemind'
    ],

    views: [
        'remind.Grid',
        'remind.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'remind_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'remind_grid': {
                selectionchange: this.selectionChange,
                cellclick: this.markThisAsRead
            },
            'remind_grid button[action=addRemind]': {
                click: this.loadRemindController
            },
            'remind_grid button[action=markAsRead]': {
                click: this.markAsRead
            },
            'remind_form button[action=save]': {
                //                click: function() {console.log("AGD");}
                click: this.submit
            }
        });
    },

    selectionChange: function(selectionModel, selected) {
        var btn_mark = Ext.ComponentQuery.query('remind_grid button[action=markAsRead]')[0];
        if (selected.length > 0) {
            btn_mark.enable();
        } else {
            btn_mark.disable();
        }
    },

    loadRemindController: function() {
        var me = this;
        load_uniq_controller(me, 'Reminds');
        //        var salecase_number = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("number");
        var view = Ext.widget('remind_form').show();
        //        view.down('[name=source]', false).setValue(salecase_number);
    },

    markThisAsRead: function(table, td, cellIndex, record) {
        var td_inner = td.innerHTML;
        if (td_inner.indexOf("<a href=") != -1 && td_inner.indexOf("filterStr") != -1) {
            //如果点击的这一行有一个“外tag链接”，则点完算已读
            Ext.Ajax.request({
                url: 'reminds/mark_as_read',
                params: {
                    remind_ids: record["data"]["id"]
                },
                success: function() {
                    Ext.getStore('GridReminds').load();
                }
            });
        }
    },

    markAsRead: function(button) {
        var grid = button.up('grid');
        var selected_reminds = Ext.Array.pluck(Ext.Array.pluck(grid.getSelectedItems(), 'data'), 'id');
        //        console.log(selected);
        Ext.Ajax.request({
            url: 'reminds/mark_as_read',
            params: {
                remind_ids: selected_reminds.join("|")
            },
            success: function() {
                Ext.getStore('GridReminds').load();
            }
        });
    },

    submit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);

        if (form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "reminds/save_remind",
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