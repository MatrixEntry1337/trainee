// array of trainees
var traineeArray = [];
var currentSort;
var toChange;

// ----- Will not need this ------
// ----- JSON when parsed provides array of Trainee objects ------
// function trainee(id, name, major){
//   this.id = id;
//   this.name = name;
//   this.major = major;
// };

/*************** AJAX ***************/
function getAll(handleData){
  $.ajax({
    url:"http://localhost:7001/trainee/ajax/getAll",
    method:"POST",
    dataType: "json",
    success: function(data){
      console.log("AJAX getAll was successful!");
      handleData(data.trainees);
    },
    error: function(){
      console.log("AJAX getAll encountered an error.");
    }
  });
};

function find(handleData){
  $.ajax({
    url:"http://localhost:7001/trainee/ajax/getAll",
    method:"POST",
    dataType: "json",
    success: function(data){
      console.log("AJAX getAll was successful!");
      handleData(data.trainees);
    },
    error: function(){
      console.log("AJAX getAll encountered an error.");
    }
  });
};

function update(trainee){
  $.ajax({
    url: "http://localhost:7001/trainee/ajax/update",
    method: "POST",
    data: trainee,
    error: function(){
      console.log("AJAX update encountered an error");
    }
  }).done(function(){
    console.log("Completed");
  });
};

function insert(trainee, handleData){
  $.ajax({
    url: "http://localhost:7001/trainee/ajax/insert",
    method: "POST",
    dataType: "json",
    data: trainee,
    success: function(data){
      console.log("AJAX insert was successful!");
      handleData(data);
    },
    error: function(){
      console.log("AJAX insert encountered an error.");
    }
  });
};

function deleteTrainee(trainee){
  $.ajax({
    url: "http://localhost:7001/trainee/ajax/delete",
    method: "POST",
    data: trainee,
    error: function(){
      console.log("AJAX delete encountered an error.");
    }
  }).done(function(){
    console.log("Completed");
  });
};

/********************* Display ********************/
function addTraineeDisplay(position,trainee){
  $("#trainee-list")
  .append("<div class='col-sm-4 col-md-4' id='item" + position + "'>"
  + "<div class='thumbnail'>"
  + "<img src='images/person-image.png' alt='Image of Trainee'>"
  + "<div class='caption'>"
  + "<h4>" + trainee.name + "</h4>"
  + "<h5>" + trainee.major+ "</h5>"
  + "<p id='" + position + "'>"
  + "<button type='button' id='delete-trainee' class='btn btn-danger'>Delete</button>"
  + "<button type='button' id='update-trainee' class='btn btn-primary'"
  + "data-toggle='modal' data-target='#myModal'>Update</button></p>");
};

function displayTrainees(){
  $("#trainee-list").empty();
  for(var each in traineeArray){
    addTraineeDisplay(each, traineeArray[each]);
  }
};

function getTrainees(){
  getAll(function(trainees){
    traineeArray = trainees;
    sortAlphabetical();
    console.log("Trainees: " + traineeArray);
    displayTrainees();
  });
};

function addTrainee(handleData){
  var traineeName = $("#traineeName").val();
  var traineeMajor = $("#traineeMajor").val();

  var trainee = JSON.stringify({name: traineeName, major: traineeMajor});
  // console.log("Inserting: " + traineeName + " " + traineeMajor);
  insert(trainee, function(data){
    traineeArray.push(data);
    $("#trainee-list").empty();
    checkSort();
    displayTrainees();
  });
};

/************* Utility *************/
function checkSort(){
  switch(currentSort){
    case 1:
      sortAlphabetical();
      break;
    case 2:
      sortMajor();
      break;
    case 3:
      dateJoined();
      break;
    case 4:
      dateJoinedReverse();
      break;
    default:
      dateJoinedReverse();
  }
}

function sortAlphabetical(){
  traineeArray.sort(function(a,b){
    return a.name.localeCompare(b.name);
  });
  currentSort = 1;
};

function sortMajor(){
  traineeArray.sort(function(a,b){
      return a.major.localeCompare(b.major);
  });
  currentSort = 2
};

function dateJoined(){
  traineeArray.sort(function(a,b){
    return a.id - b.id;
  });
  currentSort = 3;
};

function dateJoinedReverse(){
  traineeArray.sort(function(a,b){
    return b.id - a.id;
  });
  currentSort = 4;
};

/****************** Main *****************/
function main(){
  console.log("Welcome to the Trainee Application: ");
  // get all trainees when the app starts
  getTrainees();

  // add trainee when form is submitted
  $("#traineeForm").submit(function(){
    event.preventDefault();
    addTrainee();
  });

  //delete trainee
  $("#trainee-list").on("click", "#delete-trainee", function(){
    console.log($(this).parent().attr('id'));
    var num = $(this).parent().attr('id');
    var toDelete ="#item" + num;
    $(toDelete).remove();
    deleteTrainee(JSON.stringify(traineeArray[num]));
  });

  /************ Update *************/
  $("#trainee-list").on("click", "#update-trainee", function(){
    console.log($(this).parent().attr('id'));
    var num = $(this).parent().attr('id');
    var toUpdate="#item" + num;
    $("#trainee-update").empty();
    $('#trainee-update').append("<div class='form-group'>"
      + "<label for='traineeName'>Trainee Name</label>"
      + "<input type='text' class='form-control' id='traineeNameChange'"
      + "placeholder='"+ traineeArray[num].name +"' required>"
      + "</div>"
      + "<div class='form-group'>"
      + "<label for='traineeMajor'>Trainee Major</label>"
      + "<input type='text' class='form-control' id='traineeMajorChange'"
      + "placeholder='" + traineeArray[num].major + "' required>"
      + "</div>");
      toChange = num;
  });

  $('#trainee-change').click(function(){
    traineeArray[toChange].name = $("#traineeNameChange").val();
    traineeArray[toChange].major = $("#traineeMajorChange").val();
    console.log(traineeArray[toChange]);
    var jsonTrainee = JSON.stringify(traineeArray[toChange]);
    update(jsonTrainee);
    displayTrainees();
  });

  /**************** Sort *****************/
  $("#sortAB").click(function(){
    console.log("Test");
    sortAlphabetical();
    displayTrainees();
  });

  $("#sortMajor").click(function(){
    console.log("Test");
    sortMajor();
    displayTrainees();
  });

  $("#sortJoined").click(function(){
    console.log("Test");
    dateJoined();
    displayTrainees();
  });

  $("#sortJoinedReverse").click(function(){
    console.log("Test");
    dateJoinedReverse();
    displayTrainees();
  });
};

/************ Activate Main ***********/
$(document).ready(main());
