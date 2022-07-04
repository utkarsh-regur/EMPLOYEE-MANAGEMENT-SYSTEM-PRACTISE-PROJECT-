$(document).ready(function () {
  //INITIALIZE SELECT2()
  $(".js-example-basic-single").select2();

  //NEW ROW HTML STRUCTURE
  let newRow = `<tr class="new-input-row">
<td><input type="text" name="firstName" value="" class="new-employee-input"/></td>
<td><input type="text" name="lastName" value="" class="new-employee-input"/></td>
<td><input type="email" name="email" value="" class="new-employee-input email"/></td>
<td>
   <select class="js-example-basic-single new-employee-input" name="department">
       <option selected value="0">--Select department --</option>
       <option value="1">IT</option>
       <option value="2">HR</option>
       <option value="3">Management</option>
   </select>
</td>
<td class="new-row-actions"><button class="cancel-new-row btn-close my-2" title="Remove row"></button><span class="reset-new-row reset-icon my-2" title="Reset row"><img class="reset-icon" src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/undefined/external-refresh-arrows-dreamstale-lineal-dreamstale.png"/></span></td>
</tr>`;

  //ADD NEW ROW ON BTN CLICK
  $(".add-employee").on("click", function () {
    $("#global-save").prop("disabled", false);

    //RE-INITIALIZE SELECT2
    $(".js-example-basic-single").select2();

    let tableBody = $("tbody");
    if (tableBody.length > 0) {
      $(tableBody).append(newRow);
    }
  });
});

let sameEmail = "";
const emailsArray = [];

/* HELPER FUNCTIONS */

//DISPLAY NAMES IN CAPITALIZED FORMAT
function capitalizedNames(str) {
  const caitalizedStr =
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return caitalizedStr;
}

