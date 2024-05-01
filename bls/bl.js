
const dal = require('../dals/dal')

async function delete_employee(id) {
    const result = await dal.get_by_id(id)
    if (!result) {
        dal.delete_employee(id)
    }
}

async function purchase_ticket(flight_id, customer_id, passenger_id) {
    try {
        const flight = await dal_flight.get_by_id(flight_id)
        if (flight) {
            if (flight.remaining_tickets > 0) {
                await dal.update_flight({ ...flight, remaining_tickets: remaining_tickets - 1 })
                await dal.add_ticket(flight_id, customer_id, passenger_id)
            }
            else
                return Error('no tickets left')
        }
        else
            throw Error('flight does not exist')
    }
    catch (e) {
        // check error
    }

}

module.exports = {
    delete_employee
}
