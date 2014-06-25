Ext.define('EIM.view.express_sheet.SearchForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.express_sheet_search_form',

    title: '搜索客户',
    layout: 'fit',
    height: 86,
    fieldDefaults: EIM_field_defaults,
//    width: 700,
//    height: 515,
//    maximizable: true,
//    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'container',
                layout: 'hbox',
                defaultType: 'combo',
                padding: '4 0',
                items: [
                    {
                        fieldLabel: "销售区域",
                        name: 'area',
                        store: 'Users',
                        displayField: 'name',
                        valueField: 'id',
                        editable: true
                    },
                    {
                        fieldLabel: '相关应用',
                        id: 'application',
                        store: 'Users',
                        displayField: 'name',
                        valueField: 'id'
                    },
                    {
                        xtype: 'combo',
                        name: 'instock_vendor_unit_id',
                        id: 'instock_vendor_unit_id',
                        fieldLabel: '<span style="color:red">*</span>供应商',
                        emptyText: '请输入并选择所属单位名称',
                        store: 'Users',
                        mode: 'remote',
                        displayField: 'name',
                        valueField: 'id',
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true,
                        //伪成输入框
                        listeners: {
                            select: function(combo, records, eOpts) {
                                Ext.data.StoreManager.lookup('ETSCVendor').getProxy().setExtraParam('vendor_unit_id', records[0]["data"]["id"])
                                Ext.getCmp('instock_vendor_id').reset();
                            }
                        }
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'search'
            }
        ];

        this.callParent(arguments);
    }
});