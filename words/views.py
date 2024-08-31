from django.shortcuts import render, HttpResponse, HttpResponseRedirect, reverse
from django.contrib.auth import authenticate, login, logout
from words.models import User, Quote, Bookmark
from django.db import IntegrityError
from django.contrib.sessions.models import Session
from django.http import JsonResponse, HttpRequest
from django.core.paginator import Paginator
import json
from datetime import timedelta, timezone, datetime
from django.views.decorators.http import require_http_methods



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "words/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "words/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "words/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "words/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "words/register.html")



def index(request):
    # Check if the user has a quote stored in the session
    if 'quote_id' in request.session:
        quote_id = request.session['quote_id']
        try:
            quote = Quote.objects.get(pk=quote_id)
        except Quote.DoesNotExist:
            quote = None
    else:
        quote = None

    # Check if the quote exists and if it's older than 24 hours
    if not quote or quote.timestamp < datetime.now(timezone.utc) - timedelta(hours=24):
        # Fetch a new quote
        quote = Quote.objects.order_by('?').first()

        # Update the session with the new quote ID and timestamp
        request.session['quote_id'] = quote.id
        quote.timestamp = datetime.now(timezone.utc)
        quote.save()

    # Split the category and truncate to first 4 items
    category = quote.category.upper().split(', ')
    new_category = ', '.join(category[:4])

    # Check the status of bookmark
    is_bookmarked = False
    if request.user.is_authenticated:
        user_bookmarks = Bookmark.objects.filter(user=request.user, quote=quote)
        if user_bookmarks.exists():
            is_bookmarked = True

    # Pass the quote and category to the template
    return render(request, "words/index.html", {'qod': quote,
                                                'category': new_category,
                                                'isBookmarked': is_bookmarked}, status=200)



def random_quote(request):
    # Return a random quote
    quote = Quote.objects.order_by('?').first()
    category = quote.category.upper().split(', ')
    new_category = ', '.join(category[:3])

    # Check the status of bookmark
    is_bookmarked = False
    if request.user.is_authenticated:
        user_bookmarks = Bookmark.objects.filter(user=request.user, quote=quote)
        if user_bookmarks.exists():
            is_bookmarked = True

    return JsonResponse({'quoteid': quote.id,
                         'quote': quote.quote,
                         'author': quote.author,
                         'category': new_category,
                         'isBookmarked': is_bookmarked}, status=200)



def next_quote(request, quote_id):
    # Return the next quote
    quote = Quote.objects.get(pk=quote_id + 1)
    category = quote.category.upper().split(', ')
    new_category = ', '.join(category[:4])

    # Check the status of bookmark
    is_bookmarked = False
    if request.user.is_authenticated:
        user_bookmarks = Bookmark.objects.filter(user=request.user, quote=quote)
        if user_bookmarks.exists():
            is_bookmarked = True

    return JsonResponse({'quoteid': quote.id,
                         'quote': quote.quote,
                         'author': quote.author,
                         'category': new_category,
                         'isBookmarked': is_bookmarked}, status=200)



def prev_quote(request, quote_id):
    # Return the previous quote
    quote = Quote.objects.get(pk=quote_id - 1)
    category = quote.category.upper().split(', ')
    new_category = ', '.join(category[:4])

    # Check the status of bookmark
    is_bookmarked = False
    if request.user.is_authenticated:
        user_bookmarks = Bookmark.objects.filter(user=request.user, quote=quote)
        if user_bookmarks.exists():
            is_bookmarked = True

    return JsonResponse({'quoteid': quote.id,
                         'quote': quote.quote,
                         'author': quote.author,
                         'category': new_category,
                         'isBookmarked': is_bookmarked}, status=200)



@require_http_methods(["POST"])
def bookmark_toggle(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        user_id = data.get("userId")
        quote_id = data.get("quoteId")

        try:
            user = User.objects.get(pk=user_id)
            quote = Quote.objects.get(pk=quote_id)
        except (User.DoesNotExist, Quote.DoesNotExist):
            return JsonResponse({'error': 'User or Quote does not exist'}, status=400)

        bookmark, created = Bookmark.objects.get_or_create(user=user, quote=quote)

        if created:
            is_bookmarked = True
        else:
            bookmark.delete()
            is_bookmarked = False

        return JsonResponse({'isBookmarked': is_bookmarked}, status=200)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



@require_http_methods(["POST"])
def bookmarks(request):
    data = json.loads(request.body.decode("utf-8"))
    user_id = data.get("userId")
    requested_page = data.get("requestedPage")

    # Fetch bookmarks for the user
    bookmarks = Bookmark.objects.filter(user__pk=user_id).order_by("-timestamp")

    paginator = Paginator(bookmarks, 10)

    if requested_page is None:
        page_object = paginator.page(1)
    else:
        page_object = paginator.page(requested_page)

    serialized_bookmarks = [{"quote_id": bookmark.quote.id,
                             "quote": bookmark.quote.quote,
                             "author": bookmark.quote.author} for bookmark in page_object]
    
    total_pages = paginator.num_pages
    page_number = page_object.number

    return JsonResponse({"bookmarks": serialized_bookmarks,
                         "total_pages": total_pages,
                         "page_number": page_number}, status=200)
    


@require_http_methods(["POST"])
def search(request):
    data = json.loads(request.body.decode("utf-8"))
    search_type = data.get("searchType")
    search_value = data.get("searchValue")
    requested_page = data.get("requestedPage")

    # Fetch quotes based on search type
    if search_type == "quote":
        quotes = Quote.objects.filter(quote__icontains=search_value).order_by("-id")
    else:
        quotes = Quote.objects.filter(author__icontains=search_value).order_by("-id")

    paginator = Paginator(quotes, 10)

    if requested_page is None:
        page_object = paginator.page(1)
    else:
        page_object = paginator.page(requested_page)

    serialized_quotes = [{"quote_id": quote.id,
                          "quote": quote.quote,
                          "author": quote.author,
                          "category": quote.category} for quote in page_object]
    
    total_pages = paginator.num_pages
    page_number = page_object.number

    return JsonResponse({"quotes": serialized_quotes,
                         "total_pages": total_pages,
                         "page_number": page_number}, status=200)

    




"""
def import_csv(request):
    row_num = 1
    file_path = '/home/sya/Downloads/quotes.csv'
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header row if present
        for row in reader:
            quote, author, category = row
            Quote.objects.create(quote=quote, author=author, category=category)
            print(f"Importing row NO.{row_num}")
            row_num += 1
    return HttpResponse('Quotes imported successfully!')
"""