<?php

use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;

$collection = new RouteCollection();
$collection->add('FormBuilderFBBundle_homepage', new Route('/hello/{name}', array(
    '_controller' => 'FormBuilderFBBundle:Default:index',
)));

$collection->add('login', new Route('/login', array(
    '_controller' => 'FormBuilderFBBundle:Login:index',
    ), array(
	'_method' => 'GET',
    )
));

$collection->add('login_post', new Route('/login', array(
    '_controller' => 'FormBuilderFBBundle:Login:login',
    ), array(
	'_method' => 'POST',
    )
));

$collection->add('register', new Route('/register', array(
    '_controller' => 'FormBuilderFBBundle:Login:register',
    ), array(
	'_method' => 'GET',
    )
));

$collection->add('create_new_user', new Route('/create_new_user', array(
    '_controller' => 'FormBuilderFBBundle:Login:create_new_user',
    ), array(
	'_method' => 'POST',
    )
));

$collection->add('forgot_password', new Route('/forgot_password', array(
    '_controller' => 'FormBuilderFBBundle:Login:forgot_password',
    ), array(
	'_method' => 'GET',
    )
));

$collection->add('send_password_email', new Route('/send_password_email', array(
    '_controller' => 'FormBuilderFBBundle:Login:send_password_email',
    ), array(
	'_method' => 'POST',
    )
));


$collection->add('FormCreation', new Route('/form/{type}', array(
    '_controller' => 'FormBuilderFBBundle:Form:index',
)));

return $collection;
