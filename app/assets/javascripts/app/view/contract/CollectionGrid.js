Ext.define('EIM.view.contract.CollectionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.contract_collection_grid',

    title: '实收款情况',
    store: 'Collections',
    iconCls: 'ttl_grid',

    initComponent: function() {

        this.columns = [
            {
                header: '实收款时间',
                width: 100,
                sortable: false,
                dataIndex: 'received_at',
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            },
            {
                header: '实收金额',
                flex: 1,
                sortable: false,
                dataIndex: 'amount'
            },
            {
                header: '补偿金额',
                dataIndex: 'compensation_amount',
                width: 150,
                sortable: false
            },
            {
                header: '修改原因',
                hidden: true,
                sortable: false,
                dataIndex: 'reason'
            }
        ];

        this.addCollectionButton = Ext.create('Ext.Button', {
            text: '新增实收款项',
            iconCls: 'btn_add',
            id: 'privilege_button_add_collection',
            allowPrivilege: true,
            action: 'addCollection'
        });
        this.editCollectionButton = Ext.create('Ext.Button', {
            text: '修改实收款项',
            iconCls: 'btn_edit',
            action: 'editCollection',
            id: 'privilege_button_edit_collection',
            allowPrivilege: true,
            disabled: true
        });
        this.deleteCollectionButton = Ext.create('Ext.Button', {
            text: '删除应收款项',
            iconCls: 'btn_delete',
            action: 'deleteCollection',
            id: 'privilege_button_delete_collection',
            allowPrivilege: true,
            disabled: true
        });
        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.bbar = [this.addCollectionButton, this.editCollectionButton, this.deleteCollectionButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});