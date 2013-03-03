<?php

namespace FormBuilder\FBBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class FormController extends Controller
{
    public function indexAction($type)
    {
	#this is the form create function, the type field determines if it is a new form with log-in or not
	$logger = $this->get('logger');
	if ($type == 'signup' || $type == 'auth' ){
	    $page_title = 'Form Builder';
	    return $this->render('FormBuilderFBBundle:Form:index.html.twig', array('type' => $type, 'page_title' => $page_title));
	}
	else{
	    return $this->render('FormBuilderFBBundle:Form:error.html.twig');
	}
    }
}
