class DictionariesController < ApplicationController
    def dictionary_list
        dictionaries = Dictionary.where(true)

        respond_to do |format|
            format.json {
                render :json => {
                    :dictionaries => dictionaries.map{|p| p.for_list_json}
                }
            }
        end
    end
end
