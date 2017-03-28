## Memory of words - 6 Ranks

5 - perfect response 单词记得非常好 
4 - correct response after a hesitation 回想一下,可以正确回忆出单词 
3 - correct response recalled with serious difficulty 稍微吃力的回想一下,可以正确回忆出单词 
2 - incorrect response; where the correct one seemed easy to recall 在提示的情况下,能想起正确的单词 
1 - incorrect response; the correct one remembered 看到答案,对正确单词有印象 
0 - complete blackout. 完全没见过

## Practical implement (my suggestion)

5 —掌握: response with correct meaning immediately (basically no need to learn)

4 —记住: knowing the meaning but it takes some times to response and be sure about the anwser ( can be divide into rank 5 after some consolidation)

3 — 蒙对: not sure which meaning is correct but randomly pick the correct one

2 — 蒙错: not sure which meaning is correct and randomly pick the wrong one. Recall the meaning once the answer appears.

1 —有印象: met a few times but just have very vague memories, cannot guess.

0 — 生词: never met

## Formula from SM2

I(1):=1 
I(2):=6 
for n>2 I(n):=I(n-1)*EF

Which means:
--I(n) is the interval time of each revision schedule, base unit is day.
​	I(n) 是每次单词复习出现的间隔时间,单位是天
--EF is called "Easiness Factor", according to the author, this value is between 1.3~2.5, EF for every new word is 2.5. Based on the process of the review, it need to be adjusted accordingly. EF will set to 1.3 if EF is less than 1.3 otherwise some troublesome repeating problem may occur.
EF是作者自己命名的一个参数,叫做Easiness Factor 难易度因子,这个因子的范围,按照作者的设定介于1.3~2.5之间,任何新单词的默认EF是2.5,根据复习的进度,不断进行相应的调整.如果EF小于1.3的时候,则让EF=1.3否则会出现一些很讨厌的重复的问题,

## The adjustment of EF:

EF' := f(EF,q) = EF+(0.1-(5-q)*(0.08+(5-q)*0.02)) = EF-0.8+0.28*q-0.02*q*q
--q is the learner's response status which is metioned before as those 6 ranks of memory of words.
—In addition, when q = 4, EF' = EF. When q < 3, starting this computing cycle from the begining and the EF is fixed.



## Source Code:

https://www.supermemo.com/english/ol/sm2source.htm



