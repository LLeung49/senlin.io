import boto3
from django.shortcuts import render
from django.http import HttpResponse
import time
import datetime
from boto3.dynamodb.conditions import Key, Attr
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.http import Http404
from decimal import Decimal
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views import generic
from django.views.generic import View
from .forms import User
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from .forms import UserForm

# Create your views here.


def home(request):

    if request.method == 'GET' and request.user.is_authenticated():
        dynamodb = boto3.resource('dynamodb')
        user_schedule_table = dynamodb.Table('UserWordList')
        cards_table = dynamodb.Table('Cards')
        now_timestamp = int(time.time() / 86400)
        review_response = user_schedule_table.query(
            FilterExpression=Attr('Intvl').lte(now_timestamp),
            KeyConditionExpression=Key('User_id').eq(request.user.username),
        )
        total_reviews_response = user_schedule_table.query(
            KeyConditionExpression=Key('User_id').eq(request.user.username),
        )
        print review_response['Count']

        numOfWords = int(request.GET.get('numOfWords', 0))
        print 'Receive request from '+ request.user.username + '\nNum of words: ' + str(numOfWords)
        return render(request, 'senlin/home.html', {'numOfWords': numOfWords,
                                                    'numOfLearned': total_reviews_response['Count'],
                                                    'totalNumOfWords': cards_table.item_count,
                                                    'numOfReview': review_response['Count']
                                                    })
    else:
        notification = "Please log in first."
        return render(request, 'senlin/message.html', {'message': notification})


class UserFormView(View):
    template_name = 'senlin/login.html'
    form_class = UserForm

    def get(self, request):
        logout(request)
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        logout(request)
        num_fields = len(request.POST)
        print(num_fields)
        notification = ''
        if num_fields == 6:
            form = self.form_class(request.POST)
            if form.is_valid():

                user = form.save(commit=False)
                # cleaned data
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                user.set_password(password)
                user.save()
                # check if user register successfully
                if User.objects.get(username=username):
                    notification = "Thanks for join us."

                    dynamodb = boto3.resource('dynamodb')
                    user_table = dynamodb.Table('Users')
                    try:
                        # print(request.POST.get('data[cardId]'))
                        user_table.put_item(
                            Item={
                                'User_id': form.cleaned_data['username'],
                                'Email': form.cleaned_data['email'],
                                'FirstName':form.cleaned_data['first_name'],
                                'LastName': form.cleaned_data['last_name']
                            }
                        )
                        print('Added new user.')

                    except KeyError:
                        return HttpResponse('Upload user\'s info failed!')

                else:
                    notification = "Registration is declined."
            else:
                notification = "Form is not valid."
            return render(request, 'senlin/message.html', {'message': notification})
        elif num_fields == 3:
            username = request.POST['username']
            password = request.POST['password']
            # return user object if credentials are correct
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    # return render_to_response('main/task.html', {'user': user}, RequestContext(request))
                    return HttpResponseRedirect(reverse('senlin:home'))
            notification = "Login attempt is declined."
            return render(request, 'senlin/message.html', {'message': notification})
        # return HttpResponseRedirect(reverse('main:task'))


