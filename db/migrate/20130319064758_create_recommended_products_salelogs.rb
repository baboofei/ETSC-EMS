class CreateRecommendedProductsSalelogs < ActiveRecord::Migration
  def change
    create_table :recommended_products_salelogs do |t|
      t.integer :product_id
      t.integer :vendor_unit_id
      t.integer :salelog_id
      t.string :customer_requirement #客户需求

      t.timestamps
    end
  end
end
