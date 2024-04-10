

const addAppBtn = document.querySelector(".add-new"); 
const backFormBtn = document.querySelector(".back");
const toggleTableSection = document.querySelector("#table-section"); 
const addForm = document.querySelector("#addNewAppointment");
const containerTitle = document.querySelector(".container-title");

addAppBtn.addEventListener("click", () => {
    toggleTableSection.style.display = "none";
    addForm.style.display = "block";
    addAppBtn.style.display ="none";
    backFormBtn.style.display= "block";
    containerTitle.innerHTML = "Appointment <b>Form</b>"

});


backFormBtn.addEventListener("click", ()=>{
    toggleTableSection.style.display = "block";
    addForm.style.display = "none";
    addAppBtn.style.display ="block";
    backFormBtn.style.display= "none";
    containerTitle.innerHTML = "Appointment <b>Details</b>"
})


const viewBtn = document.querySelector(".scrollto")
const  searchSection = document.querySelector("#search-container");

viewBtn.addEventListener("click", ()=>{
    searchSection.scrollIntoView({ behavior: "smooth", block: "start"});
})