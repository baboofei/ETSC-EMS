Ext.define('EIM.controller.PopUnits', {
    extend: 'Ext.app.Controller',

    stores: [
        'dict.Cities',
        'GridPopUnits'
    ],
    models: [
        'dict.City',
        'GridPopUnit'
    ],

    views: [
        'pop_unit.Grid',
        'pop_unit.Form'
    ],

    refs: [
        {
            ref: 'grid',
            selector: 'pop_unit_grid'
        }
    ],

    init: function() {
        var me = this;
        me.control({
            'pop_unit_grid': {
                itemdblclick: this.editPopUnit,
                selectionchange: this.selectionChange
            },
            'pop_unit_grid button[action=addPopUnit]': {
                click: this.addPopUnit
            },
            'pop_unit_form button[action=save]': {
                click: this.savePopUnit
            }
        });
    },

    addPopUnit: function() {
        Ext.widget('pop_unit_form').show();
    },

    savePopUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "pop_units/save_pop_unit",
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if(!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        var text = response.request.options.params.name;
                        target_combo.store.load({
                            params: {
                                query: text
                            },
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                                //如果有带加号的客户选择组件，则为其加一个过滤参数
                                var pop_combo_array = Ext.ComponentQuery.query("expandable_pop_combo");
                                if(pop_combo_array.length > 0) {
                                    Ext.Array.each(pop_combo_array, function(item) {
                                        if(item.up('form') === target_combo.up('form')) {
                                            item.down('combo', false).getStore().getProxy().setExtraParam('pop_unit_id', msg['id'])
                                        }
                                    });
                                }
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPopUnits').load();
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

    loadPopUnits: function() {
        //        Ext.getStore("PopUnits").load();
        //        Ext.getStore("dict.Cities").load();
    },

    editPopUnit: function() {
        var record = this.getGrid().getSelectedPopUnit();
        var view = Ext.widget('pop_unit_form').show();
        view.down('form', false).loadRecord(record);
        //给combo做一个假的store以正确显示值
        var city_field = view.down('[name=city_id]', false);
        city_field.getStore().loadData([
            [record.get('city_id'), record.get('city>name')]
        ]);
        city_field.setValue(record.get('city_id'));
    },

    selectionChange: function() {

    }
});