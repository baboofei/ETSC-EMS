require 'test_helper'

class VendorUnitsControllerTest < ActionController::TestCase
  test "should get get_combo_vendor_units" do
    get :get_combo_vendor_units
    assert_response :success
  end

end
