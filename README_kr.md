# 한국어 사전

This document is also available in English. [Go to English version](README.md)

한국어 중급 학생을 위한 웹 사전입니다.

## 목차
- [특징](#특징)
- [만들게 된 계기](#만들게-된-계기)
- [도구와 다른 리소스](#도구와-다른-리소스)
- [사전을 직접 써보기](#사전을-직접-써보기)
  - [Docker Compose 사용법](#docker-compose-사용법)
- [라이선스](#라이선스)

## 특징
- 검색어 구역 옆에 '한'을 선택해서 한국어 대사전에 검색하거나, '漢' 한자를 선택해서 한자 사전에 검색할 수 있습니다.
  - 한국어 단어는 뜻풀이, 용례, 역사적인 형태 같은 정보를 확인할 수 있으며 한자는 훈음, 해당 한자가 담긴 한국어 단어 목록 같은 정보를 확인할 수 있습니다.
  - 한자는 획순을 보거나 획순 시험을 해볼 수도 있습니다.
- 대부분 문장은 어떤 단어를 클릭하면 한국어 사전에 검색됩니다.
- 대부분 한자 위에 마우스를 올려놓으면 훈음과 해당 한자가 담긴 단어가 보입니다. 클릭하면 한자 사전에 검색됩니다.
- 검색어 구역 오른쪽에 있는 화살표를 클릭하면 이전 페이지나 이후 페이지로 이동할 수 있습니다.
- 검색어 구역 바로 왼쪽에 있는 버튼을 누르면 복사한 내용을 검색어로 붙여내기를 합니다.
- 화면이 갈라져 있는데 모든 특징은 해당 화면 절반에만 유효합니다.
- 절반의 맨 오른쪽 버튼을 누르면 그 절반의 내용을 숨길 수 있습니다.

계정을 만들어 로그인하면, 다음 특징도 사용할 수 있습니다.
- 한국어 단어의 사전 페이지에 개인적인 예문과 이미지를 덧붙일 수 있습니다. 타인에게는 안 보입니다.
- '아는 단어 목록'과 '공부하는 단어 목록'에 한국어 단어를 추가할 수 있습니다.
- 한국어 사전에 검색을 할 경우에 아는 단어 목록이나 공부하는 단어 목록에 추가한 단어가 맨위로 올려밀립니다.
- 자세한 홈페이지를 볼 수 있습니다.
   - 공부 암기장에 추가한 단어, 아는 단어 목록들을 볼 수 있습니다.    
   - 공부하고 있는 단어, 두개 아는 단어 중에 둘 다 포함된 한자 정보를 볼 수 있습니다.
   - 단어의 어원을 연마하기 위한 한자 게임이 열립니다.
   - 아는 단어 목록에 많은 단어를 추가하기에 유익한 도구도 열립니다.

## 만들게 된 계기
한국어를 공부하면서 누적된 좌절감을 해결하려고 만들었습니다. 좌절감은 썼던 도구 (사전, 알고리즘 등) 때문이었는데, 이 도구들 각각의 장점을 
들이며 단점을 다 도려내서 저만의 '완벽한 사전'을 만들고 말겠다는 의욕이 생긴 것 같습니다.   
특히, 다음 장점을 포함하려고 했습니다.
1. [네이버 국어사전](https://ko.dict.naver.com/#/main)의 단어 숫자 및 데이터베이스의 철저함.
2. [한자공부Q 2](https://play.google.com/store/apps/details?id=com.aribada.edu.qhanja&hl=ko)의 잘 나열한 한자 용례.
3. [Anki (안키)](https://apps.ankiweb.net/)의 개인이 추가한 텍스트나 이미지를 들일 수 있는 것.

'완벽한 사전'은 구체적으로 네이버의 대형 데이터베이스 바탕으로 만들어져야 합니다. 로그인한 사용자가 자기가 접한 예문, 이미지를 어떤 단어에도
붙여서 맥락을 '저장'할 수 있게 됩니다. 또 단어를 검색 결과 순위에 올려밀릴 시스템을 통해서 한자 용례를 볼 때 정확하고 유익한 순서로 나열돼
있습니다. 즉, 종이 사전 여백에다 적을 수 있듯이 개인적인 맥락을 적을 수 있는 전자 사전을 만들고 싶었습니다.

## 도구와 다른 리소스
프론트엔드: 리액트 + CSS

백엔드: Django  
* [REST framework](https://www.django-rest-framework.org)  
* [Knox](https://github.com/jazzband/django-rest-knox) (계정 인증)

이 프로젝트는 다음 리소스를 이용합니다.  
* [우리말샘](https://opendict.korean.go.kr/main)의 기본 사전 데이터  
* [나무위키](https://namu.wiki)의 한자 데이터  
* [Hanzi Writer](https://hanziwriter.org/)([git](https://github.com/chanind/hanzi-writer))의 한자 획순 동영상
* [makemeahanzi](https://www.skishore.me/makemeahanzi/)([git](https://github.com/skishore/makemeahanzi))의 한자 데이터
* [konlpy](https://konlpy.org/en/latest/)([git](https://github.com/konlpy/konlpy))의 한국어 자연어처리(NLP) 알고리즘

## 사전을 직접 써보기

[다커(Docker)](https://www.docker.com/)가 로컬에서 설치되어 있으면 사전을 써볼 수 있으며, 이는 두 가지 방법이 있습니다.

시도해보시면 명심할 점:
1. 단어수가 높으면 다커컨테이너 용량도 증가하니 데이터베이스는 거의 모든 단어가 누락되어 있습니다.
2. 가나다순으로 처음이니 누락되지 않은 단어는 첫 글자 총성이 주로 ㄱ입니다.
3. 어떤 검색어를 입력해도 결과가 계속 안 나오지 않으면 모든 단어를 보여주는 '.*'를 검색해보세요.
4. 사전을 사용해보면 아이디 '척척박사'와 비밀번호 'secret'으로 로그인할 수 있습니다. 이 계정은 사전에 모든 단어를 알고 있으니까 한자 게임을 편하게 해볼 수 있습니다. 
(이미 알던 단어를 아는 단어 목록에 추가하는 과정이 수십 시간이 걸립니다.) 

다커를 깔아놓기가 안 하고 싶으시다면 예시 동영상을 보실 수 있습니다. 본 동영상은 소리가 안 나니 자막을 켜고 보시길 바랍니다.

[![예시 동영상 링크](https://img.youtube.com/vi/u57sR2-4sS8/0.jpg)](https://www.youtube.com/watch?v=u57sR2-4sS8)

### Docker Compose 사용법
1. [docker-compose.yml](docker-compose.yml) 파일을 본인 컴퓨터로 다운받으세요.
2. .yml 파일이 있는 디렉터리에서 `docker-compose up -d` 명령어를 실행하세요. [다커 리포지토리](https://hub.docker.com/repository/docker/krduffy/korean-dictionary/general)를 다운받고 이미지를 작동하는 명령어입니다.
3. 로컬호스트 포트 5173 ([링크](http://localhost:5173/))로 이동하면 사전을 써볼 수 있습니다. 데이터베이스가 채워졌을 때까지 네트워크 오류가 발생할 수도 있으나 잠시만 기다리시고 다시 시도해보시면 됩니다.

## 라이선스

이 프로젝트는 GNU General Public License v3.0(GPL-3.0)에 따라 라이센스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

이 프로젝트가 사용하는 리소스 및 라이브러리는 자체 라이선스들을 가지고 있습니다.

- 우리말샘 데이터: [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- 나무위키 데이터: [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- makemeahanzi 데이터: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)
- konlpy: [GNU General Public License (GPL)](LICENSES/gpl.txt)

사용 조건에 대한 자세한 내용은 각 프로젝트의 라이센스를 참조하세요.


