// DOCUMENT ELEMENTS
const addAppointmentForm = document.getElementById('addNewAppointment');

const regionElement = document.getElementById('app-region');
const hospitalNameElement = document.getElementById('app-hospitalname'); 
const statusElement = document.getElementById('app-status'); 
const methodElement = document.getElementById('app-method'); 
const typeElement = document.getElementById('app-type'); 

// TIME QUEUED
const date_queuedElement = document.getElementById('date_queued'); 
const time_queuedElement = document.getElementById('time_queued'); 

// QUEUE DATE
const queue_dateElement = document.getElementById('queue_date'); 
const queue_timeElement = document.getElementById('queue_time'); 

// START TIME
const start_dateElement = document.getElementById('start_date'); 
const start_timeElement = document.getElementById('start_time'); 

// END TIME
const end_dateElement = document.getElementById('end_date'); 
const end_timeElement = document.getElementById('end_time'); 

async function fetchPost(endpoint, formData) {
    let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then();

    return response;
};

/**
 *      When the add appointment button is submitted, this function:
 *      1. Retrieves the appointment details as form data
 *      2. Add the appointment by sending a POST request
 *      3. Display appropriate/necessary feedback messages
 */
addAppointmentForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    //console.log("INSIDE EVENT LISTENER OUTSIDE TRY CATCH");
    try {
        const appointmentFormData = await getAppointtmentFormData();
        const appointmentResponse = await fetchPost('/addAppointment', appointmentFormData);

        //console.log("INSIDE EVENT LISTENER");
        console.log(appointmentResponse);

        if (appointmentResponse.status == 201) {
            alert('Appointment Successfully Added.');
            console.log('Appointment Successfully Added.');
        } else {
            alert('Error in adding appointment.');
            console.log('Error in adding appointment.');
            return;
        }

    } catch (error) {
        //alert(error);
        console.log( error );
    }

});


function getAppointtmentFormData() {

    const region = regionElement.value;
    const status = statusElement.value;
    const hospitalName = hospitalNameElement.value;
    const IsHospital = hospitalName.trim() === '' ? 0 : 1;
    const method = methodElement.value;
    const methodBoolean = method.toLowerCase() === 'Virtual' ? 1 : 0;
    const type = typeElement.value;

    // Preprocess datetimes
    // TIME QUEUED
    const date_queued = date_queuedElement.value; 
    const time_queued = time_queuedElement.value; 
    let TimeQueued = "";
    TimeQueued += date_queued + " " + time_queued;

    // QUEUE DATE
    const queue_date = queue_dateElement.value; 
    const queue_time = queue_timeElement.value;
    let QueueDate = "";
    QueueDate += queue_date + " " + queue_time;  

    // START TIME
    const start_date = start_dateElement.value; 
    const start_time = start_timeElement.value; 
    let StartTime = "";
    StartTime += start_date + " " + start_time;

    // END TIME
    const end_date = end_dateElement.value; 
    const end_time = end_timeElement.value; 
    let EndTime = "";
    EndTime += end_date + " " + end_time;

    const formData = {
        status: status,
        region: region,
        hospitalname: hospitalName,
        IsVirtual: methodBoolean,
        type: type,
        MajorIsland: region,
        IsHospital: IsHospital,
        QueueDate: QueueDate,
        TimeQueued: TimeQueued,
        StartTime: StartTime,
        EndTime: EndTime,
    };
    
    return formData;
};