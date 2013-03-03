root = exports ? this

FormEvents =
    EVENT_TYPE_ADD_INPUT:'add_input_item'

_.extend(FormEvents, Backbone.Events)

FieldSettings = 
    text:
	    id:''
	    type:'text'
	    defaultvalue:''
	    label:
		    id:''
		    type:'label'
		    value:'Single Line Text Input'
	    help:''
	    hidden:false
	    maxlen:''
    number:
	    id:''
	    type:'number'
	    defaultvalue:''
	    label:
		    id:''
		    type:'label'
		    value:'Number'
	    help:''
	    hidden:false
	    maxlen:''
    textarea:
	    id:''
	    type:'textarea'
	    defaultvalue:''
	    label:
		    id:''
		    type:'label'
		    value:'Paragraph Text Input'
	    help:''
	    hidden:false
    select:
	    id:''
	    type:'select'
	    values:
		    option1:'option1'
		    option2:'option2'
		    option3:'option3'
	    label:
		    id:''
		    type:'label'
		    value:'Select Field'
	    help:''
	    hidden:false


class BaseView extends Backbone.View
    initialize: =>
	    @model.set label_position:'left'
	    @template = $('#form_base').template()
    render:=>
	    $(@el).html $.tmpl @template

    events:
	    'click .remove_item':'remove_input_element'
	    'click .input_element': 'input_element_settings'
	    'mouseenter .input_element':'show_action_buttons'
	    'mouseleave .input_element':'hide_action_buttons'
	    'keyup #form_title_text': 'change_form_title'
	    'keyup #form_description_text': 'change_form_description'
	    'click .label_align_change': 'label_align_change'
	    'click #field_setting_tab': 'tab_field_setting'

    label_align_change:(ev)=>
	    if $(ev.target).attr('value') =='left'
		    $('#form_panel').find('form').removeClass('form-vertical').addClass('form-horizontal')
	    else
		    $('#form_panel').find('form').removeClass('form-horizontal').addClass('form-vertical')

    change_form_title:=>
	    $('#form_title').html($('#form_title_text').val())

    change_form_description:=>
	    $('#form_description').html($('#form_description_text').val())

    show_action_buttons:(ev)=>
	    $(ev.target).find('.action_items').removeClass('hide')

    hide_action_buttons:(ev)=>
	    $(ev.target).find('.action_items').addClass('hide')

    remove_input_element:(ev)=>
	    field_settings_dict = @model.get('field_settings')
	    delete field_settings_dict[$(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')]
	    @model.set field_settings:field_settings_dict
	    $(ev.target).closest('.input_element').remove()

    input_element_settings:(ev)=>
	    if $(ev.target).is('.remove_item')
		    return
	    @model.set current_field_edit:$(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')
	    if @render_field_settings
		    @render_field_settings.detach()
	    @render_field_settings = new FieldSettingsView el:'#tab3', model:@model, type:$(ev.target).closest('.input_element').attr('type'), field_id:$(ev.target).closest('.input_element').find('.controls').children(':first').attr('id')

    tab_field_setting:=>
	    a = $('#form_panel').find('.input_element:first')

class FieldSettingsView extends Backbone.View
    initialize:=>
	    template_render = @get_template(@.options.type)
	    @template = $(template_render).template()
	    @render()
    events:
	    'keyup .field_label_text': 'change_field_label_text'
	    'change .hide_field_checkbox': 'change_field_hide_status'
	    'change .field_max_chars': 'change_max_chars'

    change_field_label_text:=>
	    $('#form_panel').find('#' + @.options.field_id).closest('.control-group').find('label').html(($('.field_setting').find('.field_label_text').val()))
	    field_settings_dict = @model.get('field_settings')
	    field_settings_dict[@.options.field_id].label.value = $('.field_setting').find('.field_label_text').val()
	    @model.set field_settings: field_settings_dict

    change_field_hide_status:(ev)=>
	    field_settings_dict = @model.get('field_settings')
	    if $(ev.target).is(':checked')
		    field_settings_dict[@.options.field_id].hidden = true
	    else
		    field_settings_dict[@.options.field_id].hidden = false
	    @model.set field_settings: field_settings_dict
    change_max_chars:=>
	    field_settings_dict = @model.get('field_settings')
	    field_settings_dict[@.options.field_id].maxlen = $('.field_setting').find('.maxlen').val()
	    @model.set field_settings: field_settings_dict

    get_template:(type)=>
	    switch type
		    when 'text'
			    return '#text_settings_template'
		    when 'textarea'
			    return '#textarea_settings_template'
		    when 'select'
			    return '#select_settings_template'
		    when 'number'
			    return '#number_settings_template'
		    when 'options'
			    return '#option_settings_template'
		    else
			    return None
    render:=>
	    field_settings = @model.get('field_settings')[@.options.field_id]
	    $(@el).html ''
	    $(@el).html $.tmpl(@template, field_settings)

    detach:=>
	    $(@el).unbind()
	    @model.unbind()

class LeftPanelView extends Backbone.View
    initialize:=>
	    @template = $('#left_panel_template').template()

    events:
	    'click a': 'change_tab'
	    'click .input_item': 'add_input_item'

    change_tab:(ev)=>
	    $(ev.target).tab('show')

    add_input_item:(ev)=>
	    FormEvents.trigger(FormEvents.EVENT_TYPE_ADD_INPUT,$(ev.target).attr('type'))

    render:=>
	    $(@el).html $.tmpl @template

class TextInputTypeView extends Backbone.View
    initialize:=>
	    @template = $('#text_input_template').template()
	    @render()
    render:=>
	    $('form').append($.tmpl(@template, @model))

class TextAreaInputTypeView extends Backbone.View
    initialize:=>
	    @template = $('#textarea_input_template').template()
	    @render()
    render:=>
	    $('form').append($.tmpl(@template, @model))


class NumberInputTypeView extends Backbone.View
    initialize:=>
	    @template = $('#number_input_template').template()
	    @render()
    render:=>
	    $('form').append($.tmpl(@template, @model))

class SelectInputTypeView extends Backbone.View
    initialize:=>
	    @template = $('#select_input_template').template()
	    @render()
    render:=>
	    $('form').append($.tmpl(@template, @model))


class RootModel extends Backbone.Model
    initialize:=>

class RootController extends Backbone.Router
    initialize:(args)=>
	    @model = new RootModel
	    @model.set field_settings:{}
	    @model.set init_type:args['type']
	    @model.set num_fields:0
	    @initialize_rendering()
	    @render_left_panel()
	    FormEvents.bind(FormEvents.EVENT_TYPE_ADD_INPUT, @add_input_item, @)

    initialize_rendering:=>
	    @base_form_view = new BaseView model:@model, el:'#form_main_content'
	    @base_form_view.render()

    render_left_panel:=>
	    @left_panel_view = new LeftPanelView mode:@model, el:'#left_panel'
	    @left_panel_view.render()

    set_field_settings:(input_type)=>
	    field_settings_dict = FieldSettings[input_type]
	    field_settings_dict['id'] = 'Field' + @model.get('num_fields')
	    field_settings_dict['label']['id'] = 'Label' + @model.get('num_fields')
	    current_field_settings_dict = @model.get('field_settings')
	    current_field_settings_dict[field_settings_dict['id']] = field_settings_dict
	    @model.set field_settings:current_field_settings_dict

    add_input_item:(input_type)=>
	    @model.set num_fields:@model.get('num_fields') + 1
	    @set_field_settings(input_type)
	    @model_to_send = @model.get('field_settings')['Field' + @model.get('num_fields')]
	    switch input_type
		    when 'text'
			    new_input_item = new TextInputTypeView model:@model_to_send
		    when 'textarea'
			    new_input_item = new TextAreaInputTypeView model:@model_to_send
		    when 'number'
			    new_input_item = new NumberInputTypeView model:@model_to_send
		    when 'select'
			    new_input_item = new SelectInputTypeView model:@model_to_send
		    when 'checkbox'
			    new_input_item = new CheckboxInputTypeView model:@model_to_send
		    else
			    return null
	

root.RootController = RootController

initialize_form_builder=(type)->
    args = {}
    args['type'] = type
    root_controller = new RootController args
root.initialize_form_builder = initialize_form_builder
