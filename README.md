# Words
I like advice from wise people, and I always look for a way to get my hands on them. That's why I made Words app with half a million quotes from so many wise (or fun) people. These quotes will be displayed to the user daily, or if you are looking for a specific person or a quote, you can use search. And if you would like to save the quotes for later reference, you can register in the app to unlock bookmarking functionality.

# What's in the files?
The Words folder is the main folder of the project and it contains several other folders as below:

## Statics:
The static folder is where I stored some assets of the project (as per conventions) like icons, CSS files for styling, and JavaScript files for the logic of the frontend and also for interacting with Django as backend mostly using the Fetch API.

## Templates:
The templates folder is where the HTML templates are located. There are two HTML files for Login and Register. The 'layout' file is used to make the navbar and the main structure of the pages, and the 'index' file is mainly used by the JavaScript to create a single app view.

## Words Folder:
In the root path of the Words folder, there are crucial Python files for Django functionalities. 'admin.py' is for introducing models to the admin section of Django. 'models.py' is where Django defines and uses models from (basically, it's the database in Django ORM format). 'urls.py' is where paths of the project are defined. And finally, 'views.py' is where all the logic of the backend(or server) is located.


# Design pattern
In the designing of this app, I used the MVC (Model-View-Controller) design pattern to have better maintainability, readability, and modularity. Using this design pattern is very convenient for making single app web applications because it separates the parts where View (views) related and Logic (controllers) related.


# Running the app
To run this app, you simply need to run the Django server, have an internet connection, and go to the index page of the server. from there, everything else is self explanatory. And if you want the full experience, I recommend registering in the app.

There's nothing else needed to run this app. Everything is either provided in the files or the app will download from the web.


# Distinctiveness and Complexity
Words project has a large 500,000(although i removed almost 400,000 of it because github didn't let me upload such big files! but i have the dataset.) entry database for quotes, including the author and the related categories of the quotes. I tried to use Django ORM to use this dataset in an efficient, practical, and fun way. At first, I was going to use tools like Celery and RabbitMQ for database interactions, but since the response time was decent enough, I used Django's native ORM.

Other than that, users can search the entire database, and they also have the ability to search by the author or the quotes. So say you only want to see the quotes from Bertrand Russell, you can search by author and enter 'Russell' to see all of his quotes.

Users can also bookmark their favorite quotes and manage them in the bookmarks section. Wherever you see a quote in the Words app, you can add or remove it to your bookmarks list. Whether it be on the main page, search results, or the bookmark page itself (although it's implemented that way to make the management of the bookmarks easier).

I've also implemented pagination for bookmarks and search result pages.

Words also have a 'Quote of the day' which is shown on the homepage of the app, so whenever you visit, there's something new for you!

There's also a random button located on the main page which allows you to shuffle through the quotes and find new ones.

Other than that, I tried to use Bootstrap for building a minimalistic and fun frontend for the app.