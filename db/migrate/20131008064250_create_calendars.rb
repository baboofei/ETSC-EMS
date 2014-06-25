class CreateCalendars < ActiveRecord::Migration
    def change
        create_table :calendars do |t|
            t.integer :color_id
            t.string :title
            t.datetime :start_at
            t.datetime :end_at
            t.text :comment
            t.decimal :remind #提醒时间，以分钟计
            t.boolean :is_all_day
            t.boolean :is_private

            t.timestamps
        end
    end
end
