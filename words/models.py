from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass


class Quote(models.Model):
    quote = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.quote
    

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)