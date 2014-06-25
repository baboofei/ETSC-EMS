# encoding: utf-8

require File.join(File.expand_path(File.dirname(__FILE__)), "spec_helper")

describe "Text::Formatted::Fragment#word_spacing=" do
  before(:each) do
    create_pdf
    format_state = { :styles => [:bold, :italic],
                     :color => nil,
                     :link => nil,
                     :anchor => nil,
                     :font => nil,
                     :size => nil }
    @fragment = Prawn::Text::Formatted::Fragment.new("hello world",
                                                     format_state,
                                                     @pdf)
    @fragment.width = 100
    @fragment.left = 50
    @fragment.baseline = 200
    @fragment.line_height = 27
    @fragment.descender = 7
    @fragment.ascender = 17
    @fragment.word_spacing = 10
  end
  
  it "should account for word_spacing in #width" do
    @fragment.width.should == 110
  end
  it "should account for word_spacing in #bounding_box" do
    target_box = [50, 193, 160, 217]
    @fragment.bounding_box.should == target_box
  end
  it "should account for word_spacing in #absolute_bounding_box" do
    target_box = [50, 193, 160, 217]
    target_box[0] += @pdf.bounds.absolute_left
    target_box[1] += @pdf.bounds.absolute_bottom
    target_box[2] += @pdf.bounds.absolute_left
    target_box[3] += @pdf.bounds.absolute_bottom
    @fragment.absolute_bounding_box.should == target_box
  end
  it "should account for word_spacing in #underline_points" do
    y = 198.75
    target_points = [[50, y], [160, y]]
    @fragment.underline_points.should == target_points
  end
  it "should account for word_spacing in #strikethrough_points" do
    y = 200 + @fragment.ascender * 0.3
    target_points = [[50, y], [160, y]]
    @fragment.strikethrough_points.should == target_points
  end
end

describe "Text::Formatted::Fragment" do
  before(:each) do
    create_pdf
    format_state = { :styles => [:bold, :italic],
                     :color => nil,
                     :link => nil,
                     :anchor => nil,
                     :font => nil,
                     :size => nil }
    @fragment = Prawn::Text::Formatted::Fragment.new("hello world",
                                                     format_state,
                                                     @pdf)
    @fragment.width = 100
    @fragment.left = 50
    @fragment.baseline = 200
    @fragment.line_height = 27
    @fragment.descender = 7
    @fragment.ascender = 17
  end
  
  describe "#width" do
    it "should return the width" do
      @fragment.width.should == 100
    end
  end

  describe "#styles" do
    it "should return the styles array" do
      @fragment.styles.should == [:bold, :italic]
    end
    it "should never return nil" do
      format_state = { :styles => nil,
                       :color => nil,
                       :link => nil,
                       :anchor => nil,
                       :font => nil,
                       :size => nil }
      fragment = Prawn::Text::Formatted::Fragment.new("hello world",
                                                      format_state,
                                                      @pdf)
      fragment.styles.should == []
    end
  end

  describe "#line_height" do
    it "should return the line_height" do
      @fragment.line_height.should == 27
    end
  end

  describe "#ascender" do
    it "should return the ascender" do
      @fragment.ascender.should == 17
    end
  end

  describe "#descender" do
    it "should return the descender" do
      @fragment.descender.should == 7
    end
  end

  describe "#y_offset" do
    it "should be zero" do
      @fragment.y_offset.should == 0
    end
  end

  describe "#bounding_box" do
    it "should return the bounding box surrounding the fragment" do
      target_box = [50, 193, 150, 217]
      @fragment.bounding_box.should == target_box
    end
  end

  describe "#absolute_bounding_box" do
    it "should return the bounding box surrounding the fragment" +
       " in absolute coordinates" do
      target_box = [50, 193, 150, 217]
        target_box[0] += @pdf.bounds.absolute_left
        target_box[1] += @pdf.bounds.absolute_bottom
        target_box[2] += @pdf.bounds.absolute_left
        target_box[3] += @pdf.bounds.absolute_bottom
      @fragment.absolute_bounding_box.should == target_box
    end
  end

  describe "#underline_points" do
    it "should define a line under the fragment" do
      y = 198.75
      target_points = [[50, y], [150, y]]
      @fragment.underline_points.should == target_points
    end
  end

  describe "#strikethrough_points" do
    it "should define a line through the fragment" do
      y = 200 + @fragment.ascender * 0.3
      target_points = [[50, y], [150, y]]
      @fragment.strikethrough_points.should == target_points
    end
  end
end

describe "Text::Formatted::Fragment that is a subscript" do
  before(:each) do
    create_pdf
    format_state = { :styles => [:subscript],
                     :color => nil,
                     :link => nil,
                     :anchor => nil,
                     :font => nil,
                     :size => nil }
    @fragment = Prawn::Text::Formatted::Fragment.new("hello world",
                                                     format_state,
                                                     @pdf)
    @fragment.line_height = 27
    @fragment.descender = 7
    @fragment.ascender = 17
  end
  describe "#subscript?" do
    it "should be true" do
      @fragment.should.be.subscript
    end
  end
  describe "#y_offset" do
    it "should return a negative value" do
      @fragment.y_offset.should.be < 0
    end
  end
end

describe "Text::Formatted::Fragment that is a superscript" do
  before(:each) do
    create_pdf
    format_state = { :styles => [:superscript],
                     :color => nil,
                     :link => nil,
                     :anchor => nil,
                     :font => nil,
                     :size => nil }
    @fragment = Prawn::Text::Formatted::Fragment.new("hello world",
                                                     format_state,
                                                     @pdf)
    @fragment.line_height = 27
    @fragment.descender = 7
    @fragment.ascender = 17
  end
  describe "#superscript?" do
    it "should be true" do
      @fragment.should.be.superscript
    end
  end
  describe "#y_offset" do
    it "should return a positive value" do
      @fragment.y_offset.should.be > 0
    end
  end
end
