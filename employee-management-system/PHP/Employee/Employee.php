<?php

include '../DataBaseConnection/dbConnection.php';

$action='';

//FUNCTION TO GET DATA
function employeeEditData() {
    parse_str(file_get_contents("php://input"), $data);             
    $data = json_decode(json_encode($data));
    $employeeData = $data;

    return $employeeData;
}

function employeeInsertData() {
    $data = stripslashes(file_get_contents("php://input"));
    $data= json_decode($data);
    $employeeData = $data;

    return $employeeData;
}

//CHECKING ACTION PARAMETER
if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
   
    //EXTRACT DATA
    $data = json_encode($_POST);
      
    $data = json_decode($data);

    $employeeData = $data;

    //EDIT AND DELETE
    if(gettype($employeeData) == "object"){

        $action = $employeeData->action;
    }


    //INSERT
    else{
        $data = stripslashes(file_get_contents("php://input"));

        $data = json_decode($data);

        $employeeData= $data;

        $action = $employeeData[0]->action;
    }

}


//ALL CRUD FUNCTIONS
function displayEmployees($conn){

    if ( $_SERVER['REQUEST_METHOD'] == 'GET' ) {
    $allRecords = "SELECT * FROM `employees`";
    $allRecordsResult = $conn->query($allRecords);
    if($allRecordsResult->num_rows > 0){
        $allEmployeesData = array();
        while($row=$allRecordsResult->fetch_assoc()){
            $allEmployeesData[] = $row;
        }
    echo json_encode($allEmployeesData);
    
    }

    else{
        echo 0;
    }
}
}

function insertEmployees($conn){

    $employeeData = employeeInsertData();

    $insertQueryResult = '';
    
        for ($i = 0; $i < sizeof($employeeData); $i++) {
            
            if(!empty($employeeData[$i]->firstName) && !empty($employeeData[$i]->lastName) && !empty($employeeData[$i]->email) && !empty($employeeData[$i]->department) )

            {
               
                    $sql = "INSERT INTO `employees` (firstName, lastName, email, departmentId) VALUES ";
                    
                    $sql .= "('".$employeeData[$i]->firstName."','".$employeeData[$i]->lastName."','".$employeeData[$i]->email."','".$employeeData[$i]->department."'),";

                    
                    $sql = rtrim($sql, ',');
                    $insertQueryResult = $conn->query($sql);
                    
    
            }
            
        }
        if($insertQueryResult == TRUE){
            echo 1;
           }
        else {
            echo 0;
    
           }
       
}

function deleteEmployees($conn){


    $employeeData = employeeEditData();

    $id = $employeeData->id;


    if(!empty($id)){
        $sql = "DELETE FROM `employees` WHERE id={$id}";
        if($conn->query($sql) == TRUE){
            echo 1;
        }else{
            echo 0;
        }

    }

}

function editEmployees($conn){

    $employeeData = employeeEditData();

    $id = $employeeData->id;
    $firstName = $employeeData->firstName;
    $lastName = $employeeData->lastName;
    $email = $employeeData->email;
    $department = $employeeData->department;

    $inputFieldsArray = array('$id','$firstName','$lastName','$department');

        if(array_search("", $inputFieldsArray) == false){    
        $sql = "UPDATE `employees` SET firstName='{$firstName}', lastName='{$lastName}', email='{$email}', departmentId='{$department}' WHERE id={$id}";

        $result = $conn->query($sql);

        if($result == TRUE){
          echo 1;
        }

        else{
            echo 0;
        }
    }

}

//DISPLAY ALL EMPLOYEE RECORDS
if ( $_SERVER['REQUEST_METHOD'] == 'GET' ) {

    displayEmployees($conn);

}


//INSERT NEW SINGLE/BULK EMPLOYEE RECORD/S
if ($action == 'insert' ) {

    insertEmployees($conn);
}  


//DELETE EMPLOYEE RECORD
if ( $action == 'delete' ) {
    deleteEmployees($conn);

}

//UPDATE EMPLOYEE RECORD
if ( $action == 'edit' ) {
    editEmployees($conn);

} 

?>