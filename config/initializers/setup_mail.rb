#ActionMailer::Base.smtp_settings = {
#    :address              => "smtp.gmail.com",
#    :port                 => 587,
#    :domain               => 'gmail.com',
#    :user_name            => 'hexawing',
#    :password             => 'sh0ubuliao',
#    :authentication       => 'plain',
#    :enable_starttls_auto => true
#}
##以上为gmail邮箱，可用

#ActionMailer::Base.smtp_settings = {
#    :address              => "smtp.qq.com",
#    :port                 => 25,
#    :domain               => "qq.com",
#    :user_name            => "etsc",
#    :password             => "etsclaser@1997",
#    :authentication       => "plain",
#    :enable_starttls_auto => false
#}
##以上为公司QQ邮箱，可用

#ActionMailer::Base.smtp_settings = {
#    :address              => "smtp.qq.com",
#    :port                 => 25,
#    :domain               => "qq.com",
#    :user_name            => "1163726690",
#    :password             => "linli7868581",
#    :authentication       => "plain",
#    :enable_starttls_auto => false
#}
##以上为商务QQ邮箱，可用

#ActionMailer::Base.smtp_settings = {
#    :address              => "smtp.qq.com",
#    :port                 => 25,
#    :domain               => "qq.com",
#    :user_name            => "hexawing",
#    :password             => "mimashi87807133",
#    :authentication       => "plain"
#}
##以上为私人QQ邮箱，可用

ActionMailer::Base.smtp_settings = {
    :address              => "smtpcom.263xmail.com",
    :port                 => 25,
    :domain               => "263.net",
    :user_name            => "admin@etsc-tech.com",
    :password             => "1 2 3 *#)^#",
    :authentication       => "login"
#,
#    :enable_starttls_auto => false
}
ActionMailer::Base.raise_delivery_errors = true
#以上为263企业邮箱，可用

#ActionMailer::Base.smtp_settings = {
#    :address              => "smtp.163.com",
#    :port                 => 25,
#    :domain               => "163.com",
#    :user_name            => "hexawing",
#    :password             => "sh0ubuliao",
#    :authentication       => "plain",
#    :enable_starttls_auto => true
#}
#以上为163信箱的，可用
