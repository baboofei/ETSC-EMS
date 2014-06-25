require 'test_helper'

class OurCompaniesControllerTest < ActionController::TestCase
  test "should get our_company_list" do
    get :our_company_list
    assert_response :success
  end

end
