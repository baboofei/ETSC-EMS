require 'test_helper'

class SalecasesControllerTest < ActionController::TestCase
  test "should get get_grid_salecases" do
    get :get_grid_salecases
    assert_response :success
  end

end
