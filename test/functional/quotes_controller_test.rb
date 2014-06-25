require 'test_helper'

class QuotesControllerTest < ActionController::TestCase
  test "should get get_grid_quotes" do
    get :get_grid_quotes
    assert_response :success
  end

end
