var rowType;

$(document).ready(function() {
    console.log("Howdy!"); 
    
    //retrieve database items on page load.
    $.ajax({
        url: "/dbRead",
        type: "post",
        success: function(resp) {
            renderExpenses(resp);
        }
    });
    
    var enterButton = document.getElementById("exEnter");
    var nameInp = document.getElementById("exName");
    var costInp = document.getElementById("exCost");
    var catInp = document.getElementById("exCat");
    
    enterButton.addEventListener("click", function() {
        var validInputs = true;
        if(nameInp.value == "") { 
            highlightInput(nameInp);
            validInputs = false;
        }
        if(costInp.value == "") {
            highlightInput(costInp);
            validInputs = false;
        }
        if(catInp.value == "")  {
            highlightInput(catInp);
            validInputs = false;
        }
        if(validInputs) {
            writeToDatabase(nameInp.value, costInp.value, catInp.value, function(updatedDatabase) {
                console.log(updatedDatabase);
                renderExpenses(updatedDatabase);
            })
        }
    });
});

function highlightInput(element) {
    element.style.border = "solid 2px #ff0000";
    element.addEventListener("focus", function() {
        element.removeAttribute("style");       
    });
}

//Manages the list rendering. Determines what to render depending on the items in the database.
function renderExpenses(data) {
    document.getElementById("expenseList").innerHTML = "";
    if(data.length <= 0) {
        document.getElementById("expenseList").innerHTML = "No Expenses Tracked!";
    }
    else {
        generateListHeader();
        rowType = true;
        data.forEach(x => {
            generateExpenses(x.ID, x.Name, x.Cost, x.Category);
        });
    }
}

//Generates the header for the list.
function generateListHeader() {
    var parent = document.getElementById("expenseList");
    var colClass = "exItem col-3 ml-auto";
    
    var row = document.createElement("div");
    row.setAttribute("class", "row exRows");
    row.setAttribute("ID", "Ident");
    
    var nCol = document.createElement("div");
    nCol.setAttribute("class", colClass);
    nCol.innerHTML = "Name";
    row.appendChild(nCol);
    
    var cCol = document.createElement("div");
    cCol.setAttribute("class", colClass);
    cCol.innerHTML = "Cost ($)";
    row.appendChild(cCol);
    
    var catCol = document.createElement("div");
    catCol.setAttribute("class", colClass);
    catCol.innerHTML = "Category";
    row.appendChild(catCol);
    
    var delCol = document.createElement("div");
    delCol.setAttribute("class", "exItem col-2 ml-auto");
    delCol.setAttribute("ID", "delCol");
    row.appendChild(delCol);
    
    parent.appendChild(row);
}

//generates the html elements and appends them to the expense list.
function generateExpenses(id, name, cost, category) {
    var parent = document.getElementById("expenseList");
    var rName = "rowType2";
    var colClass = "exItem col-3 ml-auto";
    
    var nameClean = name.toString().replace(/[|&;$%@"<>()+,]/g, "");
    var costClean = cost.toString().replace(/[|&;$%@"<>()+,]/g, "");
    var categoryClean = category.toString().replace(/[|&;$%@"<>()+,]/g, "");
    
    
    var row = document.createElement("div");
    if(rowType) rName = "rowType1";
    row.setAttribute("class", "row exRows " + rName);
    
    var nCol = document.createElement("div");
    nCol.setAttribute("ID", "name");
    nCol.setAttribute("class", colClass);
    nCol.innerHTML = nameClean;
    row.appendChild(nCol);
    
    var cCol = document.createElement("div");
    cCol.setAttribute("ID", "cost");
    cCol.setAttribute("class", colClass);
    cCol.innerHTML = costClean;
    row.appendChild(cCol);
    
    var catCol = document.createElement("div");
    catCol.setAttribute("ID", "category");
    catCol.setAttribute("class", colClass);
    catCol.innerHTML = categoryClean;
    row.appendChild(catCol);
    
    var delCol = document.createElement("img");
    delCol.setAttribute("ID", "delete");
    delCol.setAttribute("class", "exItem col-2 ml-auto");
    delCol.setAttribute("src", "images/delete_icon_white.png");
    delCol.addEventListener("click", function() {
        deleteFromDatabase(id, function(updatedDatabase) {
            renderExpenses(updatedDatabase);
        });
    });
    row.appendChild(delCol);
    
    parent.appendChild(row);
    rowType = !rowType;
}

//Writes information to the database.
function writeToDatabase(name, cost, category, callback) {
    $.ajax({
        url: "/dbWrite",
        type: "post",
        data: {
            Name: name,
            Cost: cost,
            Category: category
        },
        success: function(resp) {
            console.log("RESP: " + resp);
            if(resp != undefined) {
                callback(resp);
            } else {
                console.log(resp.status);
            }
        }
        
    });
}

//Deletes information from the database.
function deleteFromDatabase(ID, callback) {
    $.ajax({
        url: "/dbDelete",
        type: "post",
        data: {
            id: ID
        },
        success: function(resp) {
            if(resp != undefined) {
                console.log("I should redraw...");
                callback(resp);
            } else {
                console.log("error");
                console.log(resp.status);
            }
        }
    })
}