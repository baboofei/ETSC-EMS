Ext.define('EIM.model.FlowSheetReceivedEquipment', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'vendor_unit>name',
            type: 'string'
        },
        {
            name: 'product>model',
            type: 'string'
        },
        {
            name: 'sn',
            type: 'string'
        },
        {
            name: 'symptom',
            type: 'string'
        },
        {
            name: 'accepted_at',
            type: 'date'
        },
        {
            name: 'collect_account_number',
            type: 'string'
        },
        {
            name: 'is_in_warranty',
            type: 'boolean'
        },
        {
            name: 'is_packaged',
            type: 'boolean'
        },
        {
            name: 'is_return_factory',
            type: 'boolean'
        },
        {
            name: 'is_sent_back',
            type: 'boolean'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});