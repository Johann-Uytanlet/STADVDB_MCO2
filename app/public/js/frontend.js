

const addAppBtn = document.querySelector(".add-new");
const backFormBtn = document.querySelector(".back");
const toggleTableSection = document.querySelector("#table-section");
const addForm = document.querySelector("#addNewAppointment");
const containerTitle = document.querySelector(".container-title");
const nextpageSection = document.querySelector(".next-page-section");
const showMessage = document.querySelector(".show-insert-status")

addAppBtn.addEventListener("click", () => {
    toggleTableSection.style.display = "none";
    addForm.style.display = "block";
    addAppBtn.style.display = "none";
    backFormBtn.style.display = "block";
    containerTitle.innerHTML = "Appointment <b>Form</b>";
    nextpageSection.style.display = "none";
    nextpageSection.classList.remove('d-flex');

});

backFormBtn.addEventListener("click", () => {
    toggleTableSection.style.display = "block";
    addForm.style.display = "none";
    addAppBtn.style.display = "block";
    backFormBtn.style.display = "none";
    containerTitle.innerHTML = "Appointment <b>Details</b>"
    nextpageSection.style.display = "block";
    nextpageSection.classList.add('d-flex');
    showMessage.innerHTML = "";
    showMessage.classList.remove("success");
})


const viewBtn = document.querySelector(".scrollto")
const searchSection = document.querySelector("#search-container");

viewBtn.addEventListener("click", () => {
    searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
})

// Pages

const prevPageBtn = document.getElementById("prevBtn");


const nextPageBtn = document.getElementById("nextBtn");

nextPageBtn.addEventListener("click", () => {
    const currentPageNumber = parseInt(document.getElementById("page-number").value);
    console.log(currentPageNumber);
    const nextPageNumber = currentPageNumber + 1;
    const tbody = document.querySelector('#table-section tbody');



    if (nextPageNumber >= 1) {
        tbody.innerHTML = ''; 

        fetch(`/homepage?page=${nextPageNumber}`)
            .then(response => response.json() )
            .then(data => {
                document.getElementById("page-number").value = nextPageNumber;
                data.viewApp.forEach(element => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${element.apptid}</td>
                            <td>${element.status}</td>
                            <td>${element.TimeQueued}</td>
                            <td>${element.QueueDate}</td>
                            <td>${element.StartTime}</td>
                            <td>${element.EndTime}</td>
                            <td>${element.type}</td>
                            <td>${element.IsVirtual}</td>
                            <td>${element.MajorIsland}</td>
                            <td>${element.hospitalname}</td>
                            <td>${element.IsHospital}</td>
                        </tr>
                    `;
                });
            });
    }
});

prevPageBtn.addEventListener("click", () => {
    const currentPageNumber = parseInt(document.getElementById("page-number").value);
    console.log(currentPageNumber);
    const nextPageNumber = currentPageNumber - 1;
    const tbody = document.querySelector('#table-section tbody');



    if (nextPageNumber >= 1) {
        tbody.innerHTML = ''; 

        fetch(`/homepage?page=${nextPageNumber}`)
            .then(response => response.json() )
            .then(data => {
                document.getElementById("page-number").value = nextPageNumber;
                data.viewApp.forEach(element => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${element.apptid}</td>
                            <td>${element.status}</td>
                            <td>${element.TimeQueued}</td>
                            <td>${element.QueueDate}</td>
                            <td>${element.StartTime}</td>
                            <td>${element.EndTime}</td>
                            <td>${element.type}</td>
                            <td>${element.IsVirtual}</td>
                            <td>${element.MajorIsland}</td>
                            <td>${element.hospitalname}</td>
                            <td>${element.IsHospital}</td>
                        </tr>
                    `;
                });
            });
    }

});

function showNode(item) {
    document.getElementById("nodeDropdown").innerHTML = item.innerHTML;
};