/**
 * 选择excel文件供导入的表单
 */
Ext.define('EIM.view.admin_inventory.ImportXlsForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_import_xls_form',

    title: '选择.xls文件',
    layout: 'fit',
    width: 400,
    border: 0,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                layout: 'fit',
                items: [
                    {
                        xtype: 'filefield',
                        bodyPadding: 4,
                        name: 'xls_file'
                    }
                ]
            }
        ];
//
        this.buttons = [{
            text: '上传',
            action: 'upload'
        }];

        this.callParent(arguments);
    }
});