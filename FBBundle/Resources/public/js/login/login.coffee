	
do_login = () ->
	$('div#login_error_msg').hide()
	data_params =
		email : $('input[name=email]:visible').val()
		password : hex_md5($('input[name=password]:visible').val())
	error_function = (obj, txt) ->
		$('div#login_error_msg').html 'Error in logging in. Please try later'
		$('div#login_error_msg').show()
	success_function = (response) ->
		if response.error
			$('div#login_error_msg').html 'Email and password does not match'
			$('div#login_error_msg').show()
		else if response.success
			alert "Your logged in"
			#window.location.href = '/Symfony/web/app_dev.php/login'
	ajax_params =
		url : '/login'
		type : 'POST'
		data : data_params
		dataType : 'json'
		success : success_function
		error : error_function
	$.ajax ajax_params

detect_key = (e, call_to) ->
	if e.which == 13
		if call_to == 1
			do_login()
		else if call_to == 2
			register_new_user()
		else if call_to == 3
			forgot_password()

validate_form_input = ->
	$('div#login_error_msg').hide()
	fields = [
		'.email'
		'.name'
		'.password'
		'.confirm_password'
	]
	if check_if_blank(fields)
		$('div#login_error_msg').html 'Please fill in the fields marked in red', 'Error'
		$('div#login_error_msg').show()
		return false
	
	if password_match(fields)
		$('div#login_error_msg').html 'Password and Confirm password are not same', 'Error'
		$('div#login_error_msg').show()
		return false
	return true

password_match = (fields) ->
	if $('.password').val() != $('.confirm_password').val()
		$('.password, .confirm_password').closest('.control-group').addClass('error')
		return true
	return false

check_if_blank = (fields) ->
	is_blank = false
	for field in fields
		if $(field).val() == ''
			$(field).closest('.control-group').addClass('error')
			is_blank = true
		else
			$(field).closest('.control-group').removeClass('error')

	return is_blank

register_new_user = ()->

	if validate_form_input()
		email = $('input[name=email]:visible').val()
		user_name = $('input[name=name]:visible').val()
		password = hex_md5($('input[name=password]:visible').val())
		confirm_password = hex_md5($('input[name=confirm_password]:visible').val())
		url = '/create_new_user'
		data_params =
			email : email
			user_name : user_name
			password : password
		success_function= (response)->
			if response.error
				$('div#login_error_msg').html response.reason
				$('div#login_error_msg').show()
			else if response.success
				#window.location.href = ''
				alert "Your account has been created"
		error_function= (obj, txt)->
			$('div#login_error_msg').html 'Error in signing up, Please try again'
			$('div#login_error_msg').show()
		ajax_params =
			url : url
			type : 'POST'
			dataType : 'json'
			data : data_params
			success : success_function
			error : error_function
		$.ajax ajax_params

send_password_email = ()->
	$('div#login_error_msg').hide()
	data_params =
		email : $('input[name=email]:visible').val()
	error_function = (obj, txt) ->
		$('div#login_error_msg').html 'Error in sending an email'
		$('div#login_error_msg').show()
	success_function = (response) ->
		if response.error
			$('div#login_error_msg').html response.reason
			$('div#login_error_msg').show()
		else if response.success
			$('div#fp_div').hide()
			$('div#fp_success_div').html "Success !!! New password has been mailed to you mail id."
			$('div#fp_success_div').show()
			#window.location.href = '/Symfony/web/app_dev.php/login'
	ajax_params =
		url : '/send_password_email'
		type : 'POST'
		data : data_params
		dataType : 'json'
		success : success_function
		error : error_function
	$.ajax ajax_params


window.detect_key = detect_key
window.do_login = do_login
window.register_new_user = register_new_user
window.send_password_email = send_password_email