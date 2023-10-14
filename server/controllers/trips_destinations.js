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
    const query = `
      SELECT *
      FROM trips
      INNER JOIN trips_destinations ON trips_destinations.trip_id = trips.id
      WHERE trips_destinations.destination_id = $1
    `

    const destination_id = parseInt(request.params.destination_id)
    const results = await pool.query(query, [destination_id])
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(409).json({ error: error.message })
  }
}

const getAllDestinations  = async (request, response) => {
  try {
    const query = `
      SELECT *
      FROM destinations
      INNER JOIN trips_destinations ON trips_destinations.destination_id = destinations.id
      WHERE trips_destinations.trip_id = $1
    `

    const trip_id = parseInt(request.params.trip_id)
    const results = await pool.query(query, [trip_id])
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
