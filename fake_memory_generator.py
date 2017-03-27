import boto3
import uuid
from boto3.dynamodb.conditions import Key, Attr
import random
import time
from decimal import Decimal

# count #items in table
dynamodb = boto3.resource('dynamodb')
cards_table = dynamodb.Table('Cards')
users_table = dynamodb.Table('Users')
memories_table = dynamodb.Table('Memories')

# get the users
response = users_table.scan(
    Select='SPECIFIC_ATTRIBUTES',
    AttributesToGet=['User_id'],
)
user_id = response['Items'][0]['User_id']
# print('User ID: ', user_id)


# scan all to get all item
response = cards_table.scan(
    Select='SPECIFIC_ATTRIBUTES',
    AttributesToGet=['Card_id']
)
all_cards = response['Items']
# print('#Words: ', len(all_cards), ' Random word id: ',  all_cards[random.randint(0, 9)]['Card_id'], all_cards[random.randint(0, 9)]['Card_id'])


for i in range(10):
    memories_table.put_item(
        Item={
            'User_id': user_id,
            'Card_id': all_cards[random.randint(0, len(all_cards))]['Card_id'],
            'Timestamp': Decimal(time.time()).quantize(Decimal('0.00')),
            'Timetaken': int(random.randint(1, 9)),
            'Correct': True if random.random() > 0.5 else False,
        }
    )
    print('Added %s memories\' record' % str(i+1))



