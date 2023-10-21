# Lab 6 Errata

## Step 2: Create a trip

* The instructions talk about `createTrip` but the existing function is actually called `createPost`
  * Furthermore, the state is also called `post`
  * It is easiest to leave the state name remain as `post` and the function name remain as `createPost`
    * That means you'll have to `JSON.stringify(post)` instead of `JSON.stringify(trip)`
  * Up to you if you want to rename things properly, I would just leave it as `post`
* As `fetch` is an async function, you should `await` it as well. That means making `createPost` an async function also

## Step 3: Update and delete a trip

* The same problem in Step 2 applies here
* Add the following to `server/controllers/trips.js`, in the `deleteTrip` function, before the line `const results = await poool.query('DELTE FROM...')`

```js
const trip_destinations_deletion = await pool.query(
  `DELETE FROM trips_destinations
  WHERE trip_id = $1`,
  [id]
)
```

## Step 4: Create a new destination

* In Checkpoint 4:
  * The endpoint for the `fetch()` call in `addDestination` should be `/api/destinations`, not `/api/destination/create`
  * The endpoint for the `fetch()` call in `createTripDestination` should be `/api/trips-destinations`, not `/api/trips-destinations/create`

## Step 5: Get all destinations

* You should edit the `ReadDestinations.js` file, not the `App.js` file

## Step 6: Add destinations to a trip

* Clarification: The `trip_id` comes from the `props.id` passed to the `AddTripOptionCard` component
* You should `await` the `fetch()` to `/api/trips-destinations`

## Step 8: Create a new activity

* In Checkpoint 8, the value for the `body` key should not have curly braces. It should be: body: JSON.stringify(activity)`
* In Checkpoint 8, the `fetch()` call should be `await`ed