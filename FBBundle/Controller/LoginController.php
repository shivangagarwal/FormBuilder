<?php

namespace FormBuilder\FBBundle\Controller;
require_once('services/user.php');
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

class LoginController extends Controller
{
    
    public function loginAction(){
	$logger = $this->get('logger');
	$request = $this->get('request');
	$email = $request->request->get('email', '');
	$password = $request->request->get('password', '');
	
	$user_id = user_exist($email, $password, $this->get('database_connection'), $logger);
	if ($user_id != null){
	    $result = array('responseCode'=>200, "success"=>"true");
	    $result = json_encode($result);
	    $response  = new Response($result, 200);
	    $response->headers->set('Content-type', 'application/json');
	    $response->headers->setCookie(new Cookie('formbuilder_login', $user_id));
	}else{
	    $result = array('responseCode'=>200, "error"=>"true");
	    $result = json_encode($result);
	    $response  = new Response($result, 200);
	    $response->headers->set('Content-type', 'application/json');
	}
	return $response;
    }
    
    public function indexAction(){
	$logger = $this->get('logger');
	$request = $this->get('request');
	$user_id = $request->cookies->get('formbuilder_login');
	if (is_null($user_id)){
	    return $this->render('FormBuilderFBBundle:Login:index.html.twig', array('page_title' => 'Login', 'server_prefix' => 'formbuilder.php'));
	}
	return $this->render('FormBuilderFBBundle:Login:loggedin.html.twig', array('page_title' => 'LoggedIn'));
    }
    
    public function registerAction(){
	$logger = $this->get('logger');
	$request = $this->get('request');
	$user_id = $request->cookies->get('formbuilder_login');
	if (is_null($user_id)){
	    return $this->render('FormBuilderFBBundle:Login:register.html.twig', array('page_title' => 'SignUp'));
	}
	return $this->render('FormBuilderFBBundle:Login:loggedin.html.twig', array('page_title' => 'LoggedIn'));
    }

    public function create_new_userAction(){
	$logger = $this->get('logger');
	$request = $this->get('request');
	$conn = $this->get('database_connection');
	$email = $request->request->get('email', '');
	$password = $request->request->get('password', '');
	$name = $request->request->get('user_name', '');
	
	$user_id = check_duplicate($email, $conn, $logger);
	if (is_null($user_id)){
	    $query_result = create_new_user($email, $password, $name, $conn, $logger);
	    if ($query_result){
		$result = array('responseCode'=>200, "success"=>"true");
		$result = json_encode($result);
		$response  = new Response($result, 200);
		$response->headers->set('Content-type', 'application/json');
		$response->headers->setCookie(new Cookie('formbuilder_login', $query_result));
		return $response;
	    }else{
		$result = array('responseCode'=>200, "error"=>"true", 'reason'=>'Error while creating new user.Please try again after sometime.');
	    }
	}else{
	    $result = array('responseCode'=>200, "error"=>"true", 'reason'=>'User with this email id already exist');
	}
	$result = json_encode($result);
	$response  = new Response($result, 200);
	$response->headers->set('Content-type', 'application/json');
	return $response;
    }

    public function forgot_passwordAction(){
	$logger = $this->get('logger');
	$logger->info('Forgot Password request received');
	return $this->render('FormBuilderFBBundle:Login:forgot_password.html.twig', array('page_title' => 'Forgot Password', 'server_prefix' => 'formbuilder.php'));
    }
    
    public function send_password_emailAction(){
	$logger = $this->get('logger');
	$logger->info('send password email request received');
	
	$conn = $this->get('database_connection');
	
	$request = $this->get('request');
	$email = $request->request->get('email', '');

	$user_id = check_user_exist_with_email($email, $conn, $logger);
	
	if ($user_id != null){
	    $new_password = generate_password();
	    $logger->info('New passwors is' . $new_password);
	    $result = change_password($user_id, md5($new_password), $conn, $logger);
	    if ($result){
		$result = array('responseCode'=>200, "success"=>"true");
		$result = json_encode($result);
		$response  = new Response($result, 200);
		$response->headers->set('Content-type', 'application/json');
		return $response;
	    }else{
		$result = array('responseCode'=>200, "error"=>"true", 'reason'=>'Error while sending an email.');
	    }
	}else{
	    $result = array('responseCode'=>200, "error"=>"true", 'reason'=>'Email Id does not exist in the system.');
	}
	$result = json_encode($result);
	$response  = new Response($result, 200);
	$response->headers->set('Content-type', 'application/json');
	return $response;
    }
    public function change_passwordAction(){
	$logger = $this->get('logger');
	$conn = $this->get('database_connection');
	$request = $this->get('request');
	$user_id = $request->request->get('user_id', '');

	$result = change_password($user_id, $password, $conn, $logger);
	if ($result){
	    $result = array('responseCode'=>200, "success"=>"true");
	    $response  = new Response($result, 200);
	    $response->headers->set('Content-type', 'application/json');
	    $response->headers->clearCookie('formbuilder_login');
	    return $response;
	}else{
	    $result = array('responseCode'=>200, "error"=>"true", 'reason'=>'Error while sending the password.');
	}
	$response  = new Response($result, 200);
	$response->headers->set('Content-type', 'application/json');
	return $response;
    }
}
