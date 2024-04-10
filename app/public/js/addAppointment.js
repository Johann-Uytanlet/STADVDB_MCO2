const addAppointmentForm = document.getElementById('addNewAppointment');

const region = document.getElementById('app-region');
const hospitalName = document.getElementById('app-hospitalname'); 
const status = document.getElementById('app-status'); 
const method = document.getElementById('app-method'); 
const type = document.getElementById('app-type'); 

const date_queued = document.getElementById('date_queued'); 
const time_queued = document.getElementById('time_queued'); 

const queue_date = document.getElementById('queue_date'); 
const queue_time = document.getElementById('queue_time'); 

const start_date = document.getElementById('start_date'); 
const start_time = document.getElementById('start_time'); 

const end_date = document.getElementById('end_date'); 
const end_time = document.getElementById('end_time'); 


async function fetchPost(endpoint, formData) {
    let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

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

    try {
        const appointmentFormData = await getAppointtmentFormData();
        const appointmentResponse = await fetchPost('/addAppointment', appointmentFormData);

        if (appointmentResponse.status == 201) {
            console.log('Appointment Successfully Added.');
        } else {
            console.log('Error in adding appointment.');
            return;
        }

    } catch (error) {
        console.log( error );
    }

});


function getAppointtmentFormData() {

    // Preprocess datetimes

    console.log(region.value);
    console.log(hospitalName.innerText)

    const formData = {
        region: region.value,
        hospitalName: hospitalName.innerText,
        status: status.value,
        method: method.value,
        type: type.value,
    };

    console.log(formData);

    return formData;
};