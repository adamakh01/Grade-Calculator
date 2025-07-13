//initalizes all the variables
var studentUser = "";
var password = "";
var classes = [];
var classOfAssignment = [];
var assignments = [];
var assignmentGrades = [];
var assignmentTypes = [];
var assignmentTypeChoice = ["Assignment Type", "Tests/Projects", "Quizzes", "Homework"];
setProperty("incorrectText", "hidden",true);
setProperty("createAccountError", "hidden", true);

//login screen elements
//proceeds once user enters correct login information
onEvent("proceedButton", "click", function( ) {
  var userInput = getText("userNameText");
  var passwordInput = getText("passwordText");
  if((userInput == studentUser) && (passwordInput == password)){
    goMain();
  } else{
    setProperty("incorrectText", "hidden",false);
  }
  loginClearText();
});

//create account if there is no account
onEvent("createAccountButton", "click", function( ){
  setScreen("createAccountScreen");
  setProperty("createAccountError", "hidden", true);
});


//create account screen
//sets the studentUser variable and the password variable based on input
onEvent("createAccount", "click", function( ){
  setProperty("incorrectText", "hidden",true);
  var newUserInput = getText("newUsername");
  var newPasswordInput = getText("newPassword");
  if((newUserInput == studentUser) || (newPasswordInput == password)){
    setProperty("createAccountError", "hidden", false);
  } else{
    setScreen("loginScreen");
    studentUser = newUserInput;
    password = newPasswordInput;
    loginClearText();
  }
});

//goes back to login
onEvent("backLoginButton", "click", function( ){
  setScreen("loginScreen");
  loginClearText();
});

//mainScreen elements
//updates screen based on class chosen
onEvent("classDropDown", "input", function( ){
  updateMainScreen();
});

//opens the add class screen
onEvent("addClassButton", "click", function( ){
  setScreen("addClassScreen");
  
});

//add class screen elements
//adds a list to the classes lists
onEvent("addClass", "click", function( ){
  var className = getText("classNameText");
  if(className != ""){
    appendItem(classes, className);
    var listOfClassesText = "";
    for(var i = 0; i < classes.length; i++){
      listOfClassesText = listOfClassesText + classes[i] + "\n";
    }
    setProperty("listOfClassesCurrent", "text", listOfClassesText);
    mainClearText();
  }
});

//return to mainapp button
onEvent("toMainApp", "click", function( ){
  goMain();
});

//add assignment elements
onEvent("addAssignmentButton", "click", function( ){
  if(classes.length != 0){
    goAddAssignment();
  }
});

//once user inputs the class options based on classes list, add class screen updates
onEvent("classOptionAssignment", "input", function( ){
  updateAddScreen();
});

//adds assignment based on input and appends the assignment to the assignments and their element lists
onEvent("addAssignment", "click", function( ){
  var assignmentName = getText("assignmentNameText");
  var classAssignment = getText("classOptionAssignment");
  var assignmentPointEarned = getNumber("actualPointText");
  var assignmentPointMax = getNumber("maxPointText");
  var calculatedGrade = Math.round((assignmentPointEarned/assignmentPointMax)*100);
  var weightAssignment = getText("weightDropDown");
  appendItem(assignments, assignmentName);
  appendItem(classOfAssignment, classAssignment);
  appendItem(assignmentGrades, calculatedGrade);
  appendItem(assignmentTypes, weightAssignment);
  updateAddScreen();
});

//go back to main
onEvent("assingmentToMain", "click", function( ){
  goMain();
});

//edit assignment elements
//go to edit class screen
onEvent("editClassButton", "click", function( ){
  goEditAssignment();
});

//update editScreen based on dropdown input
onEvent("classEditDropdown", "input", function( ){
  updateEditScreen();
});

//update screen based on assignment being edited
onEvent("assignmentEditDropdown", "input", function( ){
  updateEditScreen();
});

//calls the editAssignment function changes the assignment information and updates the screen based on the edit
onEvent("saveAssignmentButton", "click", function ( ){
  var pointsEarned = getNumber("newActualPointText");
  var newMaxPoint = getNumber("newMaxPoint");
  var newType = getText("assignmentTypeEditDropBox");
  var score = (pointsEarned/newMaxPoint) * 100;
  editAssignment(getText("classEditDropdown"), getText("assignmentEditDropdown"), score, newType);
  updateEditScreen();
});

