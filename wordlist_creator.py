import boto3
import codecs
import re
import uuid

def check_contain_chinese(text):  # check if there is any chinese character in a string
    for char in text:
        if '\u4e00' <= char <= '\u9fff':
            return True
    return False

s3 = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')


txt = codecs.open('lucien_words.txt', 'r', encoding='utf-16').read()
lines = txt.split('\n')

front = back = pronunciation = ''
current_front = ''

cards_table = dynamodb.Table('Cards')
print(cards_table.creation_date_time)

for line in lines:
    # line = line.strip()
    index_pattern = re.compile(r'^\d+,')  # identify each line by index number at the beginning
    match = index_pattern.match(line)
    if line == '':
        continue

    if match:
        # line contains index means it is english word
        if "[" in line:
            # line contains [ means it has pron
            en_pattern = re.compile(r'([a-zA-Z\']+[a-zA-Z\' ]+).*\[')       # match word or phrase
            word = en_pattern.findall(line)
            pron_pattern = re.compile(r'\[[\w\W\']+\]?')
            pron = pron_pattern.findall(line)

            if len(word) == 1 and len(pron) == 1:
                pron = re.sub(r'@\d+', '', pron[0]).strip()
                front = word[0].strip()
                if current_front == '':     # first english word
                    current_front = word[0].strip()
                    pronunciation = pron.strip()
                    print('-------First line-------')
                    print('CF: ', current_front)
                    print('F: ', front)
                    print('CP: ', pronunciation)
                    print('P: ', pron)
                    print('B: ', back)
                elif current_front != front:               # next english word
                    print('-------Next line-------')        # save current entry
                    print('CF: ', current_front)
                    print('CP: ', pronunciation)
                    print('B: ', back)
                    if back == '':
                        continue
                    card_id = str(uuid.uuid4())
                    cards_table.put_item(
                        Item={
                            'Card_id': card_id,
                            'Front': current_front,
                            'Pronunciation': pronunciation,
                            'Back': back,
                        }
                    )
                    back = ''
                    current_front = front
                    pronunciation = pron

            else:           # means learning chinese word (skip)
                pass
                # print(line)
                # print(word, pron)
    else:
        if check_contain_chinese(line):     # print only if it is chinese translation
            line = line.strip()
            # print(lines.index(line), line)
            back += ' ' + line

print('-------Last line-------')
print('CF: ', current_front)
print('CP: ', pronunciation)  # export current entry
print('B: ', back)
cards_table.put_item(
    Item={
        'Card_id': card_id,
        'Front': current_front,
        'Pronunciation': pronunciation,
        'Back': back,
    }
                    )
