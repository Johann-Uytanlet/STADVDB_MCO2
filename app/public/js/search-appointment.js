
const searchSubmitBtn = document.querySelector("#search-btn");
const inputSearch = document.querySelector("#appointment_id_search");
const displaySearchedAppointment = document.querySelector(".display-searched-appointment");


searchSubmitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const getAllCurrentSearch = document.querySelectorAll("#display-section");
    const notAllFoundMessage = document.querySelectorAll(".id-notfound");

    // RESET
    if (getAllCurrentSearch != null ) {
        getAllCurrentSearch.forEach(element => {
            element.remove();
        });
    }    
    
    if (notAllFoundMessage != null ) {
      
        notAllFoundMessage.forEach(element => {
            element.remove();
        });
    }


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
            <td>${result.apptid}</td>
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
                        <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                        <a class="delete" title="Delete" data-toggle="tooltip"><i
                            class="material-icons">&#xE872;</i></a>
                      </td>
            </tr>
            </tbody>
            </table>
        
            `;
            displaySearchedAppointment.innerHTML += html;
        } else {
            const html = `<p class='id-notfound'> No appointment found using: ${appID} </p>`;
            displaySearchedAppointment.innerHTML += html;
        }
    })
})