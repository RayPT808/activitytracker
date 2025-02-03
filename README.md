# The Activity Tracker

As a personal trainer and a hobby triathlete I always trying to keep track of my activities through popular platforms such as
Strava or Garmin Connect. As the these platforms improved over the years more and more details, insights became available foruserslike myself. The accessible data with regards to one's activity sometimes it is a bit overwhelming and pointles because as an avarage person many of those metrics will not matter for us. Within the details it's easy to lose the focus on the fundemantal goal that we just want to be active and we would like to record it in a simple, not confunsing way. This was how the idea of my fith project for the Code Institute course was born.
![Loginscreenshot](assets/images/Loginscreenshot.png)

## The vision

Strava and Garmin Connect are the Apple and Microsoft of activity tracking in these days, so using their products and services I tried follow their example but I imagined a rather simplified version. Both platforms could provide libraries and API's for developers.
<https://developers.strava.com/>
<https://developer.garmin.com/gc-developer-program/activity-api/>
However looking into more Strava's API Agreement seems complex, restrictive and me question that for something simple that I want do I really need all of that. Garmin was a different story an application had to be sent to them in order to gain acces their libraries, APIs. This application of mine was rejectet pretty swiftly. After this I just tied to focus on what I want to create.
Started to go through the user's journey of an activity platform and outlined the essential user stories.
![Backlog](assets/images/Backlog.png)

At next I visualized a user friendly interface where all the required functions are easy to spot and use.

![p5wireframe](assets/images/p5%20wireframe.png)
![p5mobileview](assets/images/P5%20mobile%20view.png)

This was my idea that I proudly presentet to my tutor. However some research and meetings with my tutor made me realise I don't have the techniqual skills, experience or time to create something that like the initial idea was, plus to launch an MVP product I don't even need all of that. Considering all these details I narrowed down the scope of the project to aim for an MVP outcome creating a simple user interface much like Strava.
![screenshotstrava](assets/images/screenshotstrava.png) or Garmin has on their platform ![Garmin](assets/images/Garmin.png). It is basically a form with different data fields that the user can create, save, modify, delete.
![activitytrackerloggedinview](assets/images/Activity%20Tracker%20Logged%20in%20view.png)

### User Experience

#### First time visitor goals

+ As a first time visitor the goal and the purpose of the website is easily understandable.

+ As a first time visitor I can easily navigate through the page and locate functions.

#### Returning visitor goals

+ After some contemplation as a returning visitor to the website I can find and carry on a registration.

+ As a registered user I can log in to my account, where my data and details are stored securely.

+ As a logged in user I can choose from different types of activities.

+ As a logged in user I can save my chosen actyvity type, date, duration.

#### Frequent user goals

+ As a frequently returning user I can see my past activities on a list.

+ As a frequently returning user I can modify details of past activities or I can delete past activities.

### Technologies Used

#### Languages Used

+ HTML

+ CSS3

+ Javascript

+ Python

#### Frameworks, Libraries & Programs Used

1. Bootstrap

2. Django Rest Framework

3. Git

+ Git was used to commit and push the codes.

4. GitHub

+ Github was used to store the project after being pushed.

5. Pexels.com

+ Pexels was used to download pictures for background and illustrations.

6. Balsamiq.com

+ Balsamiq platform was used to draw wireframes nad visualise pages.

7. React

### Features

#### Existing Features

+ Logo, branding

![icon](/assets/images/icon.png)

Upon opening the page in the browser next to the name of the website the logo is positioned in the felt side of the navbar. Dynamic and reflecting the colour scheme of the site

+ Activity types list

![activitytype](/assets/images/activitytype.png)

 The user can choose th etype of activity from a scroll down list. The list is not limited to tha existing choices, furhter activities can be added.

+ Date of activity

![datepicker](/assets/images/datepicker.png)

The user can set the date in the past of the recorded activity.

+ Activities list

![durationpicker](/assets/images/durationpicker.png)

The user can set the duration of the recorded activity in a format of hh:mm:ss.

