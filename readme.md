# Lab 8 Errata

## Step 1: Set Up Configuration Files

* The various `import` statements are:

  ```js
  import { pool } from './database.js'
  import GitHubStrategy from 'passport-github2'
  ```

* The `options` should be:

  ```js
  const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }
  ```

* When registering for the Oauth app on Github, use the following information:
  * Application Name: `codepath-onthefly-development`
  * Homepage URL: `http://localhost:3000`
  * Authorization callback URL: `http://localhost:3001/auth/github/callback`

* `name` is not required when extracting the user's profile information from the `profile` argument

  ```js
  const { _json: { id, name, login, avatar_url } } = profile
  ```

  should be:

  ```js
  const { _json: { id, login, avatar_url } } = profile
  ```

* You need to use backticks \` instead of single quotes \' in the `INSERT INTO users` SQL statement 

## Step 2: Set up authentication middleware

* When updating the `cors` middleware, use port `3000`, not `5173`

  ```js
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
  }))
  ```

* Additionally, update the `/` route s follows:

  ```js
  app.get('/', (req, res) => {
    res.redirect('http://localhost:3000')
  })
  ```

## Step 3: Create a route for authenticating with GitHub

* At the end of `server/routes/auth.js`, export the router as default:

  ```js
  export default router
  ```

## Step 4: Create routes to manage the user on a trip

* Ignore the part about `createUsersTableQuery`, `createUsersTripsTableQuery`, and using `pool.query`
  * Instead, put the following in `server/config/reset.js`:

    ```js
    const createUsersTripsTable = async () => {
      const createUsersTripsTableQuery = `
        CREATE TABLE IF NOT EXISTS users_trips (
          id serial PRIMARY KEY,
          trip_id int NOT NULL,
          username text NOT NULL,
          FOREIGN KEY (trip_id) REFERENCES trips(id)
        );
      `

      try {
          const res = await pool.query(createUsersTripsTableQuery)
          console.log('🎉 users_trips table created successfully')
      } catch (err) {
          console.error('⚠️ error creating users_trips table', err)
      }
    }
    ```

  * and call the function at the bottom of `server/config/reset.js`:

    ```js
    createUsersTripsTable()
    ```

* After creating the three functions `createTripUser()`, `getTripUsers()`, and `getUserTrips()` in `server/controllers/users_trips.js`, be sure to export them:

  ```js
  export default {
    createTripUser,
    getTripUsers,
    getUserTrips
  }
  ```

* Import these into `server/routes/users_trips.js` with:

  ```js
  import UsersTripsController from '../controllers/users_trips.js'
  ```

* Then, create the individual routes as such:

  ```js
  router.post('/create/:trip_id', UsersTripsController.createTripUser)
  router.get('/users/:trip_id', UsersTripsController.getTripUsers)
  router.get('/trips/:username', UsersTripsController.getUserTrips)
  ```

## Step 5: Create a basic login page

* Also add `api_url={API_URL}` to the instantiation of the `<ReadDestinations>` component
  * Inside the `ReadDestinations` component you will need:

    ```js
    const response = await fetch(`${props.api_url}/api/destinations`)
    ```

* In `client/src/pages/AddToTrip.js`, simply pass the `api_url` prop along to the instantiation of the `<AddTripOptionCard>` component like so:

  ```js
  <AddTripOptionCard key={trip.id} 
    ... other stuff ...
    api_url={props.api_url}
  />
  ```

  * And in `client/src/components/AddTripOptionCard.js` update the `fetch()` call as usual:

    ```js
    await fetch(`${props.api_url}/api/trips-destinations`, options)
    ```

* Be sure to update all the `fetch()` calls in `CreateTrip.js`, `EditTrip.js`, `TripDetails.js`, `CreateDestination.js`, and `CreateActivity.js`

* For the `client/src/pages/Login.js` component, it's not necessary to import `React` and `Link` anymore

## Step 6: Request the user's information

* The function calls at the end of the `useEffect` hook for `App.js` should be:

  ```js
  getUser()
  fetchTrips()
  ```

* Be sure to import the `Login` component at the top of `App.js`:

  ```js
  import Login from './pages/Login'
  ```

* Comment out for now the additional route to `<AddUserToTrip>`, since we haven't written that component yet!

## Step 8: Create an avatar component

* Add `alt='avatar'` to the `<img>` tag in `Avatar.js` to avoid warnings
* Be sure to import the `Avatar` component at the top of `App.js`:

  ```js
  import Login from './components/Avatar'
  ```

## Step 9: Add functionality to add the user to a trip

* After finishing all of Step 9, the `AddUserToTrip` component is now writen, so update the following in `App.js`:
  * Add the import statement `import AddUserToTrip from './pages/AddUserToTrip'`
  * Uncomment the route to `<AddUserToTrip>`
  * Use the following for the route:

    ```js
    {
      path: '/users/add/:trip_id',
      element: user && user.id ?
        <AddUserToTrip user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    },
    ```

## Step 10: Add a user to a trip

* For the `<div className='travelers'>` div, the `style` tag is incorrect. It should be:

  ```js
  <p key={index} style={{ textAlign: 'center', lineHeight: 0, paddingTop: 20 }}>
    {traveler.username}
  </p>
  ```

## Step 11: Add the creator of a trip as a traveler

* The `trip` state is in `client/src/pages/CreateTrip.js`
  * Be sure to destructure the `user` from the props: `const CreateTrip = ({user, api_url}) => {`
  * Then instead of:

    ```js
      const [trip, setTrip] = useState({
      id: 0,
      //... more key/values ...
      username: props.user.username
    })
    ```

    use:

    ```js
    const [trip, setTrip] = useState({
      id: 0,
      //... more key/values ...
      username: user.username
    })
    ```

* In the `tripUser`, `user_removal` portion where you are adding additional SQL queries, be sure to use backticks \` instead of single ticks \'
