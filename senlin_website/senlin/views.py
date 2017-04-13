import boto3
from django.shortcuts import render
from django.http import HttpResponse
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
        try:
            dynamodb = boto3.resource('dynamodb')
            cards_table = dynamodb.Table('Cards')
            response = cards_table.scan(
                Select='SPECIFIC_ATTRIBUTES',
                AttributesToGet=['Card_id', 'Back', 'Front', 'Pronunciation']
            )
            all_cards = response['Items']
            print(all_cards[0])
        except KeyError:
            return HttpResponse('Fetch Words Error!')  # incorrect post

        # data = [{'some': 'data'}]

        jsondata = json.dumps(all_cards)
        return HttpResponse(jsondata, content_type="application/json")
    else:
        pass


def insert_memories(request):
    if request.method == 'POST':
        dynamodb = boto3.resource('dynamodb')
        memories_table = dynamodb.Table('Memories')

        try:
            # print(request.POST.get('data[cardId]'))
            memories_table.put_item(
                Item={
                    'User_id': request.POST.get('data[userId]'),
                    'Card_id': request.POST.get('data[cardId]'),
                    'Timestamp': Decimal(request.POST.get('data[timeStamp]')),
                    'Timetaken': Decimal(request.POST.get('data[timeSpend]')),
                    'Correct': bool(request.POST.get('data[correct]')),
                }
            )
            print('Added new memory.')
            print(request.POST.get('data[userId]'),request.POST.get('data[cardId]'),Decimal(request.POST.get('data[timeStamp]')),Decimal(request.POST.get('data[timeSpend]')),bool(request.POST.get('data[correct]')))
        except KeyError:
            return HttpResponse('Upload memories failed!')

        return HttpResponse('Upload memories successfully!')
    else:
        pass