//ALL FIELDS VALIDATION FUNCTIONS
function isValidEmail(email) {
  const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isValidName(name) {
  const regex = /^[a-zA-Z]{3,16}$/;
  return regex.test(name);
}

//CHECK IF ALL NEW ENTERED EMAILS ARE UNIQUE
function uniqueEmailInput(arr) {
  return arr.length === new Set(arr).size;
}

//ACTION ATTRIBUTE VALUE
let action = $(this).closest("table tr").find("input#action").val();

//DISPLAY ALL EMPLOYEE RECORDS
let allemployeesData = [];

function showEmploeesData() {
  //RE INITIALIZE SELECT2()
  $(".js-example-basic-single").select2();
  let allRecordsHTML = "";
  $.ajax({
    url: "PHP/Employee/Employee.php",
    type: "GET",
    dataType: "json",
    success: function (employeesData) {
      allemployeesData = employeesData;

      if (employeesData) {
        for (i = 0; i < employeesData.length; i++) {
          allRecordsHTML += `<tr class="employeeRow" id=${
            employeesData[i].id
          }><td><input class="employee-data-display" name='firstName' type="text" value=${capitalizedNames(
            employeesData[i].firstName
          )} readonly></td><td><input class="employee-data-display" name='lastName' type="text" value=${capitalizedNames(
            employeesData[i].lastName
          )} readonly></td><td><input name='email' type="email" class="employee-data-display email" value=${
            employeesData[i].email
          } readonly></td><td>   <select value=${
            employeesData[i].departmentId
          } class="js-example-basic-single employee-data-display" name="department" disabled>
          <option value="0">--Select department --</option>
          <option class="departmentName"  value="1">IT</option>
          <option class="departmentName" value="2">HR</option>
          <option class="departmentName" value="3">Management</option>
      </select></td><td class="row-actions"><button class="edit btn btn-sm btn-warning mx-2">Edit</button><button class="save btn btn-sm btn-secondary mx-2">Save</button><input type="hidden" class="edit-action" name="action" value="edit" /><button class="delete btn btn-sm btn-danger">Delete</button><input type="hidden" class="delete-action" name="action" value="delete" />
          </tr>`;
        }
      } else if (employeesData == 0) {
        $(".notification").html(
          "<span class='alert alert-danger mt-3'>No records found in database</span>"
        );
      }

      $("#tbody").html(allRecordsHTML);

      //ADDING SELECTED ATTRIBUTE TO DEPARTMENT CORESSPONDING TO DEPARTMENT ID
      let departmentTemp = $(".employeeRow select");

      for (i = 0; i < departmentTemp.length; i++) {
        let departmentTemp1 = $(departmentTemp)[i];
        let departmentTemp2 = $(departmentTemp1).find(".departmentName");
        let departmentTempValue = $(departmentTemp1).attr("value");
        let departmentName = $(departmentTemp2)[departmentTempValue - 1];
        $(departmentName).attr("selected", "true");
      }
    },
  });
}

showEmploeesData();

//TOGGLE EDIT BUTTON
jQuery(document)
  .off("click.edit")
  .on("click.edit", "table tbody tr .edit", function () {
    //INITIALIZE SELECT2()
    $(".js-example-basic-single").select2();
    let btn = $(this).closest("tr").find(".edit");

    let btnParentRow = $(btn).parent().parent().get(0);

    $(btn).hide();
    let saveBtn = $(this).closest("tr").find(".save");

    $(saveBtn).show();

    let inputs = $(btnParentRow).find("input");

    let fname = $(this).closest("tr").find("input[name='firstName']");
    let lname = $(this).closest("tr").find("input[name='lastName']");
    let email = $(this).closest("tr").find("input[name='email']");
    let department = $(this).closest("tr").find("input[name='department']");

    sameEmail = $(email).val();

    //EDIT FIELDS VALIDATION
    $(this)
      .closest("tr")
      .find("input[name='firstName']")
      .keyup(function () {
        if (fname.val() == 0) {
          $(saveBtn).prop("disabled", "disabled");
          $(".notification").html(
            "<span class='alert alert-danger mt-3'>You cannot update First Name to an empty value!!</span>"
          );
        } else if ($(inputs).val() !== 0) {
          $(saveBtn).removeAttr("disabled");
        }
      });

    $(this)
      .closest("tr")
      .find("input[name='lastName']")
      .keyup(function () {
        if (lname.val() == 0) {
          $(saveBtn).prop("disabled", "disabled");
          $(".notification").html(
            "<span class='alert alert-danger mt-3'>You cannot update Last Name to an empty value!!</span>"
          );
        } else if ($(inputs).val() !== 0) {
          $(saveBtn).removeAttr("disabled");
        }
      });

    $(this)
      .closest("tr")
      .find("input[name='email']")
      .keyup(function () {
        if (email.val() == 0) {
          $(saveBtn).prop("disabled", "disabled");
          $(".notification").html(
            "<span class='alert alert-danger mt-3'>You cannot update Email to an empty value!!</span>"
          );
        } else if ($(inputs).val() !== 0) {
          $(saveBtn).removeAttr("disabled");
        }
      });

    $(this)
      .closest("tr")
      .find("input[name='department']")
      .change(function () {
        if (department.val() == "--Select department --") {
          $(saveBtn).prop("disabled", "disabled");
          $(".notification").html(
            "<span class='alert alert-danger mt-3'>You cannot update Department to an empty value!!</span>"
          );
        } else if ($(inputs).val() !== 0) {
          $(saveBtn).removeAttr("disabled");
        }
      });

    if (inputs.length > 0) {
      $(inputs).each(function () {
        let inputElem = $(this);

        if (inputElem.attr("readonly")) {
          inputElem.removeAttr("readonly");
        } else {
          inputElem.attr("readonly", "readonly");
        }
      });
    }

    $(inputs).css("background-color", "#fff");
    $(this).closest("tr").find("input").first().focus();

    let select = $(btnParentRow).find("select");

    if (select.length > 0) {
      $(select).each(function () {
        let selectElem = $(this);
        if (selectElem.attr("disabled")) {
          selectElem.removeAttr("disabled");
        } else {
          selectElem.attr("disabled", "disabled");
        }
      });
    }
  });

//TOGGLE SAVE BUTTON
jQuery(document)
  .off("click.save")
  .on("click.save", "table tbody tr .save", function () {
    //INITIALIZE SELECT2()
    $(".js-example-basic-single").select2();
    let btn = $(this).closest("tr").find(".save");

    let btnParentRow = $(btn).parent().parent().get(0);

    $(btn).hide();
    let saveBtn = $(this).closest("tr").find(".edit");

    $(saveBtn).show();

    let inputs = $(btnParentRow).find("input");
    if (inputs.length > 0) {
      $(inputs).each(function () {
        let inputElem = $(this);

        if (inputElem.attr("readonly")) {
          inputElem.removeAttr("readonly");
        } else {
          inputElem.attr("readonly", "readonly");
        }
      });
    }

    let select = $(btnParentRow).find("select");
    if (select.length > 0) {
      $(select).each(function () {
        let selectElem = $(this);
        if (selectElem.attr("disabled")) {
          selectElem.removeAttr("disabled");
        } else {
          selectElem.attr("disabled", "disabled");
        }
      });
    }
  });

//DELETE NEW ROW ON CANCEL BTN CLICK
jQuery(document).on("click", "table tbody tr .cancel-new-row", function () {
  let btn = $(this).closest("tr").find(".cancel-new-row");
  let btnParentRow = $(btn).parent().parent().get(0);

  $(btnParentRow).remove();
  $("#global-save").prop("disabled", true);
  $("table tbody tr input").blur(function () {
    $("#global-save").prop("disabled", false);
  });

  if ($(".new-input-row").length == 1) {
    $("#global-save").prop("disabled", false);
  } else if ($(".new-input-row").length > 1) {
    $("#global-save").prop("disabled", false);
  } else {
    $("#global-save").prop("disabled", true);
  }
});

$("#global-save").prop("disabled", true);

jQuery(document).on("click", ".add-employee", function () {
  $(".js-example-basic-single").select2();
});

//RESET NEW ROW FIELDS
jQuery(document).on("click", "table tbody tr .reset-new-row", function () {
  let resetFields = $(this).closest("tr").find("input");
  resetSelect = $(this).closest("tr").find("select");
  $(resetFields).val("");
  $(resetSelect).val("");
  $('.new-input-row input:text[value=""]:first').focus();
});

//ADD NEW EMPLOYEE
function addEmployee() {
  let duplicateEmail = "";
  let saveEmployee = true;
  let allEmployeesDataArr = [];
  let validEmail;
  let validFirstName;
  let validLastName;
  const inputEmails = [];

  $(".new-input-row").each(function (i, n) {
    let firstName = $(this).find('input[name="firstName"]').val();
    let lastName = $(this).find('input[name="lastName"]').val();
    let email = $(this).find('input[name="email"]').val();
    let department = $(this).find('[name="department"]').val();

    action = "insert";

    validEmail = isValidEmail(email);
    validFirstName = isValidName(firstName);
    validLastName = isValidName(lastName);

    duplicateEmail = email;

    employeesData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      department: department,
      action: action,
    };
    allEmployeesDataArr.push(employeesData);
  });

  let newRowInputs = $(".new-input-row .new-employee-input");
  let inputNames = [];
  for (j = 0; j < newRowInputs.length; j++) {
    if ($(newRowInputs[j]).val() == "" || $(newRowInputs[j]).val() == 0) {
      $(newRowInputs[j]).css("border", "3.5px #FF0000 solid");

      inputNames.push($(newRowInputs[j]).attr("name"));
      $('.new-input-row input:text[value=""]:first').focus();
    }
  }
  inputNames = inputNames.map(function (x) {
    return x.toUpperCase();
  });
  for (i = 0; i < allemployeesData.length; i++) {
    if (duplicateEmail == allemployeesData[i].email) {
      saveEmployee = false;
    }
  }
  for (i = 0; i < allEmployeesDataArr.length; i++) {
    if (allEmployeesDataArr[i].email !== "") {
      inputEmails.push(allEmployeesDataArr[i].email);
    }
  }

  if (uniqueEmailInput(inputEmails) == false) {
    $(".notification").html(
      `<span class='alert alert-danger mt-3'>More than one employees cannot have the same email, please enter unique email for each employee</span>`
    );
  } else if (inputNames.length > 0) {
    $(".notification").html(
      `<span class='alert alert-danger mt-3'>Employee record not saved, please enter- ${inputNames}</span>`
    );
  } else if (saveEmployee == false) {
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Employee record not saved, this email address already exists in database, please enter a unique email</span>"
    );
    $(".new-input-row input[type='email']").focus();
  } else if (validEmail == false) {
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Please enter a valid email address</span>"
    );
  } else if (validFirstName == false) {
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>First Name should consist of only alphabets</span>"
    );
  } else if (validLastName == false) {
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Last Name should consist of only alphabets</span>"
    );
  } else {
    let successMsg = "";
    $.ajax({
      url: "PHP/Employee/Employee.php",
      type: "POST",
      data: JSON.stringify(allEmployeesDataArr),
      success: function (response) {
        $("#global-save").prop("disabled", true);
        $(".cancel-new-row").hide();
        if (response == 1) {
          let numofEmployeesMsg = "";
          //$(".notification").hide();
          if (allEmployeesDataArr.length > 1) {
            numofEmployeesMsg = "employees";
          } else {
            numofEmployeesMsg = "employee";
          }
          successMsg = `<span class='alert alert-dark mt-3'>New ${numofEmployeesMsg} added successfully!!</span>`;
        }
        $(".notification").html(successMsg);
        showEmploeesData();
      },
      complete: function () {
        $("#global-save").prop("disabled", true);
      },
    });
  }
}

