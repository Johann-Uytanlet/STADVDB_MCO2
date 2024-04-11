
const searchSubmitBtn = document.querySelector("#search-btn");
const inputSearch = document.querySelector("#appointment_id_search");
const displaySearchedAppointment = document.querySelector(".display-searched-appointment");

let searchResults = {};

async function fetchPost(endpoint, formData) {
    let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then();

    return response;
};

searchSubmitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const getAllCurrentSearch = document.querySelectorAll("#display-section");
    const notAllFoundMessage = document.querySelectorAll(".id-notfound");

    // RESET
    displaySearchedAppointment.innerHTML = "";
    displaySearchedAppointment.classList.remove("success");

    const appID = inputSearch.value;

    fetch('/getAppointment', {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify({ apptid: appID })
    }).then(response => {
        if (response.ok) {
            // Parse the JSON response
            return response.json();
        } else {
            // If the response is not successful, throw an error
            throw new Error('Failed to fetch appointment data');
        }
    }).then(data => {
        if (Object.keys(data).length > 0) {
            const result = data;
            
            console.log((result));

            for(let key in result){
                if (typeof result[key] === 'string' && result[key].endsWith('Z')) {
                    // Convert the UTC timestamp to local time zone
                    const utcTimestamp = new Date(result[key]);
                    const localTimestamp = utcTimestamp.toLocaleString();
                    // Replace the UTC timestamp with the local time zone string
                    result[key] = localTimestamp;
                }
            }
            const html =
                `
            <table class="table table-hover" id="display-section">
            <thead>
            <tr>
                <th>apid</th>
                <th>status</th>
                <th>Time Queued</th>
                <th>Queue Date</th>
                <th>Start Time</th>
                <th>End time</th>
                <th>Type</th>
                <th>isVirtual</th>
                <th>Major Island</th>
                <th>Hospital Name</th>
                <th>Hospital/Clinic</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td id="apptid">${result.apptid}</td>
            <td>${result.status}</td>
            <td>${result.TimeQueued}</td>
            <td>${result.QueueDate}</td>
            <td>${result.StartTime}</td>
            <td>${result.EndTime}</td>
            <td>${result.type}</td>
            <td>${result.IsVirtual}</td>
            <td>${result.MajorIsland}</td>
            <td>${result.hospitalname}</td>
            <td>${result.IsHospital}</td>
            <td>
                        <button class="edit">
                            <a title="Edit">
                                <i class="material-icons">&#xE254;</i>
                            </a>
                        </button>
                        <button class="delete">
                            <a title="Delete" >
                                <i class="material-icons">&#xE872;</i>
                            </a>
                        </button>
            </td>
            </tr>
            </tbody>
            </table>
        
            `;

            searchResults = result;

            displaySearchedAppointment.innerHTML += html;

            const deleteButtons = document.querySelectorAll(".delete");
            deleteButtons.forEach(button => {
                deleteEventListener(button);
            });

            const editButtons = document.querySelectorAll(".edit");
            editButtons.forEach(button => {
                editEventListener(button);
            });


        } else {
            const html = `<p class='id-notfound'> No appointment found using: ${appID} </p>`;
            displaySearchedAppointment.innerHTML += html;
        }
    })
})

