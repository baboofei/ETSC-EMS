require 'test_helper'

class CustomersSalecasesControllerTest < ActionController::TestCase
  test "should get save_customers_salecases" do
    get :save_customers_in_salecase
    assert_response :success
  end

end