//calls the delete assignent function and updates the edit screen
onEvent("deleteAssignmentButton", "click", function( ){
  deleteAssignment(getText("classEditDropdown"), getText("assignmentEditDropdown"));
  updateEditScreen();
});

//back to main screen
onEvent("toMainScreenButton", "click", function( ){
  goMain();
});

//edit assignment method, takes classChosen, assignmentChosen, and updates based on score and type inputted
function editAssignment(classChosen, assignmentChosen, score, type){
  for(var i = 0; i < assignments.length; i++){
    if(classChosen == classOfAssignment[i] && (assignmentChosen == assignments[i]))
    {
      assignmentGrades[i] = score;
      assignmentTypes[i] = type;
    }
  }
  
}

//delete assignment method, takes classChosen, and updates based on assignment chosen
function deleteAssignment(classChosen, assignmentChosen){
  for(var i = 0; i < assignments.length; i++){
    if(classChosen == classOfAssignment[i] && (assignmentChosen == assignments[i]))
    { 
      removeItem(classOfAssignment, i);
      removeItem(assignments, i);
      removeItem(assignmentGrades, i);
      removeItem(assignmentTypes, i);
    }
  }
}


//list related
//sorts assignment list and class of the assignment list based on class chosen
function sortAssignment(chosenClass, classList, classAssignment){
  var sortedAssignmentsByClass = [];
  for(var i = 0; i < classList.length; i++){
    if(classList[i] == chosenClass){
      appendItem(sortedAssignmentsByClass, classAssignment[i]);
    }
  }
  return sortedAssignmentsByClass;
}

//sorts scores list and class of the assignment list based on class chosen
function sortScores(chosenClass, classList, assignmentScores){
  var sortedScores = [];
  for(var i = 0; i < classList.length; i++){
    if(classList[i] == chosenClass){
      appendItem(sortedScores, assignmentScores[i]);
    }
  }
  return sortedScores;
}

//sorts assignment type list and class of assignment list based on chosen class
function sortAssignmentType(chosenClass, classList, assignmentType){
  var sortedAssignmentTypes = [];
  for(var i = 0; i < classList.length; i++){
    if(classList[i] == chosenClass){
      appendItem(sortedAssignmentTypes, assignmentType[i]);
    }
  }
  return sortedAssignmentTypes;
}

function calculateGrade(scoreSorted, typeSorted){
  var totalScore = 0;
  var maxScores = 0;
  var finalPercentage = 0;
  var testsProjects = [];
  var quizzes = [];
  var homework = [];
  var finalGrade = "N/A";
  var finalPercentageGrade = 0;
  for(var i = 0; i < typeSorted.length; i++){
    if(typeSorted[i] == "Tests/Projects"){
      appendItem(testsProjects, scoreSorted[i]);
    }
    else if(typeSorted[i] == "Quizzes"){
      appendItem(quizzes, scoreSorted[i]);
    }
    else if(typeSorted[i] == "Homework"){
      appendItem(homework, scoreSorted[i]);
    }
  } 
  for(i = 0; i < testsProjects.length; i++){
    totalScore = totalScore + testsProjects[i];
    maxScores = testsProjects.length;
    finalPercentage = totalScore/maxScores;
  }
  var testPercentage = (finalPercentage * 70)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentage = 0;
  for(i = 0; i < quizzes.length; i++){
    totalScore = totalScore + quizzes[i];
    maxScores = quizzes.length;
    finalPercentage = totalScore/maxScores;
  }
  var quizPercentage = (finalPercentage * 20)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentage = 0;
  for(i = 0; i < homework.length; i++){
    totalScore = totalScore + homework[i];
    maxScores = homework.length;
    finalPercentage = totalScore/maxScores;
  }
  var homeworkPercentage = (finalPercentage * 10)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentageGrade = Math.round(testPercentage + quizPercentage + homeworkPercentage);
  var maxPercentage = 100;
  if(testsProjects.length == 0){
    testPercentage = 70;
    maxPercentage = maxPercentage - 70;
    finalPercentageGrade = finalPercentageGrade;
  }
  if(quizzes.length == 0){
    quizPercentage = 20;
    maxPercentage = maxPercentage - 20;
    finalPercentageGrade = finalPercentageGrade;
  }
  if(homework.length == 0){
    homeworkPercentage = 10;
    maxPercentage = maxPercentage - 10;
    finalPercentageGrade = finalPercentageGrade;
  }
  finalPercentageGrade = Math.round((finalPercentageGrade / maxPercentage)*100);


  if(finalPercentageGrade >= 90){
    finalGrade = "A";
  }
  else if(finalPercentageGrade >= 80){
    finalGrade = "B";
  }
  else if(finalPercentageGrade >= 70){
    finalGrade = "C";
  }
  else if(finalPercentageGrade >= 60){
    finalGrade = "D";
  }
  else if(finalPercentageGrade >= 0){
    finalGrade = "F";
  }
  if((testsProjects.length == 0)&&(quizzes.length == 0)&&(homework.length == 0)){
    finalPercentageGrade = 0;
  }
  return finalGrade + " " + finalPercentageGrade + "%";
}

