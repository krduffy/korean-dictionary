# korean-dictionary

A Korean dictionary web application for (~intermediate+) learners of Korean.


## Inspiration
The goal of this project was to combine the best parts of several existing resources for Korean learners/general learners:  
1. [Naver Dictionary](https://ko.dict.naver.com/#/main)'s extensive data and word database  
2. [Chinese Character Study Q2/한자공부Q 2](https://play.google.com/store/apps/details?id=com.aribada.edu.qhanja&hl=ko)'s Hanja character example words  
3. [Anki](https://apps.ankiweb.net/)'s ability to pair words with images or personal example sentences

I wanted a single dictionary where a user could search any word they wanted as in Naver Dictionary. However, if they log in, they can also add example sentences and pictures directly into the dictionary entry, analogous to writing in the margins of a paper dictionary with your own context. Additionally, the user was to be able to mark words as "prioritized", forcing them to the top of the results when any query is made (notably for Hanja example words). None of these would apply to other users, meaning every user has their own annotated "copy" of the same dictionary.

## Technologies and Additional Resources
Frontend: React
Backend: Django 
      - [REST framework](https://www.django-rest-framework.org)
      - [Knox](https://github.com/jazzband/django-rest-knox) for authentication
Plain CSS was used for styling.

The following resources are used in this project:
[Urimalsaem (우리말샘)](https://opendict.korean.go.kr/main) for the base dictionary data  
[Namuwiki (나무위키)](https://namu.wiki) for Hanja character data  
[Hanzi Writer](https://hanziwriter.org/) ([git](https://github.com/chanind/hanzi-writer)) for Hanja stroke animations and Hanja character data  
[konlpy](https://konlpy.org/en/latest/) ([git](https://github.com/konlpy/konlpy)) for Korean language processing  






