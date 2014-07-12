Ext.define('EIM.controller.Todos', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridTodos',
        'ComboFunctions'
    ],
    models: [
        'GridTodo',
        'ComboFunction'
    ],

    views: [
        'todo.Grid',
        'todo.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'todo_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'todo_grid': {
                selectionchange: this.selectionChange,
                cellclick: this.markThisAsRead
            },
            'todo_grid button[action=addTodo]': {
                click: this.loadTodoController
            },
            'todo_grid button[action=markAsRead]': {
                click: this.markAsRead
            },
            'todo_form button[action=save]': {
                //                click: function() {console.log("AGD");}
                click: this.submit
            }
        });
    },

    selectionChange: function(selectionModel, selected) {
        var btn_mark = Ext.ComponentQuery.query('todo_grid button[action=markAsRead]')[0];
        if (selected.length > 0) {
            btn_mark.enable();
        } else {
            btn_mark.disable();
        }
    },

    loadTodoController: function() {
        var me = this;
        load_uniq_controller(me, 'Todos');
        //        var salecase_number = Ext.ComponentQuery.query("salecase_grid")[0].getSelectionModel().getSelection()[0].get("number");
        var view = Ext.widget('todo_form').show();
        //        view.down('[name=source]', false).setValue(salecase_number);
    },

    markThisAsRead: function(table, td, cellIndex, record) {
        var td_inner = td.innerHTML;
        if (td_inner.indexOf("<a href=") != -1 && td_inner.indexOf("filterStr") != -1) {
            //如果点击的这一行有一个“外tag链接”，则点完算已读
            Ext.Ajax.request({
                url: 'todos/mark_as_read',
                params: {
                    todo_ids: record["data"]["id"]
                },
                success: function() {
                    Ext.getStore('GridTodos').load();
                }
            });
        }
    },

    markAsRead: function(button) {
        var grid = button.up('grid');
        var selected_todos = Ext.Array.pluck(Ext.Array.pluck(grid.getSelectedItems(), 'data'), 'id');
        //        console.log(selected);
        Ext.Ajax.request({
            url: 'todos/mark_as_read',
            params: {
                todo_ids: selected_todos.join("|")
            },
            success: function() {
                Ext.getStore('GridTodos').load();
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
                url: "todos/save_todo",
                submitEmptyText: false,
                success: function(the_form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridTodos').load();
                }
            });
        }
    }
});