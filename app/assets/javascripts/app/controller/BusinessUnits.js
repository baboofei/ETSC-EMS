Ext.define('EIM.controller.BusinessUnits', {
    extend: 'Ext.app.Controller',

    stores: [
        'BusinessUnits',
        'GridBusinessUnits',
//        'dict.BusinessUnitSorts',
        'dict.Cities'
    ],
    models: [
        'BusinessUnit',
        'GridBusinessUnit',
//        'dict.BusinessUnitSort',
        'dict.City'
    ],

    views: [
        'business_unit.Grid',
        'business_unit.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'business_unit_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'business_unit_grid': {
//                render: this.loadBusinessUnits,
                itemdblclick: this.editBusinessUnit,
                selectionchange: this.selectionChange
            },
            'button[action=addBusinessUnit]': {
                click: this.addBusinessUnit
            },
            'business_unit_form button[action=save]': {
            	click: this.saveBusinessUnit
            }
        });
    },

    addBusinessUnit: function() {
        Ext.widget('business_unit_form').show();
    },
    
    saveBusinessUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "business_units/save_business_unit",
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
                                var business_contact_combo_array = Ext.ComponentQuery.query("expandable_business_contact_combo");
                                if(business_contact_combo_array.length > 0) {
                                    Ext.Array.each(business_contact_combo_array, function(item) {
                                        if(item.up('form') === target_combo.up('form')) {
                                            item.down('combo', false).getStore().getProxy().setExtraParam('business_unit_id', msg['id'])
                                        }
                                    });
                                }
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridBusinessUnits').load();
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

    loadBusinessUnits: function() {
        Ext.getStore("BusinessUnits").load();
//        Ext.getStore("dict.Cities").load();
    },

    editBusinessUnit: function() {
        var record = this.getGrid().getSelectedItem();
        var view = Ext.widget('business_unit_form').show();
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