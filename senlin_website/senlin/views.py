import boto3
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
import json



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
                AttributesToGet=['Back', 'Front', 'Pronunciation']
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