# encoding: utf-8
module ApplicationHelper
    def get_resource_size(url)
        file = "#{Rails.root}/"+url
        size = File.size?(file)
        if (size.class == Fixnum and size != 0)
            return size_by_k_or_m(size)
        end
    end

    # Based on https://gist.github.com/1205828, in turn based on https://gist.github.com/1182136
    #class ETSCFoundationRenderer < ::WillPaginate::ActionView::LinkRenderer
    #    protected
    #
    #    def html_container(html)
    #        tag :div, tag(:ul, html, :class => 'pagination'), container_attributes
    #    end
    #
    #    def page_number(page)
    #        tag :li, link(page, page, :rel => rel_value(page)), :class => ('current' if page == current_page)
    #    end
    #
    #    def gap
    #        tag :li, link(super, '#'), :class => 'disabled'
    #    end
    #
    #    def previous_or_next_page(page, text, classname)
    #        tag :li, link(text, page || '#'), :class => [classname[0..3], classname, ('disabled' unless page)].join(' ')
    #    end
    #end

    def page_navigation_links(pages)
        will_paginate(pages,
                      :class => 'pagination-centered',
                      :inner_window => 1,
                      :outer_window => 0,
                      :renderer => ETSCFoundationRenderer,
                      :previous_label => '上一页'.html_safe,
                      :next_label => '下一页'.html_safe
        )
    end

    #def paginate(collection, params= {})
    #    ##引用RemoteLinkPaginationHelper
    #    will_paginate collection, params.merge(:renderer => RemoteLinkPaginationHelper::LinkRenderer)
    #end

    #def will_paginate_remote(paginator, options={})
    #    update = options.delete(:update)
    #    url = options.delete(:url)
    #    params = options.delete(:params)
    #    str = will_paginate(paginator, options)
    #    if str != nil
    #        str.gsub(/href="(.*?)"/) do
    #            #binding.pry
    #            "href=\"javascript:void(0);\" onclick=\"$.post('/site/ajax_filter');\""
    #
    #            #"href=\"#\" onclick=\"new Ajax.Updater('" + update + "', '" +
    #            #    (url ? url +$1.to_s.sub(/[^\?]*/, '') + params.to_s : $1.to_s + params.to_s) +
    #            #    "', {asynchronous:true, evalScripts:true, method:'get'}); return false;\""
    #        end
    #    end
    #end

end