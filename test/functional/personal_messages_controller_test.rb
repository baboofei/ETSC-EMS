require 'test_helper'

class PersonalMessagesControllerTest < ActionController::TestCase
  test "should get get_grid_personal_messages" do
    get :get_grid_personal_messages
    assert_response :success
  end

end
