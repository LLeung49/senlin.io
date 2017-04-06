import boto3
from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.


# def home(request):
    # return HttpResponse('<h1>fdasgssg</h1>')
def home(request):
    # count #items in table
    dynamodb = boto3.resource('dynamodb')
    cards_table = dynamodb.Table('Cards')
    users_table = dynamodb.Table('Users')
    # get the users
    response = users_table.scan(
        Select='SPECIFIC_ATTRIBUTES',
        AttributesToGet=['User_id'],
    )
    user_id = response['Items'][0]['User_id']
    # scan all to get all item
    response = cards_table.scan(
        Select='SPECIFIC_ATTRIBUTES',
        AttributesToGet=['Card_id']
    )
    all_cards = response['Items']


    return render(request, 'senlin/home.html')
