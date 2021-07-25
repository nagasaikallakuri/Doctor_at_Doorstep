# Doctor@Doorstep

The main aim of this CloudComputing project is to alert the nearest doctor about the patient. The application is hosted on Google Firebase, with a backend written in NodeJS and a frontend written in ReactJS.

Main insights of Project:-

* Patient and Doctor are two user roles that may sign up initially and then login.

* When Patient requests for doctor mentioning his sickness the nearest doctors(Using Geo Queries) who are available will be notified.

* Once one of the available physicians accepts the request, the patient's information and location are sent to his personal email, and the request for other doctors is removed with the message "some other doctor is being seen."

* We'll keep track of "how many patients each doctor treats" and "how many doctors are assigned to a certain patient." Their dashboards display this information.
