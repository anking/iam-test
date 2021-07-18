## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Original test request
Please let Andrey know to prepare the below: 

Come up with a coding exercise that is UI-centric with a focus on building something using “Konva” aka “React-Konva” Canvas API in a modern React ecosystem. Ideally, helpful information and things we are looking for will be: 

- Use GitHub to track commits and push code                          - Check
- React most modern CRA is fine                                      - Check
- State Management Global with Redux or Solely React Context API     - Check (Context)
- TypeScript preferred                                               - Check
- Material-UI if the component library is used                       - Check
- React Query for data fetching                                      - Check 

Jordan, may you please let Paige and Colin know of a time on Monday or Tuesday the week of the 19th that could work for a code review with a debrief following?”

#### Additional features used
- AWS cognito service for managing user pools & authentication
- Browser local storage for simulating user selections storage
- React-ruter for navigation between pages

### Application description

Upon loading the app will ask you for the login credentials, use:
Login: test@iamrobotics.com
Password: TestTest1!

Once logged in you'll be redirected to the dashboard component with React-Konva demo, this will demonstrate a sample component that is reacting to mouse events (move, click&hold)

Dogs tab will demonstrate the implementation of the search mechanism that is using dogs api on the backend.
Following features are being used:
- react-query for making request, maintenance and caching (detools are available if needed in left bottom corner)
- context api to update the state of the menu component with selected (bookmarked) items, saving state of bookmarks between going thru pages (dogs/dashboard)
- browser local storage for keeping the state between page reloads (menu state(open/close) and saved bookmarks)

Application code is cleaned to contain no errors/warnings (to the best i can find :)