# korean-dictionary

A Korean dictionary web application for (~intermediate+) learners of Korean.

The goal of this project was to combine the functionalities of several tools for Korean learners/general learners into a single resource. In particular, I wanted to merge the following 3 tools.  
1. [Naver Dictionary](https://ko.dict.naver.com/#/main)  
   The de facto standard for Korean dictionaries. Naver Dictionary is a compilation of several other dictionaries, some of which are from the Korean government and some of which are not.
   ### Main Pro
   Has a large amount of data (it has user-added words, larger number of example sentences, ...)
   ### Main Con
   Also has a large amount of data.
     + Overly long web page; too much scrolling past unwanted/scarcely needed information

2. [Chinese Character Study Q2/한자공부Q 2](https://play.google.com/store/apps/details?id=com.aribada.edu.qhanja&hl=ko)  
   Available as an app. Shows traditional Chinese characters (Hanja) as they are used in many words in Korean.
   ### Main Pro
   List of example words for individual characters prioritizes more archetypical examples than Naver.
   ### Main Con
   Only available as an app as far as I'm aware. Also I think there is a data leak somewhere in the code because it becomes unbearably unresponsive the longer you use it.

3. [Anki](https://apps.ankiweb.net/)  
   A general purpose spaced-repetition flashcard app.
   ### Main Pro
   Customizable. Personal (and therefore more memorable) example sentences and pictures can be added.
   ### Main Con
   Having dictionary definitions requires copy/pasting from some other resource (ie Naver).


To reduce the fragmentation of functionality, I wanted a single dictionary where a user could search any word they wanted as per usual in any dictionary. However, if they log in, they can also add example sentences and pictures directly into the dictionary entry, analogous to writing in the margins of a paper dictionary with your own context. Additionally, the user was to be able to mark words as "prioritized", forcing them to the top of the results when any query is made (notably for Hanja example words). None of these would apply to other users, meaning every user has their own annotated "copy" of the same dictionary, if we extend the analogy.

The following resources are used in this project:
[Urimalsaem (우리말샘)](https://opendict.korean.go.kr/main) for the base dictionary definitions
[Namuwiki (나무위키)](https://namu.wiki) for Hanja character data
[Hanzi Writer](https://hanziwriter.org/) ([git](https://github.com/chanind/hanzi-writer)) for Hanja stroke animations

[konlpy](https://konlpy.org/en/latest/) ([git](https://github.com/konlpy/konlpy))
...




