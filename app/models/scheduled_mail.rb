class ScheduledMail < ActiveRecord::Base
  attr_accessible :mail_type, :mailed_at, :receiver, :sender
end
