require 'test_helper'

class StoresControllerTest < ActionController::TestCase
  test "should get store_privileges" do
    get :store_privileges
    assert_response :success
  end

end
