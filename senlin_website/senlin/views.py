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



# Create your views here.


# def home(request):
    # return HttpResponse('<h1>fdasgssg</h1>')
def home(request):
    # # count #items in table
    # dynamodb = boto3.resource('dynamodb')
    # cards_table = dynamodb.Table('Cards')
    # # users_table = dynamodb.Table('Users')
    # # # get the users
    # # response = users_table.scan(
    # #     Select='SPECIFIC_ATTRIBUTES',
    # #     AttributesToGet=['User_id'],
    # # )
    # # user_id = response['Items'][0]['User_id']
    # # scan all to get all item
    # response = cards_table.scan(
    #     Select='SPECIFIC_ATTRIBUTES',
    #     AttributesToGet=['Back', 'Front', 'Pronunciation']
    # )
    # all_cards = response['Items']
    # print(all_cards)
    data = [{'some': 'data'}]
    jsondata = json.dumps(data)
    return render(request, 'senlin/home.html')


# class words(APIView):
#     def get(self, request):
#         return Response([{'some': 'data'}])
#     def post(self):
#         pass


def words(request):
    if request.method == 'GET':
        userid = '64b93d2e-138f-45f6-a118-66968cd62b20'
        try:
            dynamodb = boto3.resource('dynamodb')
            cards_table = dynamodb.Table('Cards')
            user_schedule_table = dynamodb.Table('UserWordList')

            # Fetch all cards
            cards_response = cards_table.scan()

            # convert the cards structure to a card_id  : details dictionary
            cards_dict = {}
            for item in cards_response['Items']:
                cards_dict[item['Card_id']] = item
            # fetch all revison schedule which timestamp is less than this moment next day
            now_timestamp = int(time.time()/86400)
            print (now_timestamp)


            daily_words_limit = 10
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
                    print('Sorted:', item)
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
        pass


def insert_memories(request):
    if request.method == 'POST':
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
        pass
