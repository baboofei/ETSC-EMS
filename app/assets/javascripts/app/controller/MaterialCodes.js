Ext.define('EIM.controller.MaterialCodes', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridMaterialCodes'
    ],
    models: [
        'GridMaterialCode'
    ],

    views: [
        'material_code.Grid',
        'material_code.Form'/*,
        'etscux.ExpandableMaterialCodeCombo'*/
    ],

    refs: [{
        ref: 'grid',
        selector: 'material_code_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'material_code_grid': {
//                render: this.loadCustomerUnits,
                itemdblclick: this.editMaterialCode
            },
            'material_code_grid button[action=addMaterialCode]': {
                click: this.addMaterialCode
            },
            'material_code_form combo[name=name]': {
                change: function(combo, newValue) {
                    var actually_name_array = Ext.Array.pluck(Ext.Array.pluck(combo.getStore().data.items, 'data'), 'actually_name');
                    var id_array = Ext.Array.pluck(Ext.Array.pluck(combo.getStore().data.items, 'data'), 'id');
////                    console.log(combo.getStore());
////                    console.log(actually_name_array);
////                    console.log(combo.getStore().getProxy().extraParams['returnEmpty']);
////                    console.log(newValue);
//                    console.log(actually_name_array.indexOf(newValue));
//                    console.log(id_array.indexOf(newValue));
                    //三个条件如下。都满足则说明是新写的一个名称，给生成一个编码
                    var id_field = combo.up('form').down('[name=id]', false);
                    var code_field = combo.up('form').down('[name=code]', false);
                    if(id_field.getValue() === "") {
                        //1.“新增”的时候
                        if(typeof(newValue) === "string" && newValue.match(/^.*?-.*?-.*?-.*?$/) != null) {
                            //2.RawValue“合法”
                            if(actually_name_array.indexOf(newValue) === -1 && id_array.indexOf(newValue) === -1) {
                                //3.两个index都是-1
                                Ext.Ajax.request({
                                    url: 'material_codes/ask_for_new_code',
                                    params: {
                                        name: newValue
                                    },
                                    success: function(response) {
                                        var msg = Ext.decode(response.responseText);
                                        code_field.setValue(msg.new_code_number);
                                    },
                                    failure: function() {
                                    }
                                });
                            }
                        }
                    }
                }
            },
            'material_code_form button[action=save]': {
            	click: this.saveMaterialCode
            },
            'material_code_mini_add_form button[action=save]': {
                click: this.miniSaveMaterialCode
            }   
        });
    },

    addMaterialCode: function() {
        Ext.widget('material_code_form').show();
    },

    saveMaterialCode: function(button) {
//    	console.log("aa");
        var win = button.up('window');
        var form = win.down('form', false)
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "material_codes/save_material_code",
                submitEmptyText:false,
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
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridMaterialCodes').load();
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
//            win.close();
        }
    },

//    loadCustomerUnits: function() {
//        Ext.getStore("CustomerUnits").load();
////        Ext.getStore("dict.Cities").load();
//    },
//
    editMaterialCode: function() {
        var record = this.getGrid().getSelectedItem();
        var view = Ext.widget('material_code_form').show();
        view.down('form', false).loadRecord(record);
    },

    miniSaveMaterialCode: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            //防双击
            button.disable();

            form.form.submit({
                url:'material_codes/save_material_code_mini',
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