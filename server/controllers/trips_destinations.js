import { pool } from '../config/database.js'

const createTripDestination = async (request, response) => {
  try {
    const { trip_id, destination_id } = request.body
    const results = await pool.query("INSERT INTO trips_destinations (trip_id, destination_id) VALUES($1, $2) RETURNING *",
    [trip_id, destination_id])

    response.status(201).json(results.rows[0])
  }
  catch (error) {
    response.status(409).json({ error: error.message })
  }
}

const getTripsDestinations = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM trips_destinations ORDER BY trip_id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(409).json({ error: error.message })
  }
}

const getAllTrips = async (request, response) => {
  try {
    const destination_id = parseInt(request.params.destination_id)
    const results = await pool.query("SELECT t.* FROM trips_destinations td, trips t WHERE td.trip_id = t.id AND td.destination_id = $1", [destination_id])
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(409).json({ error: error.message })
  }
}

const getAllDestinations  = async (request, response) => {
  try {
    const trip_id = parseInt(request.params.trip_id)
    const results = await pool.query("SELECT d.* FROM trips_destinations td, destinations d WHERE td.destination_id = d.id AND td.trip_id = $1", [trip_id])
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(409).json({ error: error.message })
  }
}

export default {
  createTripDestination,
  getTripsDestinations,
  getAllTrips,
  getAllDestinations
}
