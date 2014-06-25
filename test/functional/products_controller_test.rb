require 'test_helper'

class ProductsControllerTest < ActionController::TestCase
  test "should get get_combo_products" do
    get :get_combo_products
    assert_response :success
  end

end
