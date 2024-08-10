# korean-dictionary

이 문서는 한국어로도 읽을 수 있습니다. [바로가기](README_kr.md)

A Korean dictionary web application for intermediate-advanced learners of Korean.

## Table of Contents
- [Features](#features)
- [Inspiration](#inspiration)
- [Technologies and Additional Resources](#technologies-and-additional-resources)
- [Trying the Dictionary](#trying-the-dictionary)
  - [Use Docker Compose](#use-docker-compose)
- [License](#license)

## Features

- Search words in the Korean dictionary (select 한 next to the search bar) or the Hanja dictionary (select 漢 next to the search bar).
- Romanized input will be converted to hangul if you do not have a Korean keyboard ('gksrnrdj' -> '한국어').

  For Korean words:
    - View information about a word's meanings, examples of its usage, its history, relations with other words, and more.
    - You can use the characters ., *, {, }, etc to search using regex patterns if desired.
  
  For Hanja characters:  
    - View information about a character's meaning, Korean words that contain the character, and more.
    - Practice writing the character with a testing feature.
    - You can search a level on the administered Hanja exam to get the characters at that level (search '8급', '준4급', '미배정', ...) by searching with a term like '급수별[8급]'.
      - This also works for radicals, stroke numbers, component characters, the education level, and the explanation section with different search term forms (respectively, 부수[], 획수[], 모양자 분해[], 교육용[], and 설명[]).
    - You can search '.*' to match with all Hanja characters. Arbitrary regex patterns are not supported.
    
- Click on words in most sentences to automatically search for the word in the Korean dictionary. This can be inaccurate.
- Hover over most Hanja characters to view their meanings and some words containing the character. Click to search for the character in the Hanja dictionary.
- You can also right click or hold CTRL while clicking on many words and Hanja characters to instead search in the other panel.

- Move between pages viewed with the arrows to the right of the search bar.
- All features are panel-specific; the settings of one half of the screen do not affect the other.
- If you only want one panel, click the down arrow at the far right of the top bar to hide a panel's contents.

If you create an account and log in, the following features are also available:
- The ability to add personal (and private) example sentences and pictures to any Korean word's dictionary entry.
- Add words to your list of known words and your list of words you are currently studying.
- All Korean word result lists are reordered to move words you know or are studying to the top of the results.
- View a homepage with access to:
  - Lists of your known words and studying words.
    - A review tool to practice the words you are currently studying. 
  - A reminder about words in your study list and words you know with a shared Hanja character.
  - A Hanja game to review the Hanja origins of Korean words.
  - A tool to expedite the process of adding words to your list of known words.

## Inspiration
The goal of this project was to combine the best parts of several existing resources for Korean learners/general learners:  
1. [Naver Dictionary](https://ko.dict.naver.com/#/main)'s extensive data and word database  
2. [Chinese Character Study Q2/한자공부Q 2](https://play.google.com/store/apps/details?id=com.aribada.edu.qhanja&hl=ko)'s Hanja character example words  
3. [Anki](https://apps.ankiweb.net/)'s ability to pair words with images or personal example sentences

I wanted a single dictionary where a user could search any word they wanted as in Naver Dictionary. However, if they log in, they can also add example sentences and pictures directly into the dictionary entry, analogous to writing in the margins of a paper dictionary with your own context. Additionally, the user was to be able to mark words as "prioritized", forcing them to the top of the results when any query is made (notably for Hanja example words). None of these would apply to other users, meaning every user has their own annotated "copy" of the same dictionary.

## Technologies and Additional Resources
Frontend: React + Plain CSS for styling.

Backend: Django  
* [REST framework](https://www.django-rest-framework.org)  
* [Knox](https://github.com/jazzband/django-rest-knox) for authentication  

The following resources are used in this project:  
* [Urimalsaem (우리말샘)](https://opendict.korean.go.kr/main) for the base dictionary data  
* [Namuwiki (나무위키)](https://namu.wiki) for Hanja character data  
* [Hanzi Writer](https://hanziwriter.org/) ([git](https://github.com/chanind/hanzi-writer)) for Hanja stroke animations
* [makemeahanzi](https://www.skishore.me/makemeahanzi/) ([git](https://github.com/skishore/makemeahanzi)) for Hanja character data
* [konlpy](https://konlpy.org/en/latest/) ([git](https://github.com/konlpy/konlpy)) for Korean language processing  

## Trying the Dictionary

You can try the dictionary yourself using [Docker](https://www.docker.com/).

Things to be aware of:  
1. **The dictionary does not have any English support!**  
2. The abridged dataset is very small to keep container sizes smaller. Most of the words in the dictionary start with ㄱ because it is first alphabetically. You can also search '.*' to see every word.  
3. You can log in with the username '척척박사' and the password 'secret'. This account knows every word in the dictionary,
which is good for trying the Hanja game without spending hours adding words to the known list.  

### Use Docker Compose
1. [Download the docker-compose.yml](docker-compose.yml) file for the project to your machine.
2. In the directory with the .yml file, run `docker-compose up -d` to pull [the docker repository for this project](https://hub.docker.com/repository/docker/krduffy/korean-dictionary/general) and start running the image.
3. Go to localhost port 5173 ([link](http://localhost:5173/)) to use the dictionary. Your page may be blocked by a network error page until the database is done being initialized.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

This project uses various third-party resources and libraries, each with its own license:

- Data from Urimalsaem (우리말샘): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Data from Namuwiki (나무위키): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- Data from makemeahanzi: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)
- konlpy: [GNU General Public License (GPL)](LICENSES/gpl.txt)

Please refer to each project's license for more details on their terms of use.
