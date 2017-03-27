import boto3
import uuid
from boto3.dynamodb.conditions import Key, Attr
import time
from datetime import datetime

# count #items in table
dynamodb = boto3.resource('dynamodb')
cards_table = dynamodb.Table('Cards')
# print(cards_table.item_count)

# # count total # of items
# response = cards_table.scan()
# items = response['Items']
# print(len(items))

# # scan all to get an item
# response = cards_table.scan()
# items = response['Items']
# print(items[0], items[1])


# # scan item by attribute
# response = cards_table.scan(
#     FilterExpression=Attr('Front').eq('insight')
# )
# items = response['Items']
# print(items)
#
# # scan item by key
# response = cards_table.scan(
#     FilterExpression=Key('Card_id').eq('fa413c02-201a-4d9e-b1c4-fc32d98804d6')
# )
# items = response['Items']
# print(items)



# # query item by key
# response = cards_table.query(
#     KeyConditionExpression=Key('Card_id').eq('fa413c02-201a-4d9e-b1c4-fc32d98804d6')
# )
# items = response['Items']
# print(items)
#
# # query item by Attribute is WRONG
# response = cards_table.query(
#     KeyConditionExpression=Attr('Front').eq('insight  ')
# )
# items = response['Items']
# print(items)

# create new users

# users_table = dynamodb.Table('Users')
#
# user_id = str(uuid.uuid4())
# users_table.put_item(
#    Item={
#         'User_id': user_id,
#         'Email': '328666566@qq.com',
#         'Name': 'Lucien',
#     }
# )

# scan item by key
response = cards_table.scan(
)
items = response['Items']
print(len(items))

for item in items:
    if 'correct' in item:
        print('Timestamp')
# # epoch to local time
# print(type(time.time()))
# print(datetime.fromtimestamp(time.time()).strftime('%c'))

