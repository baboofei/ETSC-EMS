/**
 * 选择供方联系人信息的表单
 */
Ext.define('EIM.view.admin_inventory.SelectVendorForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_select_vendor_form',

    title: '选择供方联系人',
    layout: 'fit',
    width: 600,
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
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 5',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                xtype: 'expandable_vendor_unit_combo',
                                fieldLabel: '供应商',
                                emptyText: '请输入并选择供应商名称',
                                flex: 1
                            },
                            {
                                xtype: 'expandable_vendor_combo',
                                flex: 1
                            }
                        ]
                    }
                ]
            }
        ];
//
        this.buttons = [{
            text: '确定',
            action: 'save'
        }];

        this.callParent(arguments);
    }
});