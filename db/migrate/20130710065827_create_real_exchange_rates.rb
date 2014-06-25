class CreateRealExchangeRates < ActiveRecord::Migration
    def change
        create_table :real_exchange_rates do |t|
            t.date :date
            t.decimal :eur, :precision => 12, :scale => 2
            t.decimal :gbp, :precision => 12, :scale => 2
            t.decimal :usd, :precision => 12, :scale => 2
            t.decimal :cad, :precision => 12, :scale => 2
            t.decimal :jpy, :precision => 12, :scale => 2
            t.decimal :hkd, :precision => 12, :scale => 2
            t.decimal :ntd, :precision => 12, :scale => 2
        end
    end
end
