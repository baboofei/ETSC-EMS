Ext.define('EIM.view.todo.Grid', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.todo_grid',

    requires: 'Ext.ux.grid.FiltersFeature',

    title : '脑洞列表',
    store: 'GridTodos',
    iconCls: 'ttl_grid',
//    viewConfig: {enableTextSelection:true},
//    autoRender: true,

    initComponent: function() {
        //“库存级别”的字典项，供表格中显示和表头筛选用
        var updateTypeArray = filter_all_dict('update_type');

        this.columns = [
            {
                header: '所属模块',
                dataIndex: 'function_name',
                width: 100,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '内容',
                dataIndex: 'description',
                flex: 1,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '类别',
                dataIndex: 'category_name',
                width: 100,
                filter: {
                    type: 'list',
                    phpMode: true,
                    options: Ext.Array.map(updateTypeArray, function (record) {
                        return [record["value"], record["display"]];
                    })
                }
            },
            {
                header: '状态',
                dataIndex: 'state',
                width: 80,
                filter: {
                    type: 'string'
                }
            },
            {
                header: '生成日期',
                dataIndex: 'created_at',
                width: 90,
                sortable: true,
                filter: {
                    type: 'date',
                    dateFormat: 'Y-m-d'
                },
                renderer: Ext.util.Format.dateRenderer("Y-m-d")
            }
        ];

        this.addTodoButton = new Ext.Button({
            text: '新增脑洞',
            action: 'addTodo',
            iconCls: 'btn_add'
        });

        this.pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            border: 0,
            minWidth: 380
        });

        this.features = [
            {
                ftype: 'filters',
                encode: true
            }
        ];
        this.bbar = [this.addTodoButton, '-', this.pagingToolbar];

        this.callParent(arguments);
    },

    getSelectedItem: function() {
        return this.getSelectionModel().getSelection()[0];
    }
});
