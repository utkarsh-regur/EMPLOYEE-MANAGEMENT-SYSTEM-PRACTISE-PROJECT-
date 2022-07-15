<?php

include '../DataBaseConnection/dbConnection.php';
include '../Validation/Validation.php';
include '../Crud/Crud.php';



//DISPLAY ALL EMPLOYEE RECORDS
if ( $_SERVER['REQUEST_METHOD'] == 'GET')
{

    displayEmployees();

}


//INSERT dataFormatted SINGLE/BULK EMPLOYEE RECORD/S
if ($action == 'insert') 
{

    insertEmployees();
}  


//DELETE EMPLOYEE RECORD
if ( $action == 'delete') 
{
    deleteEmployees();

}

//UPDATE EMPLOYEE RECORD
if ( $action == 'edit') 
{
    editEmployees();

} 

?>