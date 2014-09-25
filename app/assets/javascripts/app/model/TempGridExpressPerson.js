Ext.define('EIM.model.TempGridExpressPerson', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'receiver_id',
            type: 'int'
        },
        {
            name: 'receiver_name',
            type: 'string'
        },
        {
            name: 'tracking_number',
            type: 'string'
        },
        {
            name: 'send_mail_target',
            type: 'string'
        },
        {
            name: 'remind_at',
            type: 'date'
        }
    ]
});