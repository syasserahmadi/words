from django.contrib import admin
from words.models import User, Quote, Bookmark

admin.site.register(User)
admin.site.register(Quote)
admin.site.register(Bookmark)