# korean-dictionary

이 문서는 한국어로도 읽을 수 있습니다. [바로가기](README_kr.md)

A Korean dictionary web application for intermediate learners of Korean.

## Features

- Search words in the Korean dictionary (select 한 next to the search bar) or the Hanja dictionary (select 漢 next to the search bar).

  For Korean words:  
    - View information about a word's meanings, examples of its usage, its history, relations with other words, and more.
  
  For Hanja characters:  
    - View information about a character's meaning, Korean words that contain the character, and more.
    - Practice writing the character with a testing feature.
    
- Click on words in most sentences to automatically search for the word in the Korean dictionary. This can be inaccurate.
- Hover over most Hanja characters to view their meanings and some words containing the character. Click to search for the character in the Hanja dictionary.
- Move between pages viewed with the arrows to the right of the search bar.
- Paste clipboard contents into the search bar with the button to the immediate left of the search bar.
- All features are panel-specific; the settings of one half of the screen do not affect the other.
- If you only want one panel, click the down arrow at the far right of the top bar to hide a panel's contents.

If you create an account and log in, the following features are also available:
- The ability to add personal (and private) example sentences and pictures to any Korean word's dictionary entry.
- Add words to your list of known words and your list of words you are currently studying.
- All Korean word result lists are reordered to move words you know or are studying to the top of the results.
- View a homepage with access to:
  - Lists of your known words and studying words.
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

There are two options for locally running a test dictionary with an abridged dataset, both of which use [Docker](https://www.docker.com/).

If you use either option to run the dictionary, you can log in with the username '척척박사' and the password 'secret'. This account knows every word in the dictionary,
which is good for trying the Hanja game without spending hours adding words to the known list.

### Run Locally with Docker Compose
1. Download this repository.
2. Run the command `docker-compose up --build` in the downloaded project's top-level directory (/korean-dictionary).
3. Wait for the sample database to be populated. "Completed database initialization." will be printed when this process completes. On subsequent launches, this step will be skipped.
4. Go to localhost port 5173 ([link](http://localhost:5173/)) to use the dictionary.  

#### Resetting the Dictionary  
To reset the database to its initial state, run `docker-compose down -v` in the top-level directory and then rerun with `docker-compose up --build`.  

### Use Docker Pull
1. Run `docker pull krduffy/korean-dictionary:latest` to pull [the docker repository for this project](https://hub.docker.com/repository/docker/krduffy/korean-dictionary/general) to your machine.
2. Run the container using `docker run -p 5173:5173 krduffy/korean-dictionary:latest`.
3. Go to localhost port 5173 ([link](http://localhost:5173/)) to use the dictionary.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

This project uses various third-party resources and libraries, each with its own license:

- Data from Urimalsaem (우리말샘): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Data from Namuwiki (나무위키): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- Data from makemeahanzi: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)
- konlpy: [GNU General Public License (GPL)](LICENSES/gpl.txt)

Please refer to each project's license for more details on their terms of use.
