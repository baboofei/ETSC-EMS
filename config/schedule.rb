# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

#以下是可以用的
set :environment, :development
set :output, File.join(Whenever.path, 'log', 'whenever.log')

#every 10.minutes do
#    rake "terry:mail_test"
#    #command 'echo date111 +"%T"'
#end
#每周日，0点到23点，每隔30分钟查询一次
every :sunday, :at => ('00'..'23').to_a.collect {|x| ["#{x}:00","#{x}:30"]}.flatten do
    rake "terry:send_salelog_mail"
end

#每个月2号每隔30分钟查询一次
every '0,30 0-23 2 * *' do
    rake "terry:send_sales_contract_mail"
end

# 每个月1号凌晨4点执行
every '0 4 1 * *' do
    rake "terry:send_business_workload_mail"
end
# 每个月1号凌晨3点执行
every '0 3 1 * *' do
    rake "terry:send_new_customer_detail_mail"
end

# 每周一凌晨3点执行，但程序内部写上了判断单双周
every :monday, :at => ['03:00'] do
    rake "terry:send_p_inquire_updating_mail"
end
every :monday, :at => ['03:10'] do
    rake "terry:send_m_inquire_updating_mail"
end
every :monday, :at => ['03:20'] do
    rake "terry:send_vendor_unit_be_recommended_status_mail"
end
every :monday, :at => ['03:30'] do
    rake "terry:send_quoted_vendor_unit_no_contract_mail"
end
every :monday, :at => ['03:40'] do
    rake "terry:send_quoted_vendor_unit_pre_contract_mail"
end
every :monday, :at => ['03:50'] do
    rake "terry:send_contracted_vendor_unit_no_order_mail"
end

every 1.days, :at => ['00:00'] do
    rake "terry:sync_exchange_rate"
end
