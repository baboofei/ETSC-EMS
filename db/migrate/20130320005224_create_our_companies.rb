class CreateOurCompanies < ActiveRecord::Migration
  def change
    create_table :our_companies do |t|
      t.string :name
      t.string :en_name
      t.string :addr
      t.string :en_addr
      t.string :phone
      t.string :fax
      t.string :site
      t.text :bank_info #银行信息，因为还挺复杂的，可能将来要拆成几个字段
      t.boolean :use_for_contract

      t.timestamps
    end
  end
end