//calculate the assignment type percentages based on score sorted and type sorted
function returnAssignmentTypePercentages(scoreSorted, typeSorted){
  var totalScore = 0;
  var maxScores = 0;
  var finalPercentage = 0;
  var testsProjects = [];
  var quizzes = [];
  var homework = [];
  var finalPercentageGrade = 0;
  for(var i = 0; i < typeSorted.length; i++){
    if(typeSorted[i] == "Tests/Projects"){
      appendItem(testsProjects, scoreSorted[i]);
    }
    else if(typeSorted[i] == "Quizzes"){
      appendItem(quizzes, scoreSorted[i]);
    }
    else if(typeSorted[i] == "Homework"){
      appendItem(homework, scoreSorted[i]);
    }
  } 
  for(i = 0; i < testsProjects.length; i++){
    totalScore = totalScore + testsProjects[i];
    maxScores = testsProjects.length;
    finalPercentage = totalScore/maxScores;
  }
  var testPercentage = (finalPercentage * 70)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentage = 0;
  for(i = 0; i < quizzes.length; i++){
    totalScore = totalScore + quizzes[i];
    maxScores = quizzes.length;
    finalPercentage = totalScore/maxScores;
  }
  var quizPercentage = (finalPercentage * 20)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentage = 0;
  for(i = 0; i < homework.length; i++){
    totalScore = totalScore + homework[i];
    maxScores = homework.length;
    finalPercentage = totalScore/maxScores;
  }
  var homeworkPercentage = (finalPercentage * 10)/100;
  totalScore = 0;
  maxScores = 0;
  finalPercentageGrade = Math.round(testPercentage + quizPercentage + homeworkPercentage);
  
  //filters if there are no assignment for that particular type
  if(testsProjects.length == 0){
    testPercentage = "N/A";
  }
  if(quizzes.length == 0){
    quizPercentage = "N/A";
  }
  if(homework.length == 0){
    homeworkPercentage = "N/A";
  }
  return "Test/Projects: " + testPercentage + "\n" + "Quizzes: " + quizPercentage + "\n" + "Homework: " + homeworkPercentage + "\n";
}


//UI Related
function loginClearText(){
  setProperty("userNameText", "text", "");
  setProperty("passwordText", "text", "");
  setProperty("newUsername", "text", "");
  setProperty("newPassword", "text", "");
}

function mainClearText(){
  setProperty("classNameText", "text", "");
  setProperty("noteTextClass", "text", "");
  setProperty("assignmentNameText", "text", "");
  setProperty("actualPointText", "text", "");
  setProperty("maxPointText", "text", "");
}

//screen related
function goMain(){
  if(classes.length == 0){
    setProperty("noClassLabel", "hidden", false);
  } else{
  setProperty("noClassLabel", "hidden", true);
  }
  if (classes.length != 0){
    setProperty("classDropDown", "options", classes);
  }
  else{
    setProperty("classDropDown", "text", "Press the add class button");
  }
  mainClearText();
  setScreen("mainAppScreen");
  updateMainScreen();
}

