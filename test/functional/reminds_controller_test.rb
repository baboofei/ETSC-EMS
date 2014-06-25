require 'test_helper'

class RemindsControllerTest < ActionController::TestCase
  test "should get get_grid_reminds" do
    get :get_grid_reminds
    assert_response :success
  end

end
