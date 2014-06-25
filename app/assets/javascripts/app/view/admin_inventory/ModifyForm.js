/**
 * “修改信息”的表单
 */
Ext.define('EIM.view.admin_inventory.ModifyForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_modify_form',

    title: '修改信息',
    layout: 'fit',
    width: 400,
//    height: 174,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '库管类别',
                        name: 'inventory_type',
                        store: 'dict.MaterialCodes',
                        mode: 'remote',
                        displayField: 'name',
                        valueField: 'id',
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true,
                        allowBlank: false,
                        forceSelection: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '品名',
                        name: 'name',
                        allowBlank: false,
                        store: 'ComboAdminInventoryNames',
                        displayField: 'name',
                        valueField: 'id',
                        mode: 'remote',
                        emptyText: '请输入品名，注意有提示',
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true //伪成输入框
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '型号',
                        name: 'model',
//                        allowBlank: false,
                        store: 'ComboAdminInventoryModels',
                        displayField: 'name',
                        valueField: 'id',
                        mode: 'remote',
                        emptyText: '请输入型号，注意有提示',
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true //伪成输入框
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '描述',
                        name: 'description',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '库存级别',
                        name: 'inventory_level',
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('stock_inventory_level'),
                            model: 'EIM.model.AllDict',
                            proxy: 'memory'
                        }),
                        displayField: 'display',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '序列号',
                        name: 'sn',
                        emptyText: '请输入序列号，多个序列号用西文逗号“,”分开',
                        validator: function(){
                            if(this.invalidMsg === '') {
                                this.clearInvalid();
                                return true;
                            } else {
                                return this.invalidMsg;
                            }
                        },
                        invalidMsg: ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '修改理由',
                        name: 'comment',
                        allowBlank: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save_modify'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});