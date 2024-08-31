from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("randomquote", views.random_quote, name="randomquote"),
    path("nextquote/<int:quote_id>", views.next_quote, name="nextquote"),
    path("prevquote/<int:quote_id>", views.prev_quote, name="prevquote"),
    path("bookmarktoggle", views.bookmark_toggle, name="bookmarktoggle"),
    path("bookmarks", views.bookmarks, name="bookmarks"),
    path("search", views.search, name="search"),
    #path("import_csv", views.import_csv, name="import_csv"),
]