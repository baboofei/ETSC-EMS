class CreatePersonalMessages < ActiveRecord::Migration
    def change
        create_table :personal_messages do |t|
            t.integer :sender_user_id
            t.integer :receiver_user_id
            t.text :content
            t.string :sn #内部编号，用于定点设置已读
            t.datetime :send_at
            t.datetime :read_at

            t.timestamps
        end
    end
end
