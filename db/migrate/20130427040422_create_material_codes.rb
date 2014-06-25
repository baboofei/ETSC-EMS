class CreateMaterialCodes < ActiveRecord::Migration
    def change
        create_table :material_codes do |t|
            t.string :name
            t.string :code
            t.string :description, limit: 2000
            t.decimal :manager_audit_amount #领用时要给部门经理审核的金额
            t.decimal :vp_audit_amount #领用时要给副总审核的金额

            t.timestamps
        end
    end
end
