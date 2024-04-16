# 벨로그 클론코딩

## ✏️ working category

개인 사이드 프로젝트
<br />
<br />
🖥️ using project : https://j-log.netlify.app
<br />

## 📃 using lang

TypeScript,React,React-dom,react-query,firebase,ContextAPI,SCSS
<br />
<br />

## 프로젝트 아이디어

1. 개인 사이드 프로젝트를 하면서 백엔드를 연동 할 수 없을까 생각하다 firebase 를 채용
2. firebase와 api 통신을 하면서 상태관리에 간편한 react-query를 채용
   <br />
   <br />

## Preview

  <img src="./public/img/preview.jpg" alt="" />

### 📌 주요기능

- 로그인/회원가입/SNS로그인/비밀번호 찾기
- 홈에 게시물들 노출/게시글 작성/댓글작성/게시글 좋아요
- 게시글 수정&삭제/이미지추가&수정&삭제
- 프로필변경/닉네임변경/회원탈퇴

### 🧑🏻‍💻 트러블 슈팅

#### 문제발견 1

구글로그인으로 로그인을 하면 구글계정으로 부터 모든 정보를 불러와서 로그인 하게 되는데, 이렇게 로그인을 하면 회원 탈퇴 할 시
한번 더 확인 하기 위한 비밀번호를 입력 할 구간이 없다.

#### 문제인식

회원탈퇴시 입력되어야 할 비밀번호를 따로 어딘가에 저장 해주어야 한다.

#### 문제 판단

DB에 uid를 title로 구글 로그인 을 할 때만 password를 입력하게 해주어야 한다.

#### 해결법

DB에서 uid-G가 있는지 확인 후 없다면 새로 password를 입력하고 있다면 그냥 넘어가게 코드를 짬

<img src="/public/img/error1.jpg">

<hr />

#### 문제발견 2

UPLOAD와 EDIT 페이지의 사용되는 (함수,컴포넌트 html)가 같고 (페이지에 관한 데이터)만 다르기 때문에 이것들을 <br />하나로 재사용 할 수 없을까 고민

#### 문제 판단

아래와 같이 트리구조를 짬

<img src="/public/img/tree.jpg">

#### 해결법

파일을 업로드 했을 때 이미지를 노출해주는 걸 한 함수로 표현
