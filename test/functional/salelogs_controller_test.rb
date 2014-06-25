require 'test_helper'

class SalelogsControllerTest < ActionController::TestCase
  test "should get get_salelogs" do
    get :get_salelogs
    assert_response :success
  end

end
