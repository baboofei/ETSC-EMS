Ext.define('EIM.view.contract.ReceivableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_receivable_grid',

    title: '应收款情况',
    store: 'Receivables',
    iconCls: 'ttl_grid',

    initComponent: function() {

        this.columns = [
            {
                header: '应收款时间',
                width: 100,
                sortable: false,
                dataIndex: 'expected_receive_at',
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '应收金额',
                flex: 1,
                sortable: false,
                dataIndex: 'amount'
            },
            {
                header: '修改原因',
                hidden: true,
                sortable: false,
                dataIndex: 'reason'
            }
        ];

        this.addReceivableButton = Ext.create('Ext.Button', {
            text: '新增应收款项',
            iconCls: 'btn_add',
            id: 'privilege_button_add_receivable',
            allowPrivilege: true,
            action: 'addReceivable'
        });
        this.editReceivableButton = Ext.create('Ext.Button', {
            text: '修改应收款项',
            iconCls: 'btn_edit',
            action: 'editReceivable',
            id: 'privilege_button_edit_receivable',
            allowPrivilege: true,
            disabled: true
        });
        this.deleteReceivableButton = Ext.create('Ext.Button', {
            text: '删除应收款项',
            iconCls: 'btn_delete',
            action: 'deleteReceivable',
            id: 'privilege_button_delete_receivable',
            allowPrivilege: true,
            disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.addReceivableButton, this.editReceivableButton, this.deleteReceivableButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});