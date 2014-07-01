Ext.define('EIM.view.calendar.Panel', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.calendar_panel',

    requires: [
        'Extensible.calendar.data.MemoryEventStore',
        'Extensible.calendar.gadget.CalendarListPanel',
        'Extensible.calendar.CalendarPanel'/*,
        'Extensible.example.calendar.data.Events'*/
    ],

    //好像不能MVC，只好这样先写着了
    store: Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'colors/get_colors/list.json',
            noCache: false,

            reader: {
                type: 'json',
                root: 'colors'
            }
        }
    }),
    eventStore: Ext.create('Extensible.calendar.data.EventStore', {
        autoLoad: true,
        proxy: {
            type: 'rest',
            url: 'calendars/rest_calendar',
//            url: 'calendars/get_calendars/list.json',
//            noCache: false,

            reader: {
                type: 'json',
                root: 'calendars'
            },

            writer: {
                type: 'json',
                nameProperty: 'mapping'
            },

            listeners: {
                exception: function(proxy, response, operation, options){
                    var msg = response.message ? response.message : Ext.decode(response.responseText).message;
                    // ideally an app would provide a less intrusive message display
                    Ext.Msg.alert('Server Error', msg);
                }
            }
        },
        autoMsg: false
    }),

    initComponent: function() {
        //变通方法实现不同角色只读
        var all_elements = Ext.ComponentQuery.query('functree')[0].allElement['elements'];
        this.readOnly = all_elements['privilege_hidden_edit_calendar']['hidden'];
        this.layout = 'border';
        this.items = [
            {
                region: 'west',
                width: 179,
                border: false,
                layout: 'border',
                items: [
                    {
                        xtype: 'datepicker',
                        cls: 'ext-cal-nav-picker',
                        region: 'north'/*,
                        listeners: {
                            'select': {
                                fn: function(dp, dt) {
                                    Ext.getCmp('app-calendar').setStartDate(dt);
                                },
                                scope: this
                            }
                        }*/
                    },
                    {
                        xtype: 'extensible.calendarlist',
                        collapsible: false,
                        region: 'center',
                        store: this.store,
                        title: '姓名',
                        border: false,
                        width: 178
                    }
                ]
//            },
//            {
//                xtype: 'hidden',
//                hidden: true,
//                id: 'privilege_hidden_edit_calendar'
            },
            {
                xtype : 'extensible.calendarpanel',
                region: 'center',
                enableEditDetails: false,
                readOnly: this.readOnly,
                eventStore: this.eventStore,
                calendarStore: this.store,
                title : '日程安排',
                name : 'extensible_calendarpanel',
                viewConfig: {
                    minEventDisplayMinutes: 30,
                    showTime: false
                },
                monthViewCfg: {
                    showHeader: true,
                    showWeekLinks: true,
                    showWeekNumbers: true
                }
            }
        ];

        this.callParent(arguments);
    }
});
