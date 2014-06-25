/**
 * “出库”的表单
 */
Ext.define('EIM.view.admin_inventory.OutStockForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_out_stock_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '出库',
    layout: 'fit',
    width: 400,
//    height: 205,
    border: 0,
    modal: true,

    initComponent: function() {
        var userArray = filter_all_user();
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
                        xtype: 'hidden',
                        name: 'out_stock_type',
                        hidden: true
                    },
                    {
                        xtype: 'boxselect',
                        fieldLabel: '选择物品',
                        name: 'outstock_numbers',
                        store: Ext.create('Ext.data.Store', {
                            model: 'EIM.model.dict.Member',
                            proxy:  'memory'
                        }),
                        queryMode: 'local',
                        height: 80,
                        displayField: 'name',
                        valueField: 'id',
                        emptyText: '可多选',
                        editable: false,
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
                        xtype: 'datefield',
                        fieldLabel: '领用日期',
                        name: 'created_at',
                        value: new Date(),
                        allowBlank: false,
                        format: 'Y-m-d'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'save'
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