function editEventListener(button){
    button.addEventListener("click", (e) => {
        e.preventDefault();

        const apptid = button.closest('tr').querySelector('#apptid').textContent;

        const editFormHTML = `
        <div class="editFormContainer">
            <div class="table-title d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="mx-1 my-3 container-title">Edit <b>Appointment</b></h2>
                </div>
                <div>
                    <div><button type="button" onclick="document.querySelector('.editFormContainer').remove()" class="btn btn-danger add-new-edit">X</button></div>

                </div>
            </div>

            <form id="editAppointmentForm">
                <div class="row mb-2">
                    <div class="col-md-6 p-1">
                        <div class="input-group form-floating">
                            <input type="text" class="form-control" id="app-hospitalname-edit" placeholder="Makati Medical Center">
                        <label for="app-hospitalname">Hospital Name</label>
                        </div>
                    </div>

                    <div class="col-md-6 p-1">
                        <div class="input-group form-floating">
                        <select class="form-select" id="app-region-edit" aria-label="Region">
                            <!-- RETURN exact name as string -->
                            <option value="Luzon">Luzon</option>
                            <option value="Visayas">Visayas</option>
                            <option value="Mindanao">Mindanao</option>
                        </select>
                        <label for="type">Region</label>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-md-4 p-1">
                        <div class="input-group form-floating">
                            <select class="form-select" id="app-status-edit" aria-label="Status">
                                <!-- RETURN exact name as string -->
                                <option value="Complete">Complete</option>
                                <option value="Cancel">Cancel</option>
                                <option value="Serving">Serving</option>
                                <option value="NoShow">NoShow</option>
                                <option value="Skip">Skip</option>
                            </select>
                            <label for="app-status">Status</label>
                        </div>
                    </div>
                    <div class="col-md-4 p-1">
                        <div class="input-group form-floating">
                            <select class="form-select" id="app-method-edit" aria-label="Method">
                                <!-- RETURN 1 if Virtual and 0 if Face-to-Face -->
                                <option value="1">Virtual</option>
                                <option value="0">Face-to-Face</option>
                            </select>
                            <label for="type">Appointment Method</label>
                        </div>
                    </div>
                    <div class="col-md-4 p-1">
                        <div class="input-group form-floating">
                            <select class="form-select" id="app-type-edit" aria-label="Type">
                                <option value="Consultation">Consultation</option>
                                <option value="Inpatient">Inpatient</option>
                            </select>
                            <label for="app-type">Appointment Type</label>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="row p-0 mt-1">
                            <label for="time_queued" class="form-label">Time Queued:</label>
                            <div class="col-md-6 p-1">
                                <input type="date" class="form-control" id="date_queued-edit" name="date_queued">
                            </div>
                            <div class="col-md-6 p-1">
                                <input type="time" class="form-control" id="time_queued-edit" name="time_queued">
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row p-0 mt-1">
                            <label class="form-label">Queue Date:</label>
                            <div class="col-md-6 p-1">
                                <input type="date" class="form-control" id="queue_date-edit" name="queue_date">
                            </div>
                            <div class="col-md-6 p-1">
                                <input type="time" class="form-control" id="queue_time-edit" name="queue_time">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="row p-0 mt-1">
                            <label class="form-label">Start Time:</label>
                            <div class="col-md-6 p-1">
                                <input type="date" class="form-control" id="start_date-edit" name="start_date">
                            </div>
                            <div class="col-md-6 p-1">
                                <input type="time" class="form-control" id="start_time-edit" name="start_time">
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row p-0 mt-1">
                            <label class="form-label">End Time:</label>
                            <div class="col-md-6 p-1">
                                <input type="date" class="form-control" id="end_date-edit" name="end_date">
                            </div>
                            <div class="col-md-6 p-1">
                                <input type="time" class="form-control" id="end_time-edit" name="end_time">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container mt-3 text-center">
                    <button type="submit" id="submitEditForm" class="btn btn-primary btn-md py-1 px-3">Edit Appointment</button>
                </div>



            </form>
        </div>
        `;
        
        displaySearchedAppointment.innerHTML += editFormHTML;

        const editAppointmentForm = document.getElementById('editAppointmentForm');

        // Get edit form elements
        const regionElement = document.getElementById('app-region-edit');
        const hospitalNameElement = document.getElementById('app-hospitalname-edit');
        const statusElement = document.getElementById('app-status-edit');
        const methodElement = document.getElementById('app-method-edit');
        const typeElement = document.getElementById('app-type-edit');

        // Date & time elements
        const date_queuedElement = document.getElementById('date_queued-edit');
        const time_queuedElement = document.getElementById('time_queued-edit');
        const queue_dateElement = document.getElementById('queue_date-edit');
        const queue_timeElement = document.getElementById('queue_time-edit');
        const start_dateElement = document.getElementById('start_date-edit');
        const start_timeElement = document.getElementById('start_time-edit');
        const end_dateElement = document.getElementById('end_date-edit');
        const end_timeElement = document.getElementById('end_time-edit');

        // Change form inputs' values to existing appointment's values
        hospitalNameElement.value = searchResults.hospitalname;
        regionElement.value = searchResults.MajorIsland;
        statusElement.value = searchResults.status;
        methodElement.value = searchResults.IsVirtual;
        typeElement.value = searchResults.type;

        editAppointmentForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const region = regionElement.value;
            const status = statusElement.value;
            const hospitalname = hospitalNameElement.value;
            const IsHospital = hospitalname.trim() === '' ? 0 : 1;
            const method = methodElement.value;
            const methodBoolean = method.toLowerCase() === 'Virtual' ? 1 : 0;
            const type = typeElement.value;

            const QueueDate = date_queuedElement.value + " " + time_queuedElement.value;
            const TimeQueued = queue_dateElement.value + " " + queue_timeElement.value;
            const StartTime = start_dateElement.value + " " + start_timeElement.value;
            const EndTime = end_dateElement.value + " " + end_timeElement.value;

            const editFormData = {
                apptid: apptid,
                status: status,
                hospitalname: hospitalname,
                IsVirtual: methodBoolean,
                type: type,
                MajorIsland: region,
                IsHospital: IsHospital,
                QueueDate: QueueDate,
                TimeQueued: TimeQueued,
                StartTime: StartTime,
                EndTime: EndTime,
            };

            // console.log(editFormData);

            try {
                await fetchPost('/updateAppointment', editFormData)
                    .then(response => {
                        if (response.status == 201) {
                            console.log("Updated");
                            return response.json();
                        } else {
                            alert ('Error in updating appointment.');
                        }
                    })
                    .then(data => {
                        displaySearchedAppointment.innerHTML = "";
                        displaySearchedAppointment.innerHTML += `<p>Successfully Updated the Appointment with id: ${editFormData.apptid} </p>`;
                        displaySearchedAppointment.classList.add("success");
                    })
            } catch (error) {
                console.log(error);
            }
        });

    });



}


function deleteEventListener(button) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        // Access the apptid associated with this delete button
        const apptid = button.closest('tr').querySelector('#apptid').textContent;
        // Perform your delete action here using the apptid
        console.log("Delete button clicked for apptid:", apptid);

        try {
            fetch('/deleteAppointment', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ apptid: apptid })
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error));
        } catch (e) {

        }
    });
}