def words(request):
    print "Receive fetch action from: ", request.GET.get('username'), request.GET.get('num')
    if request.method == 'GET':
        userid = str(request.GET.get('username'))
        try:
            daily_words_limit = int(request.GET.get('num'))
            dynamodb = boto3.resource('dynamodb')
            cards_table = dynamodb.Table('Cards')
            user_schedule_table = dynamodb.Table('UserWordList')
            # Fetch all cards
            cards_response = cards_table.scan()

            # convert the cards structure to a card_id  : details dictionary
            cards_dict = {}
            for item in cards_response['Items']:
                cards_dict[item['Card_id']] = item

            if daily_words_limit == 0:
                # get the users
                viewed_response = user_schedule_table.query(
                    KeyConditionExpression=Key('User_id').eq(userid)
                )
                revision_dict = {}
                current_return_list = []
                for item in viewed_response['Items']:
                    revision_dict[item['Card_id']] = item['LastViewd']
                for item in sorted(revision_dict.items(), key=lambda k: k[1]):

                    # date = datetime.datetime.fromtimestamp((item[1]-1)*86400)
                    date = time.strftime('%Y-%m-%d ', time.localtime((item[1]-1)*86400))
                    a = cards_dict.pop(item[0])
                    b = {'LastViewed': date}
                    a.update(b)
                    current_return_list.append(a)
                    print a
                stats = {
                    'words': current_return_list
                }

            else:

                # fetch all revison schedule which timestamp is less than this moment next day
                now_timestamp = int(time.time()/86400)
                print (now_timestamp)

                review_response = user_schedule_table.query(
                    FilterExpression=Attr('Intvl').lte(now_timestamp),
                    KeyConditionExpression=Key('User_id').eq(userid),
                )
                future_learning_response = user_schedule_table.query(
                    FilterExpression=Attr('Intvl').gt(now_timestamp),
                    KeyConditionExpression=Key('User_id').eq(userid),
                )

                # print(review_response['Items'])
                current_learning_list = []
                # convert the review_response['Item'] to dictionary in order to sort
                revision_dict = {}
                for item in review_response['Items']:
                    revision_dict[item['Card_id']] = item['Intvl']
                count = 0
                for item in sorted(revision_dict.items(), key=lambda k: k[1]):
                    if count < daily_words_limit:
                        print'Sorted:', item
                        current_learning_list.append(cards_dict.pop(item[0]))
                        count += 1
                    else:
                        cards_dict.pop(item[0])


                # get the details of the words which need to be reviewed and delete it in the cards dict
                # for item in review_response['Items']:
                #     # print(item['Card_id'])
                #     current_learning_list.append(cards_dict.pop(item['Card_id']))
                num_of_scheduled_words = len(current_learning_list)
                print('# of words need to review: ', num_of_scheduled_words)
                num_of_viewed_words = len(review_response['Items']) + len(future_learning_response['Items'])
                print('# of words reviewed words: ', num_of_viewed_words)

                # delete the cards which do not to be reviewed
                for item in future_learning_response['Items']:
                    cards_dict.pop(item['Card_id'])
                num_of_new_words = len(cards_dict.keys())
                print('# of new words: ', num_of_new_words)

                # grab new words if # of words need to be reviewed is less than daily new words limit

                if len(current_learning_list) < daily_words_limit:
                    for i in range(daily_words_limit - len(current_learning_list)):
                        current_learning_list.append(cards_dict.popitem()[1])
                print('# of words generated for user: ', len(current_learning_list))

                # for item in current_learning_list:
                #     print(item['Front'])
                # print(current_learning_list)


                stats = {
                    'numOfScheduledWords': num_of_scheduled_words,
                    'numOfNewWords': num_of_new_words,
                    'words': current_learning_list
                }
        except KeyError:
            return HttpResponse('Fetch Words Error!')  # incorrect post

        # data = [{'some': 'data'}]

        jsondata = json.dumps(stats)
        return HttpResponse(jsondata, content_type="application/json")
    else:
        stats = {
            'msg': "Not log in",

        }
        jsondata = json.dumps(stats)
        return HttpResponse(jsondata, content_type="application/json")


def insert_memories(request):
    if request.method == 'POST' and request.user.is_authenticated():
        dynamodb = boto3.resource('dynamodb')
        memories_table = dynamodb.Table('Memories')
        answer = False
        if request.POST.get('data[correct]') == 'true':
            answer = True

        try:
            # print(request.POST.get('data[cardId]'))
            memories_table.put_item(
                Item={
                    'User_id': request.POST.get('data[userId]'),
                    'Card_id': request.POST.get('data[cardId]'),
                    'Timestamp': Decimal(request.POST.get('data[timeStamp]')),
                    'Timetaken': Decimal(request.POST.get('data[timeSpend]')),
                    'Correct': answer,
                }
            )
            print('Added new memory.')
            print(request.POST.get('data[userId]'), request.POST.get('data[cardId]'),Decimal(request.POST.get('data[timeStamp]')), Decimal(request.POST.get('data[timeSpend]')), answer)
        except KeyError:
            return HttpResponse('Upload memories failed!')

        return HttpResponse('Upload memories successfully!')
    else:
        notification = "Please log in first."
        return render(request, 'senlin/message.html', {'message': notification})