+ Activities list

![activitieslist](/assets/images/activitieslist.png)

The user can see on a list her/his past activities.

#### Additional features to implement

+ Password reset option.

+ Detailed user profile view.

+ .fit, .gpx file upload option.

+ Weekly, monthly sum and/or breakdown of activities.

+ Improved layout of fileds

### Testing

#### Browser compatibility

Tested the website on **Chrome**, **Safari**, **Firefox**.
Appearance was good on all three browsers.
Intended responsiveness also good on all three.

![responsive](/assets/images/responsive.png)

#### Lighthouse report

Unfotunately based on the Lighthouse report, the website has poor performance with several issues.

![LighthouseReport](/assets/images/Lighthouse-Report.png)

#### Features Testing

| Feature                | Test                             | Expected Outcome                    |
|------------------------|----------------------------------|-------------------------------------|
| Registration form      | Input new user details           | New user will be registered         |
|------------------------|----------------------------------|-------------------------------------|
| Activities type list   | Select activity from list        | Type of activity will be set        |
|------------------------|----------------------------------|-------------------------------------|
| Duration field         | Set duration in hh:mm:ss format  | The selected duration will be set   |
|------------------------|----------------------------------|-------------------------------------|
| Date picker            | Choose date from calendar        | Selected dates are accepted         |
|------------------------|----------------------------------|-------------------------------------|
| Add activity button    | Click on the button              | Activity will be saved with details |
|------------------------|----------------------------------|-------------------------------------|
| Edit button            | Click on edit button             | Past activity form opens            |
|------------------------|----------------------------------|-------------------------------------|
| Delete button          | Click on delete button           | Notification pop up message         |
|------------------------|----------------------------------|-------------------------------------|
| Save changes button    | Click on save changes button     | Edited activity will be saved       |
|------------------------|----------------------------------|-------------------------------------|

#### Unfixed Bugs

+ Set activity duration not saved. Only after editing and saving again will be the duration  saved.

+ Date picker accepts future dates.

+ List view of activities doesn't show the name of the activities

### Deployment

The site was deployed through Heroku. First the backend part was deployed. The frontend was deployed later. A separate application was created on Heroku but connected to the same GitHub repository where the back end was saved
The live links can be found here - <https://activitytracking-bf7924cd3676.herokuapp.com/api/activitytracker/>
                                 - <https://reactivity-789dd5d26427.herokuapp.com/>

### Credits

#### Content

+ Favicon were taken from Favicon.io.

+ For responsiveness test and adjusting smaller design flaws Google Chrome Developer Tools was used.

#### Code

+ The initial structure is based on CI's own boilerplate code. <https://github.com/Code-Institute-Org/ci-full-template>

+ Code snipets, ideas were taken from the following repositories:

+ <https://docs.fittrackee.org/en/features.html>

+ <https://github.com/ebrithiljonas/fittrackee-uploader/tree/main>

+ <https://github.com/cyberjunky/python-garminconnect>

+ <https://github.com/Vlinking/django-rest-calendar>

+ <https://github.com/eoinlarkin/trax/tree/main>

#### Media

+ Images for illustration and design were taken from open source site Pixabay.com.

### Acknowledgement

Grateful for the help and the input from my mentor **Iuliia Konovalova**.
Shee always gave a different perspective on the issues and with her experience
and eyes for details I was guided in the right direction to make this project happen.


## ...The reality

The fith and final milestone project supposed to be an advanced front end full stack project. I highly underestimated the complexity of this project. There are much more "moving parts" that supposed to sync up with each other to make this application work. Due to the lack of my experience and knowledge throughout development I lost a lot of time on issue that should have been a quick fix. As all of these factors started align I relised I won't be able to deliver an MVP product on time.
The project unfortunately missing many parts that would make it acceptable. If this would be a real life scenario, me as a project manager/ product owner 3-4 weeks before the deadline would have reached out to the client to push deadline in exchange for a lower price and/or additinal features/services for free.
However the idea of the activity tracker  
