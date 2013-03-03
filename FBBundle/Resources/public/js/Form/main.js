(function() {
  var BaseView, FieldSettings, FieldSettingsView, FormEvents, LeftPanelView, NumberInputTypeView, RootController, RootModel, SelectInputTypeView, TextAreaInputTypeView, TextInputTypeView, initialize_form_builder, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  FormEvents = {
    EVENT_TYPE_ADD_INPUT: 'add_input_item'
  };

  _.extend(FormEvents, Backbone.Events);

  FieldSettings = {
    text: {
      id: '',
      type: 'text',
      defaultvalue: '',
      label: {
        id: '',
        type: 'label',
        value: 'Single Line Text Input'
      },
      help: '',
      hidden: false,
      maxlen: ''
    },
    number: {
      id: '',
      type: 'number',
      defaultvalue: '',
      label: {
        id: '',
        type: 'label',
        value: 'Number'
      },
      help: '',
      hidden: false,
      maxlen: ''
    },
    textarea: {
      id: '',
      type: 'textarea',
      defaultvalue: '',
      label: {
        id: '',
        type: 'label',
        value: 'Paragraph Text Input'
      },
      help: '',
      hidden: false
    },
    select: {
      id: '',
      type: 'select',
      values: {
        option1: 'option1',
        option2: 'option2',
        option3: 'option3'
      },
      label: {
        id: '',
        type: 'label',
        value: 'Select Field'
      },
      help: '',
      hidden: false
    }
  };

  BaseView = (function(_super) {

    __extends(BaseView, _super);

    function BaseView() {
      this.tab_field_setting = __bind(this.tab_field_setting, this);
      this.input_element_settings = __bind(this.input_element_settings, this);
      this.remove_input_element = __bind(this.remove_input_element, this);
      this.hide_action_buttons = __bind(this.hide_action_buttons, this);
      this.show_action_buttons = __bind(this.show_action_buttons, this);
      this.change_form_description = __bind(this.change_form_description, this);
      this.change_form_title = __bind(this.change_form_title, this);
      this.label_align_change = __bind(this.label_align_change, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.initialize = function() {
      this.model.set({
        label_position: 'left'
      });
      return this.template = $('#form_base').template();
    };

    BaseView.prototype.render = function() {
      return $(this.el).html($.tmpl(this.template));
    };

    BaseView.prototype.events = {
      'click .remove_item': 'remove_input_element',
      'click .input_element': 'input_element_settings',
      'mouseenter .input_element': 'show_action_buttons',
      'mouseleave .input_element': 'hide_action_buttons',
      'keyup #form_title_text': 'change_form_title',
      'keyup #form_description_text': 'change_form_description',
      'click .label_align_change': 'label_align_change',
      'click #field_setting_tab': 'tab_field_setting'
    };

    BaseView.prototype.label_align_change = function(ev) {
      if ($(ev.target).attr('value') === 'left') {
        return $('#form_panel').find('form').removeClass('form-vertical').addClass('form-horizontal');
      } else {
        return $('#form_panel').find('form').removeClass('form-horizontal').addClass('form-vertical');
      }
    };

    BaseView.prototype.change_form_title = function() {
      return $('#form_title').html($('#form_title_text').val());
    };

    BaseView.prototype.change_form_description = function() {
      return $('#form_description').html($('#form_description_text').val());
    };

    BaseView.prototype.show_action_buttons = function(ev) {
      return $(ev.target).find('.action_items').removeClass('hide');
    };

    BaseView.prototype.hide_action_buttons = function(ev) {
      return $(ev.target).find('.action_items').addClass('hide');
    };

    BaseView.prototype.remove_input_element = function(ev) {
      var field_settings_dict;
      field_settings_dict = this.model.get('field_settings');
      delete field_settings_dict[$(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')];
      this.model.set({
        field_settings: field_settings_dict
      });
      return $(ev.target).closest('.input_element').remove();
    };

    BaseView.prototype.input_element_settings = function(ev) {
      if ($(ev.target).is('.remove_item')) return;
      this.model.set({
        current_field_edit: $(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')
      });
      if (this.render_field_settings) this.render_field_settings.detach();
      return this.render_field_settings = new FieldSettingsView({
        el: '#tab3',
        model: this.model,
        type: $(ev.target).closest('.input_element').attr('type'),
        field_id: $(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')
      });
    };

    BaseView.prototype.tab_field_setting = function() {
      var a;
      return a = $('#form_panel').find('.input_element:first');
    };

    return BaseView;

  })(Backbone.View);

  FieldSettingsView = (function(_super) {

    __extends(FieldSettingsView, _super);

    function FieldSettingsView() {
      this.detach = __bind(this.detach, this);
      this.render = __bind(this.render, this);
      this.get_template = __bind(this.get_template, this);
      this.change_max_chars = __bind(this.change_max_chars, this);
      this.change_field_hide_status = __bind(this.change_field_hide_status, this);
      this.change_field_label_text = __bind(this.change_field_label_text, this);
      this.initialize = __bind(this.initialize, this);
      FieldSettingsView.__super__.constructor.apply(this, arguments);
    }

    FieldSettingsView.prototype.initialize = function() {
      var template_render;
      template_render = this.get_template(this.options.type);
      this.template = $(template_render).template();
      return this.render();
    };

    FieldSettingsView.prototype.events = {
      'keyup .field_label_text': 'change_field_label_text',
      'change .hide_field_checkbox': 'change_field_hide_status',
      'change .field_max_chars': 'change_max_chars'
    };

    FieldSettingsView.prototype.change_field_label_text = function() {
      var field_settings_dict;
      $('#form_panel').find('#' + this.options.field_id).closest('.control-group').find('label').html($('.field_setting').find('.field_label_text').val());
      field_settings_dict = this.model.get('field_settings');
      field_settings_dict[this.options.field_id].label.value = $('.field_setting').find('.field_label_text').val();
      return this.model.set({
        field_settings: field_settings_dict
      });
    };

    FieldSettingsView.prototype.change_field_hide_status = function(ev) {
      var field_settings_dict;
      field_settings_dict = this.model.get('field_settings');
      if ($(ev.target).is(':checked')) {
        field_settings_dict[this.options.field_id].hidden = true;
      } else {
        field_settings_dict[this.options.field_id].hidden = false;
      }
      return this.model.set({
        field_settings: field_settings_dict
      });
    };

    FieldSettingsView.prototype.change_max_chars = function() {
      var field_settings_dict;
      field_settings_dict = this.model.get('field_settings');
      field_settings_dict[this.options.field_id].maxlen = $('.field_setting').find('.maxlen').val();
      return this.model.set({
        field_settings: field_settings_dict
      });
    };

    FieldSettingsView.prototype.get_template = function(type) {
      switch (type) {
        case 'text':
          return '#text_settings_template';
        case 'textarea':
          return '#textarea_settings_template';
        case 'select':
          return '#select_settings_template';
        case 'number':
          return '#number_settings_template';
        case 'options':
          return '#option_settings_template';
        default:
          return None;
      }
    };

    FieldSettingsView.prototype.render = function() {
      var field_settings;
      field_settings = this.model.get('field_settings')[this.options.field_id];
      $(this.el).html('');
      return $(this.el).html($.tmpl(this.template, field_settings));
    };

    FieldSettingsView.prototype.detach = function() {
      $(this.el).unbind();
      return this.model.unbind();
    };

    return FieldSettingsView;

  })(Backbone.View);

  LeftPanelView = (function(_super) {

    __extends(LeftPanelView, _super);

    function LeftPanelView() {
      this.render = __bind(this.render, this);
      this.add_input_item = __bind(this.add_input_item, this);
      this.change_tab = __bind(this.change_tab, this);
      this.initialize = __bind(this.initialize, this);
      LeftPanelView.__super__.constructor.apply(this, arguments);
    }

    LeftPanelView.prototype.initialize = function() {
      return this.template = $('#left_panel_template').template();
    };

    LeftPanelView.prototype.events = {
      'click a': 'change_tab',
      'click .input_item': 'add_input_item'
    };

    LeftPanelView.prototype.change_tab = function(ev) {
      return $(ev.target).tab('show');
    };

    LeftPanelView.prototype.add_input_item = function(ev) {
      return FormEvents.trigger(FormEvents.EVENT_TYPE_ADD_INPUT, $(ev.target).attr('type'));
    };

    LeftPanelView.prototype.render = function() {
      return $(this.el).html($.tmpl(this.template));
    };

    return LeftPanelView;

  })(Backbone.View);

  TextInputTypeView = (function(_super) {

    __extends(TextInputTypeView, _super);

    function TextInputTypeView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      TextInputTypeView.__super__.constructor.apply(this, arguments);
    }

    TextInputTypeView.prototype.initialize = function() {
      this.template = $('#text_input_template').template();
      return this.render();
    };

    TextInputTypeView.prototype.render = function() {
      return $('form').append($.tmpl(this.template, this.model));
    };

    return TextInputTypeView;

  })(Backbone.View);

  TextAreaInputTypeView = (function(_super) {

    __extends(TextAreaInputTypeView, _super);

    function TextAreaInputTypeView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      TextAreaInputTypeView.__super__.constructor.apply(this, arguments);
    }

    TextAreaInputTypeView.prototype.initialize = function() {
      this.template = $('#textarea_input_template').template();
      return this.render();
    };

    TextAreaInputTypeView.prototype.render = function() {
      return $('form').append($.tmpl(this.template, this.model));
    };

    return TextAreaInputTypeView;

  })(Backbone.View);

  NumberInputTypeView = (function(_super) {

    __extends(NumberInputTypeView, _super);

    function NumberInputTypeView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      NumberInputTypeView.__super__.constructor.apply(this, arguments);
    }

    NumberInputTypeView.prototype.initialize = function() {
      this.template = $('#number_input_template').template();
      return this.render();
    };

    NumberInputTypeView.prototype.render = function() {
      return $('form').append($.tmpl(this.template, this.model));
    };

    return NumberInputTypeView;

  })(Backbone.View);

  SelectInputTypeView = (function(_super) {

    __extends(SelectInputTypeView, _super);

    function SelectInputTypeView() {
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      SelectInputTypeView.__super__.constructor.apply(this, arguments);
    }

    SelectInputTypeView.prototype.initialize = function() {
      this.template = $('#select_input_template').template();
      return this.render();
    };

    SelectInputTypeView.prototype.render = function() {
      return $('form').append($.tmpl(this.template, this.model));
    };

    return SelectInputTypeView;

  })(Backbone.View);

  RootModel = (function(_super) {

    __extends(RootModel, _super);

    function RootModel() {
      this.initialize = __bind(this.initialize, this);
      RootModel.__super__.constructor.apply(this, arguments);
    }

    RootModel.prototype.initialize = function() {};

    return RootModel;

  })(Backbone.Model);

  RootController = (function(_super) {

    __extends(RootController, _super);

    function RootController() {
      this.add_input_item = __bind(this.add_input_item, this);
      this.set_field_settings = __bind(this.set_field_settings, this);
      this.render_left_panel = __bind(this.render_left_panel, this);
      this.initialize_rendering = __bind(this.initialize_rendering, this);
      this.initialize = __bind(this.initialize, this);
      RootController.__super__.constructor.apply(this, arguments);
    }

    RootController.prototype.initialize = function(args) {
      this.model = new RootModel;
      this.model.set({
        field_settings: {}
      });
      this.model.set({
        init_type: args['type']
      });
      this.model.set({
        num_fields: 0
      });
      this.initialize_rendering();
      this.render_left_panel();
      return FormEvents.bind(FormEvents.EVENT_TYPE_ADD_INPUT, this.add_input_item, this);
    };

    RootController.prototype.initialize_rendering = function() {
      this.base_form_view = new BaseView({
        model: this.model,
        el: '#form_main_content'
      });
      return this.base_form_view.render();
    };

    RootController.prototype.render_left_panel = function() {
      this.left_panel_view = new LeftPanelView({
        mode: this.model,
        el: '#left_panel'
      });
      return this.left_panel_view.render();
    };

    RootController.prototype.set_field_settings = function(input_type) {
      var current_field_settings_dict, field_settings_dict;
      field_settings_dict = FieldSettings[input_type];
      field_settings_dict['id'] = 'Field' + this.model.get('num_fields');
      field_settings_dict['label']['id'] = 'Label' + this.model.get('num_fields');
      current_field_settings_dict = this.model.get('field_settings');
      current_field_settings_dict[field_settings_dict['id']] = field_settings_dict;
      return this.model.set({
        field_settings: current_field_settings_dict
      });
    };

    RootController.prototype.add_input_item = function(input_type) {
      var new_input_item;
      this.model.set({
        num_fields: this.model.get('num_fields') + 1
      });
      this.set_field_settings(input_type);
      this.model_to_send = this.model.get('field_settings')['Field' + this.model.get('num_fields')];
      switch (input_type) {
        case 'text':
          return new_input_item = new TextInputTypeView({
            model: this.model_to_send
          });
        case 'textarea':
          return new_input_item = new TextAreaInputTypeView({
            model: this.model_to_send
          });
        case 'number':
          return new_input_item = new NumberInputTypeView({
            model: this.model_to_send
          });
        case 'select':
          return new_input_item = new SelectInputTypeView({
            model: this.model_to_send
          });
        case 'checkbox':
          return new_input_item = new CheckboxInputTypeView({
            model: this.model_to_send
          });
        default:
          return null;
      }
    };

    return RootController;

  })(Backbone.Router);

  root.RootController = RootController;

  initialize_form_builder = function(type) {
    var args, root_controller;
    args = {};
    args['type'] = type;
    return root_controller = new RootController(args);
  };

  root.initialize_form_builder = initialize_form_builder;

}).call(this);
