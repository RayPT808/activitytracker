# 🏃‍♂️ Activity Tracker – A Full Stack MVP for Simplified Activity Logging

![Activity Tracker](assets/images/Activity%20Tracker%20Logged%20in%20view.png)

> “Not all metrics matter. Sometimes, the best data is the simplest.”

##  Overview

As a personal trainer and hobby triathlete, I always try to keep track of my activities using platforms like **Strava** and **Garmin Connect**. While powerful, these tools often overwhelm with complex metrics. This app is a **minimal viable product (MVP)** built to address this: _track your activities simply and clearly_.

This is my fifth and final milestone project at Code Institute – a **full stack web app** using **React**, **Django**, and **PostgreSQL**, designed for everyday users who just want to log, view, and manage their activities.

---

##  The Vision

Platforms like [Strava](https://developers.strava.com/) and [Garmin](https://developer.garmin.com/) are the giants. I drew inspiration from them but opted to avoid the complexities of their APIs and licenses.

Instead, I designed a **simplified user interface** to support key use cases:
-  Log activities with type, name, date, and duration
-  View past records in a clean dashboard
-  Edit or delete records anytime

---

##  Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React, Bootstrap               |
| Backend      | Django, Django REST Framework  |
| Database     | PostgreSQL                     |
| Auth         | JWT Authentication (DRF SimpleJWT) |
| Hosting      | Heroku                         |
| Media Storage| Cloudinary                     |
| Versioning   | Git + GitHub                   |

---

##  ERD (Entity Relationship Diagram)

[Diagram](assets/images/diagram.png)



---

##  Features

###  Existing Features
- Registration and Login using JWT
- Add new activity with:
  - Activity type (dropdown)
  - Name
  - Duration (HH:MM:SS picker)
  - Date (datepicker)
  - Notes (optional)
- Dashboard to view all activities
- Edit and Delete options for each entry
- Sorting: Most recent first
- Duration auto-conversion to total seconds
- Password field toggle (eye icon)
- Responsive UI across devices
- Basic frontend/backend separation

###  Future Features
- Password reset email
- Weekly/monthly activity summary
- Upload `.gpx` or `.fit` files
- Stats: Time spent by activity type
- Enhanced user profile (avatar, bio)

---

##  Reusable React Components

| Component         | Purpose                                |
|-------------------|----------------------------------------|
| `ActivityForm`    | Add/Edit activity form (shared logic)  |
| `Layout`          | Page wrapper + shared Navbar           |
| `DashboardPage`   | Activity list, delete/edit handling    |
| `LoginPage`       | Auth form with password toggle         |
| `Register`        | New user registration form             |

---

##  Responsive Design

Tested with Chrome DevTools and real devices.

- Mobile-first responsive
- Navbar collapses to hamburger
- Forms scale smoothly

![Responsive](assets/images/responsive.png)

---

##  Testing

![Activitytest](assests/images/activitytest.png)


###  Manual Testing Table

| Feature             | Test Scenario                     | Expected Outcome                   |
|---------------------|-----------------------------------|------------------------------------|
| Register new user   | Fill form and submit              | New account created, redirected    |
| Login with token    | Valid credentials                 | Token stored, redirect to dashboard |
| Add activity        | Fill all fields                   | Activity saved and appears in list |
| Edit activity       | Click Edit, update fields         | Changes saved                      |
| Delete activity     | Click Delete, confirm popup       | Entry removed                      |
| Toggle password     | Click eye icon                    | Password reveals/hides             |
| Date restrictions   | Choose future date                | Error message shown                |

###  Unfixed Bugs

- Duration sometimes not saved on first submit
- Date field allows future entries (minor logic bug)
- Activity name not shown in dashboard list
- Form doesn't auto-scroll or show toast on save

---

##  Deployment

###  Backend (Django) – Heroku

1. Create Heroku app & PostgreSQL DB
2. Add environment variables (`DEBUG=False`, `ALLOWED_HOSTS`, `SECRET_KEY`, etc.)
3. Update `settings.py`:
   - Add `whitenoise`, `corsheaders`
   - Setup `STATIC_ROOT`, `MEDIA_ROOT`, `Cloudinary`
4. Add `Procfile`:  
5. Push code to Heroku or GitHub → Connect repo
6. Run:
```bash
python manage.py migrate
python manage.py createsuperuser


### User Experience

#### First time visitor goals

+ As a first time visitor the goal and the purpose of the website is easily understandable.

+ As a first time visitor I can easily navigate through the page and locate functions.

#### Returning visitor goals

+ After some contemplation as a returning visitor to the website I can find and carry out a registration.

+ As a registered user I can log in to my account, where my data and details are stored securely.

+ As a logged in user I can choose from different types of activities.

+ As a logged in user I can save my chosen actyvity type, date, duration.

#### Frequent user goals

+ As a frequently returning user I can see my past activities on a list.

+ As a frequently returning user I can modify details of past activities or I can delete past activities.



#### Browser compatibility

Tested the website on **Chrome**, **Safari**, **Firefox**.
Appearance was good on all three browsers.
Intended responsiveness also good on all three.

![responsive](/assets/images/responsive.png)

#### Lighthouse report

Unfotunately based on the Lighthouse report, the website has poor performance with several issues.

![LighthouseReport](/assets/images/Lighthouse-Report.png)


#### Login credentials

+ Django admin - Username: Runner1  Password: Sunday12

+ Activity Tracker user - Username: Runner2 Password: Sunday13

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


### Lessons & Final Thoughts

This project taught me:

Full-stack coordination between frontend and backend

How tricky real-world deployments can get

Managing form data and authentication securely

Leveraging DRF with JWT for APIs

React component reuse and prop management

There is a huge potential in full stack applications, regardless what is it for. 




