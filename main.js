//Functions
//1.To create a modal when the user clicks on plus button
//Modal Functions
//1.Set Priority colors
//2.unique id to task
//3.Set priority color to task
//4.Set modal to default
//5.set default priority color
//Ticket Functionality
//1.Priority color tag
//2.Handle lock
//3.Handle removal
//Tool box priority filtering
// single click filter
// double click display all

let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let toolBoxAction = document.querySelector(".toolBox-action");
let mainCont = document.querySelector(".main-container");
let addFlag = false;
let modalBtn = document.querySelector(".modal-btn");
let textArea = document.querySelector(".textarea-cont");
let colors = ["color-1", "color-2", "color-3", "color-4"];
let modalPriorityColor = colors[colors.length - 1];
let allPriorityColors = document.querySelectorAll(".priority-color");
let removeFlag = false;
let removeBtn = document.querySelector(".remove-btn");
let lockClass = "fa-lock";
let unlockClass = "fa-unlock";
let toolBoxColors = document.querySelectorAll(".color-box");
let ticketsArr = [];

if (localStorage.getItem("Jira Tickets")) {
  // retrieve and display tickets

  ticketsArr = JSON.parse(localStorage.getItem("Jira Tickets"));
   ticketsArr.forEach((ticket) => {
    createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId);
  });
}

for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", (e) => {
    let currentToolBoxColor = toolBoxColors[i].classList[1];
    console.log(currentToolBoxColor);
    console.log(ticketsArr);
    let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
      return currentToolBoxColor === ticketObj.ticketColor;
    });

    let allTicketsCont = document.querySelectorAll(".ticket-cont");
    //Remove Previous Tickets
    for (let j = 0; j < allTicketsCont.length; j++) {
      allTicketsCont[j].remove();
    }
    //Display New Filtered Tickets
    console.log(filteredTickets);
    filteredTickets.forEach((ticketElem, idx) => {
      createTicket(
        ticketElem.ticketColor,
        ticketElem.ticketTask,
        ticketElem.ticketId
      );
    });
  });
}

//listener for modal priority color
allPriorityColors.forEach((colorElem, idx) => {
  colorElem.addEventListener("click", (e) => {
    allPriorityColors.forEach((color, idx) => {
      color.classList.remove("active");
    });
    colorElem.classList.add("active");
    modalPriorityColor = colorElem.classList[1];
  });
});
//ADD button
addBtn.addEventListener("click", (e) => {
  //Display Modal
  // when addFlag true // display modal
  addFlag = !addFlag;
  if (addFlag) {
    modalCont.style.display = "flex";
    allPriorityColors.forEach((colorElem, idx) => {
      colorElem.classList.remove("active");
    });
    allPriorityColors[allPriorityColors.length - 1].classList.add("active");
    modalPriorityColor = colors[colors.length - 1];
  } else {
    modalCont.style.display = "none";
  }
  modalPriorityColor = colors[colors.length - 1];
});
//Remove button
removeBtn.addEventListener("click", (e) => {
  removeFlag = !removeFlag;
  console.log(removeFlag);
});
modalBtn.addEventListener("click", (e) => {
  createTicket(modalPriorityColor, textArea.value);
  modalCont.style.display = "none";
  //textArea.innertext = "";// cannot do it like this
  //text area is special container which store data in  value
  textArea.value = "";
  addFlag = false; // IMPORTANT
});

modalCont.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key === "Shift") {
    createTicket(modalPriorityColor, textArea.value);
    modalCont.style.display = "none";
    //textArea.innertext = "";// cannot do it like this
    //text area is special container which store data in  value
    textArea.value = "";
    addFlag = false; // IMPORTANT
  }
});

//Genrate Ticket
function createTicket(ticketColor, ticketTask, ticketId) {
  let id = ticketId || shortid();

  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = ` 
      <div class = "ticket-cont">
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">
        Ticket Id:-${id}
        </div>
        <div class="task-area">
        ${ticketTask}
        </div>
        <div class="task-info">
         <span>Created At:- ${new Date().toLocaleDateString()}</span>
         <div class="ticket-lock"> 
         <i class="fa fa-lock" aria-hidden="true"></i>
         </div>
        </div>
      </div>
      
      `;
  mainCont.appendChild(ticketCont);

  //create object of ticket and add to array
  if (!ticketId) {
    ticketsArr.push({
      ticketColor,
      ticketTask,
      ticketId: id,
    });
    localStorage.setItem("Jira Tickets", JSON.stringify(ticketsArr));
  }

  ticketCont.addEventListener("click", (e) => {
    handleRemoval(ticketCont, id);
  });
  handleLock(ticketCont, id);
  // handleColor(ticketCont, ticketColor);
}

function handleRemoval(ticket, id) {
  if (removeFlag) {
    console.log("removed");
    let idx = getTicketIdx(id);
    ticketsArr.splice(idx, 1);
    let stringTicketsArray = JSON.stringify(ticketsArr);
    localStorage.setItem("Jira Tickets", stringTicketsArray);
    ticket.remove();
  }
}

function handleLock(ticket, id) {
  //you can only select ticket element when its created
  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLock = ticketLockElem.children[0];
  let ticketTaskArea = ticket.querySelector(".task-area");
  let ticketColor = ticket.querySelector(".ticket-color");
  ticketLock.addEventListener("click", (e) => {
    if (ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "true");
      let tickIdxLock = getTicketIdx(id);
      ticketsArr[tickIdxLock].ticketTask = ticketTaskArea.innerText;
      localStorage.setItem("Jira Tickets", JSON.stringify(ticketsArr));

      //handle color

      ticketColor.addEventListener("click", (e) => {
        //get ticket index from ticket array
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        //Get ticket color index
        let currentTicketColorIdx = colors.findIndex((color) => {
          return currentTicketColor === color;
        });
        // console.log(currentTicketColor, currentTicketColorIdx);
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        // console.log(newTicketColorIdx)
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        // modify data in locat storage

        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("Jira Tickets", JSON.stringify(ticketsArr));
      });
    } else {
      ticketLock.classList.add(lockClass);
      ticketLock.classList.remove(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");

      let tickIdxLock = getTicketIdx(id);
      ticketsArr[tickIdxLock].ticketTask = ticketTaskArea.innerText;
      localStorage.setItem("Jira Tickets", JSON.stringify(ticketsArr));
    }
  });
}

function getTicketIdx(id) {
  let ticketIdx = ticketsArr.findIndex((ticketObj) => {
    return ticketObj.ticketId === id;
  });
  return ticketIdx;
}
