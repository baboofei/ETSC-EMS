module ApplicationHelper
  def get_resource_size(url)
    file = "#{Rails.root}/"+url
    size = File.size?(file)
    if(size.class == Fixnum and size != 0)
      return size_by_k_or_m(size)
    end
  end
end
