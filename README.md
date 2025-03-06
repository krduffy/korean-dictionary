# korean-dictionary

** I refactored this entire project. Check it out [here](https://github.com/krduffy/korean-dictionary-2.0) **.

A Korean dictionary web application for intermediate-advanced learners of Korean.

## Table of Contents
- [Features](#features)
- [Inspiration](#inspiration)
- [Technologies and Additional Resources](#technologies-and-additional-resources)
- [License](#license)

## Features

Excluding smaller features, the major points are:

- **Korean Dictionary**
- **Hanja Dictionary** (includes example words for each character)  
- **Personal Annotations**: Add private example sentences and pictures to any word's entry.  
- **Study List & Review System**: Save words and review them later.  

## Inspiration

Before creating this dictionary, I was using two different dictionaries because I liked certain features of each. I was also using separate flashcard software, which was separate from the dictionaries. Essentially, I had too many resources, with definitions, example words, personal example sentences, and images present in some places and absent in others.

The goal of this project was to combine the best parts of all of those resources into one. Particularly, I wanted a single dictionary where a user could search for words and get the best information about the words and their origins, as in any other dictionary. For flashcard functionality, I would also be able to add example sentences and pictures directly into the dictionary entry, analogous to writing in the margins of a paper dictionary. None of these would apply to other users, meaning every user has their own annotated "copy" of the same dictionary.

## Technologies and Additional Resources

**Frontend**:
- React
- Plain CSS for styling

**Backend**:
- Django
- [REST framework](https://www.django-rest-framework.org)  
- [Knox](https://github.com/jazzband/django-rest-knox) for authentication

**Additional Resources**:
- [Urimalsaem (우리말샘)](https://opendict.korean.go.kr/main) for the base dictionary data  
- [Namuwiki (나무위키)](https://namu.wiki) for Hanja character data  
- [Hanzi Writer](https://hanziwriter.org/) ([git](https://github.com/chanind/hanzi-writer)) for Hanja stroke animations
- [makemeahanzi](https://www.skishore.me/makemeahanzi/) ([git](https://github.com/skishore/makemeahanzi)) for Hanja character data
- [konlpy](https://konlpy.org/en/latest/) ([git](https://github.com/konlpy/konlpy)) for Korean language processing  


## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

This project uses various third-party resources and libraries, each with its own license:

- Data from Urimalsaem (우리말샘): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Data from Namuwiki (나무위키): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- Data from makemeahanzi: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)
- konlpy: [GNU General Public License (GPL)](LICENSES/gpl.txt)

Please refer to each project's license for more details on their terms of use.
