from __future__ import print_function
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    users_word_list = dynamodb.Table('UserWordList')
    print(event)

    for record in event['Records']:
        grade = 0
        currentUserID = record['dynamodb']['NewImage']['User_id']['S']
        currentTimestamp = record['dynamodb']['NewImage']['Timestamp']['N']
        currentCardID = record['dynamodb']['NewImage']['Card_id']['S']
        currentTimeTaken = record['dynamodb']['NewImage']['Timetaken']['N']
        currentCorrect = record['dynamodb']['NewImage']['Correct']['BOOL']
        # print('User_id: ', currentUserID)
        # print('Timestamp: ', currentTimestamp)
        # print('Card_id: ', currentCardID)
        # print('Timetaken: ', currentTimeTaken)
        # print('Correct: ', currentCorrect)

        # grab the # of repetition of the word and EF
        response = users_word_list.query(
            KeyConditionExpression=Key('Card_id').eq(currentCardID) & Key('User_id').eq(currentUserID)
        )
        items = response['Items']
        if len(items) != 0:
            rep = int(items[0]['Repetition']) + 1
            ef = items[0]['EF']

            # update plan
            response = users_word_list.update_item(
                Key={
                    'User_id': currentUserID,
                    'Card_id': currentCardID
                },
                UpdateExpression="set Repetition = :r, EF=:e, Intvl=:i",
                ExpressionAttributeValues={
                    ':r': Decimal(rep),
                    ':e': Decimal(ef).quantize(Decimal('0.00')),
                    ':i': Decimal(10)
                },
                ReturnValues="UPDATED_NEW"
            )
            print('Card_id ', currentCardID, ' Repetition: ', rep)
        else:
            ef = 2.5
            rep = 0
            print('Repetition ', rep, ' EF: ', ef)
            # create plan
            response = users_word_list.put_item(
                Item={
                    'User_id': currentUserID,
                    'Card_id': currentCardID,
                    'Repetition': Decimal(0),
                    'EF': Decimal(2.5).quantize(Decimal('0.00')),
                    'Intvl': Decimal(10),
                }
            )
            print('Card_id ', currentCardID, ' Repetition: ', rep)
            # # estimate current memory of the word
            # if currentCorrect == True:
            #     if currentTimeTaken <= 3:
            #         grade = 5
            #     elif 3 < currentTimeTaken <= 6:
            #         grade = 4
            #     elif 7 < currentTimeTaken <= 9:
            #         grade = 3
            #     else:
            #         grade = 2
            # else:
            #     if currentTimeTaken <= 6:
            #         grade = 0
            #     else:
            #         grade = 1

    print('Successfully processed %s records.' % str(len(event['Records'])))
