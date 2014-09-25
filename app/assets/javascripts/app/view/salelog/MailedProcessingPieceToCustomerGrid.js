Ext.define('EIM.view.salelog.MailedProcessingPieceToCustomerGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mailed_processing_piece_to_customer_grid',

    title: '已寄往客户加工件列表',
    store: 'MailedProcessingPieceToCustomers',
    iconCls: 'ttl_grid',

    initComponent: function() {
        //“快递公司”的字典项，供表格中显示和表头筛选用
        var deliveryArray = filter_all_dict('express', true);

        this.columns = [
            {
                header: '编号',
                dataIndex: 'id',
                width: 50
            },
            {
                header: '型号',
                dataIndex: 'model',
                flex: 1
            },
            {
                header: '数量',
                dataIndex: 'quantity',
                width: 50
            },
            {
                header: '收件人',
                dataIndex: 'customer_name',
                width: 50
            },
            {
                header: '快递公司',
                dataIndex: 'express_id',
                width: 80,
                renderer: function(value, metaData, record) {
                    var name = "";
                    Ext.Array.each(deliveryArray, function(item) {
                        if(item['value'] === record.get('express_id')) {
                            name = item['display'];
                        }
                    });
                    return name;
                }
            },
            {
                header: '快递单号',
                dataIndex: 'tracking_number',
                width: 80
            },
            {
                header: '发送邮件给',
                dataIndex: 'send_mail_target',
                width: 80,
                renderer: function(value) {
                    return (value === "1" ? "仅寄件人" : "收件人&寄件人");
                }
            },
            {
                header: '提醒时间',
                dataIndex: 'remind_at',
                width: 150,
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            }
        ];

        this.addMailedProcessingPieceToCustomerButton = Ext.create('Ext.Button', {
            text: '新增寄出加工件(往客户)',
            iconCls: 'btn_add',
            action: 'addMailProcessingPieceToCustomer'
        });
        this.editMailedProcessingPieceToCustomerButton = Ext.create('Ext.Button', {
            text: '修改寄出加工件(往客户)',
            iconCls: 'btn_edit',
            action: 'editMailProcessingPieceToCustomer',
            disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });
        this.bbar = [this.addMailedProcessingPieceToCustomerButton, this.editMailedProcessingPieceToCustomerButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});