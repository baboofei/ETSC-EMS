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
#每周六，0点到23点，每隔10分钟查询一次
every :saturday, :at => ('00'..'23').to_a.collect {|x| ["#{x}:00","#{x}:10","#{x}:20","#{x}:30","#{x}:40","#{x}:50"]}.flatten do
    rake "terry:send_salelog_mail"
end