//DELETE EMPLOYEE RECORD
$("#tbody").on("click", ".delete", function () {
  let btn = $(this).closest("tr").find(".delete");
  let btnParentRow = $(btn).parent().parent().get(0);
  let id = $(btnParentRow).attr("id");

  action = "delete";

  let targetEmployeeData = { id: id, action: action };
  let deleteThis = this;
  let text = "Are you sure you want to delete this employee?";
  if (confirm(text) == true) {
    $.ajax({
      url: "PHP/Employee/Employee.php",
      type: "POST",
      data: targetEmployeeData,
      success: function (data) {
        if (data == 1) {
          $(deleteThis).closest("tr").fadeOut(500);
          $(".notification").html(
            `<span class='alert alert-primary mt-3'>Employee deleted</span>`
          );
        } else if (data == 0) {
          $(".notification").html(
            `<span class='alert alert-primary mt-3'>Error in deleting employee</span>`
          );
          showEmploeesData();
        }
      },
      complete: function () {
        if (allemployeesData.length == 1) {
          window.location.reload();
        }
      },
    });
  } else {
    $(".notification").html(
      `<span class='alert alert-warning mt-3'>Delete action cancelled by user</span>`
    );
  }
});

//UPDATE EMPLYEE RECORD
$("#tbody").on("click", ".save", function () {
  let btn = $(this).closest("tr").find(".save");
  let btnParentRow = $(btn).parent().parent().get(0);

  let id = $(btnParentRow).attr("id");

  let firstName = $(this)
    .closest("table tr")
    .find("td input[name='firstName']")
    .val();

  let lastName = $(this)
    .closest("table tr")
    .find("td input[name='lastName']")
    .val();

  let email = $(this).closest("table tr").find("td input[name='email']").val();

  let department = $(this)
    .closest("table tr")
    .find("td [name='department']")
    .val();

  action = "edit";

  let employeeData = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    department: department,
    action: action,
  };

  for (i = 0; i < allemployeesData.length; i++) {
    emailsArray.push(allemployeesData[i].email);
  }

  validEmail = isValidEmail(email);
  validFirstName = isValidName(firstName);
  validLastName = isValidName(lastName);

  if (
    $.isEmptyObject(employeeData.firstName) ||
    $.isEmptyObject(employeeData.lastName) ||
    $.isEmptyObject(employeeData.email) ||
    employeeData.department == 0
  ) {
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>You cannot update any fields to an empty value!!</span>"
    );
  } else if (email !== sameEmail && emailsArray.includes(email)) {
    $(btn).prop("disabled", "disabled");
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Entered email already exists in database, please enter a unique email address</span>"
    );
  } else if (validEmail == false) {
    $(btn).prop("disabled", "disabled");
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Please enter a valid email address</span>"
    );
  } else if (validFirstName == false) {
    $(btn).prop("disabled", "disabled");
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>First Name should consist of only alphabets</span>"
    );
  } else if (validLastName == false) {
    $(btn).prop("disabled", "disabled");
    $(".notification").html(
      "<span class='alert alert-danger mt-3'>Last Name should consist of only alphabets</span>"
    );
  } else {
    $.ajax({
      url: "PHP/Employee/Employee.php",
      type: "POST",
      data: employeeData,
      success: function (response) {
        if (response == 1) {
          $(".notification").html(
            `<span class='alert alert-primary mt-3'>Employee updated successfully</span>`
          );
        } else {
          $(".notification").html(
            `<span class='alert alert-primary mt-3'>Could not update record</span>`
          );
        }
        showEmploeesData();
      },
    });
  }
});
