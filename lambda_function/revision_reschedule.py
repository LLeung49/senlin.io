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
        if 'NewImage' in record['dynamodb']:
            grade = 0
            currentUserID = record['dynamodb']['NewImage']['User_id']['S']
            currentTimestamp = record['dynamodb']['NewImage']['Timestamp']['N']
            currentCardID = record['dynamodb']['NewImage']['Card_id']['S']
            currentTimeTaken = record['dynamodb']['NewImage']['Timetaken']['N']
            currentCorrect = record['dynamodb']['NewImage']['Correct']['BOOL']

            # initialize the parameters
            rep = 1
            ef = 2.50
            interval = 1

            # estimate current memory of the word
            if currentCorrect == True:
                if int(currentTimeTaken) <= 3:
                    grade = 5
                elif 3 < int(currentTimeTaken) <= 6:
                    grade = 4
                elif 7 <= int(currentTimeTaken) <= 9:
                    grade = 3
                else:
                    grade = 2
            else:
                if int(currentTimeTaken) <= 6:
                    grade = 0
                else:
                    grade = 1

            print('Grade =====', grade)

            response = users_word_list.query(
                KeyConditionExpression=Key('Card_id').eq(currentCardID) & Key('User_id').eq(currentUserID)
            )
            items = response['Items']

            print('# of records======', len(items))

            if grade >= 3:
                if len(items) == 0:
                    # no record of this word
                    interval = 1
                    rep = 1
                else:
                    # found record of this word
                    rep = int(items[0]['Repetition'])
                    ef = float(items[0]['EF'])
                    if rep == 1:
                        interval = 6
                        rep = 2
                    else:
                        interval == int(interval * ef)
                        rep = rep + 1

            print("rep===", rep, 'ef=====', ef, 'intterval======', interval)
            # caculate next ef
            if len(items) != 0:
                ef = float(items[0]['EF'])
            ef = ef - 0.80 + 0.28 * grade - 0.02 * grade * grade
            if ef < 1.3:
                ef = 1.3
                interval = int(items[0]['Intvl'])

            print("rep===", rep, 'ef=====', ef, 'interval======', interval)

            # add the new schedule into user word list
            response = users_word_list.update_item(
                Key={
                    'User_id': currentUserID,
                    'Card_id': currentCardID
                },
                UpdateExpression="set Repetition = :r, EF=:e, Intvl=:i",
                ExpressionAttributeValues={
                    ':r': Decimal(rep),
                    ':e': Decimal(ef).quantize(Decimal('0.00')),
                    ':i': Decimal(interval)
                },
                ReturnValues="UPDATED_NEW"
            )

    print('Successfully processed %s records.' % str(len(event['Records'])))
