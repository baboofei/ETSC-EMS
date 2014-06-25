class CreateWarrantyTerms < ActiveRecord::Migration
    def change
        create_table :warranty_terms do |t|
            t.string :name

            t.timestamps
        end
    end
end
