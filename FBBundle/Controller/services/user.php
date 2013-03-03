<?php

function user_exist($email, $password, $conn, $logger){
    try{
	$statement = $conn->executeQuery("SELECT * FROM fb_user WHERE email = ? and password = ?", array($email, $password));
	if ($user = $statement->fetch()){
	    return $user['id'];
	}
    }catch(Exception $e){
	$logger->err("Error in chcking user_exist");
    }
    return null;
}  
function check_duplicate($email, $conn, $logger){
    return get_user_id($email, $conn, $logger);
}
function get_user_id($email, $conn, $logger){
    try{
	$statement = $conn->executeQuery("SELECT * FROM fb_user WHERE email = ?", array($email));
	if ($user = $statement->fetch()){
	    return $user['id'];
	}
    }catch(Exception $e){
	$logger->err("Error in getting user if from email");
    }
    return null;
}
function check_user_exist_with_email($email, $conn, $logger){
    return get_user_id($email, $conn, $logger);
}
function create_new_user($email, $password, $name, $conn, $logger){
    try{
	$result = $conn->insert('fb_user', array('email'=>$email, 'name'=>$name, 'password'=>$password));
	if ($result != null){
	    return user_exist($email, $password, $conn);
	}
    }catch(Exception $e){
	$logger->err("Error in creating new user");
    }
    return false;
}
function change_password($user_id, $password, $conn, $logger){
    try{
	$result = $conn->update('fb_user', array('password'=>$password), array('id'=>$user_id));
	if ($result){
	    return $result;    
	}
    }catch(Exception $e){
	$logger->err('Error occured in change_password');
    }  
    return null;
}
function generate_password(){
    $chars = "234567890abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $i = 0;
    $password = "";
    while ($i < 8) {
	$password .= $chars{mt_rand(0,strlen($chars))};
	$i++;
    }
    return $password;
}

?>