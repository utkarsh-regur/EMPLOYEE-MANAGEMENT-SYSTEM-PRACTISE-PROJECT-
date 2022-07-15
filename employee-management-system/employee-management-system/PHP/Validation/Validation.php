<?php

$action='';

//CHECKING ACTION PARAMETER VALUE
if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) 
{

    $employeeDetails = new stdClass;

    //EXTRACT DATA
    if(count($_POST) === 0) //$_POST RETURNING EMPTY ARRAY FOR INSERT
    {
        
        $data = stripslashes(file_get_contents("php://input"));
        $data= json_decode($data);

        //GET VALUE OF ACTION PARAMETER
        $action = $data[0]->action;
        
        //REMOVE ACTION PARAMETER FROM EACH ENTRY AND STORE VALUES IN OBJECT
        for ($i = 0; $i < sizeof($data); $i++) 
        {
            unset($data[$i]->action);

            $firstName = $data[$i]->firstName;
            $lastName = $data[$i]->lastName;
            $email = $data[$i]->email;
            $department = $data[$i]->department;
     
        }

        //STANDARDIZE DATA FORMAT
        $dataFormatted= [
            "data" => $data,
            "action" => $action,
        ];
       
    }  

    else
    {
        //SEPARATE REQUIRED DATA
        $firstName = 	$_POST['firstName'];
        $lastName =  	$_POST['lastName'];
        $email = 	  	$_POST['email'];
        $department =   $_POST['department'];

        $employeeDetails->firstName = $firstName;
        $employeeDetails->lastName =  $lastName ;
        $employeeDetails->email = $email;
        $employeeDetails->department = $department;

    
        //STANDARDIZE DATA FORMAT
        $dataFormatted= [

            "data" => $employeeDetails,
            "action" => $_POST['action'],
        ];

        //GET VALUE OF ACTION PARAMETER
        $action =  $dataFormatted["action"];
 
    }


}

//VALIDATE DATA
function isValidData()
{

//ERROR LIST
$errors = array();

//FOR INSERT
if(count($_POST)==0){

global $dataFormatted;

$firstName = [];
$lastName = [];
$email = [];
$department = [];

    for($i=0; $i< sizeof($dataFormatted['data']) ; $i++)
    {
       
      $firstName[] = $dataFormatted['data'][$i]->firstName;
      $lastName[] = $dataFormatted['data'][$i]->lastName;
      $email[] = $dataFormatted['data'][$i]->email;
      $department[] = $dataFormatted['data'][$i]->department;
         

    }

    //VALIDATE NAMES
    foreach ($firstName as $key => $value)
    {

           if (empty($value))
           { 
              array_push($errors, "First name cannot be empty");
           }

            if (!preg_match ("/^[a-zA-z]*$/", $value)) 
            {  
                array_push($errors, "Names should contain only alphabets");
            }
        

    }

    foreach ($lastName as $key => $value)
    {

        if (empty($value))
            array_push($errors, "Last name cannot be empty");
            if (!preg_match ("/^[a-zA-z]*$/", $value)) 
            {  
                array_push($errors, "Names should contain only alphabets");
            }
    }

    //VALIDATE EMAIL
    foreach ($email as $key => $value)
    {

        if (filter_var($value, FILTER_VALIDATE_EMAIL) == false) 
        {
         array_push($errors, "Please enter a valid email address");
        
        }

    }

    //VALIDATE DEPARTMENT
    foreach ($department as $key => $value)
    {

        if ($value == 0) {
            array_push($errors, "Please select a department");
        }

    }


}

//FOR UPDATE
else{

    global $firstName;
    global $lastName;
    global $email;
    global $department;
  
    $firstName = trim($firstName);
    $lastName = trim($lastName);
    $email = trim($email);
    $department = trim($department);

    $namesField = array("First Name"=>$firstName, "Last Name"=>$lastName);

    //VALIDATE NAMES
    foreach ($namesField as $key => $value)
    {
       
        if (empty($value))
          array_push($errors, "$key cannot be empty");

    }

    if (!preg_match ("/^[a-zA-z]*$/", $firstName) || !preg_match ("/^[a-zA-z]*$/", $lastName)) 
    {  
        array_push($errors, "Names should contain only alphabets");
    }

   //VALIDATE EMAIL
   if (filter_var($email, FILTER_VALIDATE_EMAIL) == false) 
   {
     array_push($errors, "Please enter a valid email address");
   
   }

    //VALIDATE DEPARTMENT
    if ($department == 0) {
        array_push($errors, "Please select a department");
       
    }

}

  //IF NO ERRORS EXECUTE CRUD OPERATION
  if (count($errors) === 0)
  {
      return true;
  }
  
  //IF ERRORS FOUND PRINT ERROR LIST
  else{

      foreach($errors as $error)
      {

          echo "$error <br/>";
      }
  }
}

?>