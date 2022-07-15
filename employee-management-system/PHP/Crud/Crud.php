<?php

//ALL CRUD FUNCTIONS
function displayEmployees()
{

    global $conn;

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

function insertEmployees()
{
    
    global $conn;
    global $dataFormatted;

    $insertQueryResult = '';

    if(isValidData() == true)
    {
        foreach ($dataFormatted['data'] as $key => $employee ) 
        {
        
                $sql = "INSERT INTO `employees` (firstName, lastName, email, departmentId) VALUES ";
                
                $sql .= "('".$employee->firstName."','".$employee->lastName."','".$employee->email."','".$employee->department."'),";
                
                $sql = rtrim($sql, ',');
                $insertQueryResult = $conn->query($sql);
                
        }     
    }

        if($insertQueryResult == TRUE)
        {
            echo 1;
        }
       
}

function deleteEmployees()
{

    global $conn;

    $id = $_POST['id'];

    if(!empty($id)){
        $sql = "DELETE FROM `employees` WHERE id={$id}";
        if($conn->query($sql) == TRUE){
            echo 1;
        }else{
            echo 0;
        }

    }

}

function editEmployees()
{
    global $conn;

    $id = $_POST['id'];
    global $firstName;
    global $lastName;
    global $email;
    global $department;

    if(isValidData() == true)
    {   
        $sql = "UPDATE `employees` SET firstName='{$firstName}', lastName='{$lastName}', email='{$email}', departmentId='{$department}' WHERE id={$id}";

        $result = $conn->query($sql);

        if($result == TRUE)
        {
          echo 1;
        }
    }

}

?>