# encoding: utf-8

# text.rb : Implements PDF text primitives
#
# Copyright May 2008, Gregory Brown. All Rights Reserved.
#
# This is free software. Please see the LICENSE and COPYING files for details.
require "prawn/core/text"
require "prawn/core/text/wrap"
require "prawn/text/box"
require "prawn/text/formatted"
require "zlib"

module Prawn
  module Text

    include Prawn::Core::Text
    include Prawn::Text::Formatted

    # If you want text to flow onto a new page or between columns, this is the
    # method to use. If, instead, if you want to place bounded text outside of
    # the flow of a document (for captions, labels, charts, etc.), use Text::Box
    # or its convenience method text_box.
    # 
    # Draws text on the page. Prawn attempts to wrap the text to fit within your
    # current bounding box (or margin_box if no bounding box is being used).
    # Text will flow onto the next page when it reaches the bottom of the
    # bounding box. Text wrap in Prawn does not re-flow linebreaks, so if you
    # want fully automated text wrapping, be sure to remove newlines before
    # attempting to draw your string.
    #
    # == Examples
    #
    #   pdf.text "Will be wrapped when it hits the edge of your bounding box"
    #   pdf.text "This will be centered", :align => :center
    #   pdf.text "This will be right aligned", :align => :right
    #   pdf.text "This <i>includes <b>inline</b></i> <font size='24'>" +
    #            "formatting</font>", :inline_format => true
    #
    # If your font contains kerning pair data that Prawn can parse, the
    # text will be kerned by default. You can disable kerning by including
    # a false <tt>:kerning</tt> option. If you want to disable kerning on an
    # entire document, set default_kerning = false for that document
    #
    # === Text Positioning Details
    # 
    # The text is positioned at font.ascender below the baseline,
    # making it easy to use this method within bounding boxes and spans.
    #
    # == Encoding
    #
    # Note that strings passed to this function should be encoded as UTF-8.
    # If you get unexpected characters appearing in your rendered document, 
    # check this.
    #
    # If the current font is a built-in one, although the string must be
    # encoded as UTF-8, only characters that are available in WinAnsi
    # are allowed.
    #
    # If an empty box is rendered to your PDF instead of the character you 
    # wanted it usually means the current font doesn't include that character.
    #
    # == Options (default values marked in [])
    #
    # <tt>:inline_format</tt>::
    #      <tt>boolean</tt>. If true, then the string parameter is interpreted
    #      as a HTML-esque string that recognizes the following tags:
    #      <tt>\<b></b></tt>:: bold
    #      <tt>\<i></i></tt>:: italic
    #      <tt>\<u></u></tt>:: underline
    #      <tt>\<strikethrough></strikethrough></tt>:: strikethrough
    #      <tt>\<sub></sub></tt>:: subscript
    #      <tt>\<sup></sup></tt>:: superscript
    #      <tt>\<font></font></tt>::
    #          with the following attributes (using double or single quotes)
    #            <tt>size="24"</tt>::
    #                attribute for setting size
    #            <tt>name="Helvetica"</tt>::
    #                attribute for setting the font. The font name must be an
    #                AFM font with the desired faces or must be a font that is
    #                already registered using Prawn::Document#font_families
    #      <tt>\<color></color></tt>::
    #          with the following attributes
    #            <tt>rgb="ffffff" or rgb="#ffffff"</tt>::
    #            <tt>c="100" m="100" y="100" k="100"</tt>::
    #      <tt>\<link></link></tt>::
    #          with the following attributes
    #            <tt>href="http://example.com"</tt>:: an external link
    #            <tt>anchor="ToC"</tt>::
    #                where the value of the anchor attribute is the name of a
    #                destination that has already been or will be registered
    #                using Prawn::Core::Destinations#add_dest. A clickable link
    #                will be created to that destination. 
    #          Note that you must explicitly underline and color using the
    #          appropriate tags if you which to draw attention to the link
    #
    # <tt>:kerning</tt>:: <tt>boolean</tt>. Whether or not to use kerning (if it
    #                     is available with the current font)
    #                     [value of default_kerning?]
    # <tt>:size</tt>:: <tt>number</tt>. The font size to use. [current font
    #                  size]
    # <tt>:style</tt>:: The style to use. The requested style must be part of
    #                   the current font familly. [current style]
    # <tt>:indent_paragraphs</tt>:: <tt>number</tt>. The amount to indent the
    #                               first line of each paragraph. Omit this
    #                               option if you do not want indenting
    # <tt>:align</tt>:: <tt>:left</tt>, <tt>:center</tt>, <tt>:right</tt>, or
    #                   <tt>:justify</tt> Alignment within the bounding box [:left]
    # <tt>:valign</tt>:: <tt>:top</tt>, <tt>:center</tt>, or <tt>:bottom</tt>.
    #                    Vertical alignment within the bounding box [:top]
    # <tt>:leading</tt>:: <tt>number</tt>. Additional space between lines [0]
    # <tt>:final_gap</tt>:: <tt>boolean</tt>. If true, then the space between
    #                       each line is included below the last line;
    #                       otherwise, document.y is placed just below the
    #                       descender of the last line printed [true]
    #                        
    # == Exceptions
    #
    # Raises <tt>ArgumentError</tt> if <tt>:at</tt> option included
    #
    # Raises <tt>Prawn::Errrors::CannotFit</tt> if not wide enough to print
    # any text
    #
    def text(string, options={})
      # we modify the options. don't change the user's hash
      options = options.dup

      if options[:inline_format]
        options.delete(:inline_format)
        array = Text::Formatted::Parser.to_array(string)
        formatted_text(array, options)
        return
      end

      inspect_options_for_text(options)

      if @indent_paragraphs
        string.split("\n").each do |paragraph|
          options[:skip_encoding] = false
          remaining_text = draw_indented_line(paragraph, options)
          options[:skip_encoding] = true
          if remaining_text == paragraph
            # we were too close to the bottom of the page to print even one line
            @bounding_box.move_past_bottom
            remaining_text = draw_indented_line(paragraph, options)
          end
          remaining_text = fill_text_box(remaining_text, options)
          draw_remaining_text_on_new_pages(remaining_text, options)
        end
      else
        remaining_text = fill_text_box(string, options)
        options[:skip_encoding] = true
        draw_remaining_text_on_new_pages(remaining_text, options)
      end
    end


    # Draws formatted text to the page.
    # Formatted text is comprised of an array of hashes, where each hash defines
    # text and format information. See Text::Formatted#formatted_text_box for
    # more information on the structure of this array
    #
    # == Example
    #
    #   text([{ :text => "hello" },
    #         { :text => "world",
    #           :size => 24,
    #           :style => [:bold, :italic] }])
    #
    # == Options
    #
    # Accepts the same options as #text
    #
    # == Exceptions
    #
    # Same as for #text
    #
    def formatted_text(array, options={})
      # we modify the options. don't change the user's hash
      options = options.dup

      inspect_options_for_text(options)

      if @indent_paragraphs
        Text::Formatted::Parser.array_paragraphs(array).each do |paragraph|
          options[:skip_encoding] = false
          remaining_text = draw_indented_formatted_line(paragraph, options)
          options[:skip_encoding] = true
          if remaining_text == paragraph
            # we were too close to the bottom of the page to print even one line
            @bounding_box.move_past_bottom
            remaining_text = draw_indented_formatted_line(paragraph, options)
          end
          remaining_text = fill_formatted_text_box(remaining_text, options)
          draw_remaining_formatted_text_on_new_pages(remaining_text, options)
        end
      else
        remaining_text = fill_formatted_text_box(array, options)
        options[:skip_encoding] = true
        draw_remaining_formatted_text_on_new_pages(remaining_text, options)
      end
    end

    # Draws text on the page, beginning at the point specified by the :at option
    # the string is assumed to be pre-formatted to properly fit the page.
    # 
    #   pdf.draw_text "Hello World", :at => [100,100]
    #   pdf.draw_text "Goodbye World", :at => [50,50], :size => 16
    #
    # If your font contains kerning pair data that Prawn can parse, the
    # text will be kerned by default. You can disable kerning by including
    # a false <tt>:kerning</tt> option. If you want to disable kerning on an
    # entire document, set default_kerning = false for that document
    #
    # === Text Positioning Details:
    #
    # Prawn will position your text by the left-most edge of its baseline, and
    # flow along a single line.  (This means that :align will not work)
    #
    # == Rotation
    #
    # Text can be rotated before it is placed on the canvas by specifying the
    # <tt>:rotate</tt> option with a given angle. Rotation occurs counter-clockwise.
    #
    # == Encoding
    #
    # Note that strings passed to this function should be encoded as UTF-8.
    # If you get unexpected characters appearing in your rendered document, 
    # check this.
    #
    # If the current font is a built-in one, although the string must be
    # encoded as UTF-8, only characters that are available in WinAnsi
    # are allowed.
    #
    # If an empty box is rendered to your PDF instead of the character you 
    # wanted it usually means the current font doesn't include that character.
    #
    # == Options (default values marked in [])
    #
    # <tt>:at</tt>:: <tt>[x, y]</tt>(required). The position at which to start the text
    # <tt>:kerning</tt>:: <tt>boolean</tt>. Whether or not to use kerning (if it
    #                     is available with the current font)
    #                     [value of default_kerning?]
    # <tt>:size</tt>:: <tt>number</tt>. The font size to use. [current font
    #                  size]
    # <tt>:style</tt>:: The style to use. The requested style must be part of
    #                   the current font familly. [current style]
    #
    # <tt>:rotate</tt>:: <tt>number</tt>. The angle to which to rotate text
    #
    # == Exceptions
    #
    # Raises <tt>ArgumentError</tt> if <tt>:at</tt> option omitted
    #
    # Raises <tt>ArgumentError</tt> if <tt>:align</tt> option included
    #
    def draw_text(text, options)
      # we modify the options. don't change the user's hash
      options = options.dup
      inspect_options_for_draw_text(options)
      # dup because normalize_encoding changes the string
      text = text.to_s.dup
      save_font do
        process_text_options(options)
        font.normalize_encoding!(text) unless @skip_encoding
        font_size(options[:size]) { draw_text!(text, options) }
      end
    end

    # Gets height of text in PDF points.
    # Same options as #text, except as noted.
    # Not compatible with :indent_paragraphs option
    #
    # ==Example
    #
    #   height_of("hello\nworld")
    #
    # == Exceptions
    #
    # Raises <tt>NotImplementedError</tt> if <tt>:indent_paragraphs</tt>
    # option included
    #
    # Raises <tt>Prawn::Errrors::CannotFit</tt> if not wide enough to print
    # any text
    #
    def height_of(string, options={})
      if options[:indent_paragraphs]
        raise NotImplementedError, ":indent_paragraphs option not available" +
          "with height_of"
      end
      process_final_gap_option(options)
      box = Text::Box.new(string,
                          options.merge(:height   => 100000000,
                                        :document => self))
      printed = box.render(:dry_run => true)

      height = box.height - (box.line_height - box.ascender)
      height += box.line_height + box.leading - box.ascender if @final_gap
      height
    end

    # Gets height of formatted text in PDF points.
    # See documentation for #height_of.
    #
    # ==Example
    #
    #   height_of_formatted([{ :text => "hello" },
    #                        { :text => "world",
    #                          :size => 24,
    #                          :style => [:bold, :italic] }])
    #
    def height_of_formatted(array, options={})
      if options[:indent_paragraphs]
        raise NotImplementedError, ":indent_paragraphs option not available" +
          "with height_of"
      end
      process_final_gap_option(options)
      box = Text::Formatted::Box.new(array,
                          options.merge(:height   => 100000000,
                                        :document => self))
      printed = box.render(:dry_run => true)

      height = box.height - (box.line_height - box.ascender)
      height += box.line_height + box.leading - box.ascender if @final_gap
      height
    end

    private

    def draw_remaining_text_on_new_pages(remaining_text, options)
      while remaining_text.length > 0
        @bounding_box.move_past_bottom
        previous_remaining_text = remaining_text
        remaining_text = fill_text_box(remaining_text, options)
        break if remaining_text == previous_remaining_text
      end
    end

    def draw_indented_line(string, options)
      indent(@indent_paragraphs) do
        fill_text_box(string, options.dup.merge(:single_line => true))
      end
    end

    def fill_text_box(text, options)
      merge_text_box_positioning_options(options)

      box = Text::Box.new(text, options)
      remaining_text = box.render

      self.y -= box.height - (box.line_height - box.ascender)
      if @final_gap
        self.y -= box.line_height + box.leading - box.ascender
      end
      remaining_text
    end




    def draw_remaining_formatted_text_on_new_pages(remaining_text, options)
      while remaining_text.length > 0
        @bounding_box.move_past_bottom
        previous_remaining_text = remaining_text
        remaining_text = fill_formatted_text_box(remaining_text, options)
        break if remaining_text == previous_remaining_text
      end
    end

    def draw_indented_formatted_line(string, options)
      indent(@indent_paragraphs) do
        fill_formatted_text_box(string, options.dup.merge(:single_line => true))
      end
    end

    def fill_formatted_text_box(text, options)
      merge_text_box_positioning_options(options)
      box = Text::Formatted::Box.new(text, options)
      remaining_text = box.render

      self.y -= box.height - (box.line_height - box.ascender)
      if @final_gap
        self.y -= box.line_height + box.leading - box.ascender
      end
      remaining_text
    end



    def merge_text_box_positioning_options(options)
      bottom = @bounding_box.stretchy? ? @margin_box.absolute_bottom :
                                         @bounding_box.absolute_bottom

      options[:height] = y - bottom
      options[:width] = bounds.width
      options[:at] = [@bounding_box.left_side - @bounding_box.absolute_left,
                      y - @bounding_box.absolute_bottom]
    end

    def inspect_options_for_draw_text(options)
      if options[:at].nil?
        raise ArgumentError, "The :at option is required for draw_text"
      elsif options[:align]
        raise ArgumentError, "The :align option does not work with draw_text"
      end
      if options[:kerning].nil? then
        options[:kerning] = default_kerning?
      end
      valid_options = Prawn::Core::Text::VALID_OPTIONS + [:at, :rotate]
      Prawn.verify_options(valid_options, options)
    end

    def inspect_options_for_text(options)
      if options[:at]
        raise ArgumentError, ":at is no longer a valid option with text." +
                             "use draw_text or text_box instead"
      end
      process_final_gap_option(options)
      process_indent_paragraphs_option(options)
      options[:document] = self
    end

    def process_final_gap_option(options)
      @final_gap = options[:final_gap].nil? || options[:final_gap]
      options.delete(:final_gap)
    end

    def process_indent_paragraphs_option(options)
      @indent_paragraphs = options[:indent_paragraphs]
      options.delete(:indent_paragraphs)
    end

    def move_text_position(dy)
      bottom = @bounding_box.stretchy? ? @margin_box.absolute_bottom :
                                         @bounding_box.absolute_bottom

      @bounding_box.move_past_bottom if (y - dy) < bottom

      self.y -= dy
    end
  end
end