function goAddAssignment(){
  setProperty("classOptionAssignment", "options", classes);
  setProperty("weightDropDown", "options", assignmentTypeChoice);
  setScreen("addAssignmentScreen");
  updateAddScreen();
  
}

function goEditAssignment(){
  setProperty("classEditDropdown", "options", classes);
  setScreen("editClassScreen");
  updateEditScreen();
}

//updates elements on the add assignment screen using calculateGrade, sortScores, sortAssignmentType, and sortAssignment functions
function updateAddScreen(){
  var classAssignment = getText("classOptionAssignment");
  var sortedAssignment = sortAssignment(classAssignment, classOfAssignment, assignments);
  var sortedScores = sortScores(classAssignment, classOfAssignment, assignmentGrades);
  var sortedAssignmentType = sortAssignmentType(classAssignment, classOfAssignment, assignmentTypes);
  var grade = calculateGrade(sortedScores, sortedAssignmentType);
  var assignmentText = "";
  var scoreText = "";
  setProperty("classInformationGrade", "text", classAssignment + ": " + grade);
  for(var i = 0; i < sortedAssignment.length; i++){
    assignmentText = assignmentText + sortedAssignment[i] + "\n";
    scoreText = scoreText + sortedScores[i] + "\n";
  }
  setProperty("assignmentListAdd", "text", assignmentText);
  setProperty("gradeListAdd", "text", scoreText);
}

//update elements on the main screen using sortAssignment, sortScores, calculateGrade, sortAssignmentType, and returnAssignmentTypePercentages functions
function updateMainScreen(){
  var classPicked = getText("classDropDown");
  var sortedAssignment = sortAssignment(classPicked, classOfAssignment, assignments);
  var sortedScores = sortScores(classPicked, classOfAssignment, assignmentGrades);
  var sortedAssignmentType = sortAssignmentType(classPicked, classOfAssignment, assignmentTypes);
  var grade = calculateGrade(sortedScores, sortedAssignmentType);
  var assignmentScoreText = "";
  var typesPercentage = returnAssignmentTypePercentages(sortedScores, sortedAssignmentType);
  for(var i = 0; i < sortedAssignment.length; i++){
    if(sortedAssignmentType[i] == "Assignment Type"){
      sortedAssignmentType[i] = "NOT GRADED";
    }
    assignmentScoreText = assignmentScoreText + sortedAssignment[i] + " - " + sortedScores[i] + " (" + sortedAssignmentType[i] + ")\n";
  }
  setProperty("classGrade", "text", grade);
  setProperty("Class", "text", classPicked);
  setProperty("assignmentAndGradeTEXT", "text", assignmentScoreText);
  setProperty("percentageText", "text", typesPercentage);
}

//updates edit assignment screen based on sortAssignment, sortScores, sortAssignment, sortAssignmentType, and calculateGrade functions
function updateEditScreen(){
  var classPicked = getText("classEditDropdown");
  var sortedAssignment = sortAssignment(classPicked, classOfAssignment, assignments);
  setProperty("assignmentEditDropdown", "options", sortedAssignment);
  var pickedScore = "N/A";
  var pickedType = "N/A";
  var pickedAssignment = getText("assignmentEditDropdown");
  var sortedScores = sortScores(classPicked, classOfAssignment, assignmentGrades);
  var sortedAssignmentType = sortAssignmentType(classPicked, classOfAssignment, assignmentTypes);
  var grade = calculateGrade(sortedScores, sortedAssignmentType);
  setProperty("editPercentagesTypeText", "text", returnAssignmentTypePercentages(sortedScores, sortedAssignmentType));
    for(var i = 0; i < sortedAssignment.length; i++){
    if(pickedAssignment == sortedAssignment[i]){
      pickedScore = sortedScores[i];
      pickedType = sortedAssignmentType[i];
      }
    }
  
  if(pickedType != "Assignment Type"){
    setProperty("assignmentEditText", "text", pickedAssignment + " - " + pickedScore + " (" + pickedType + ")");
  }
  else{
    setProperty("assignmentEditText", "text", pickedAssignment + " - " + pickedScore + " (" + "NOT GRADED" + ")");
  }
  setProperty("finalGradeClassText", "text", classPicked + " (" + grade + ") ");
}
