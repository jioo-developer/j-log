import React, { useEffect, useState } from "react";
import "../asset/detail.scss";
import { useLocation, Link } from "react-router-dom";
import Reply from "./Reply";
function Detail() {
  const location = useLocation();
  let URLID = location.state.pageId;
  const [pageData, setPageData] = useState([]);
  const [favoriteBtn, setFavoriteBtn] = useState(false);
  const [fileNameArr, setFileNameArr] = useState([]);
  const [ReplyData, setReplyData] = useState([]);
  let clientWidths;
  let naturalWidths;
  const time = new Date();
  useEffect(() => {
    if (!URLID) URLID = location.state;
    async function init() {
      await db
        .collection("post")
        .doc(URLID)
        .onSnapshot((snapshot) => {
          const postArray = { ...snapshot.data() };
          setPageData(postArray);
        });
      let cookieCheck = document.cookie;
      if (cookieCheck === `${URLID}-Cookie=done`) {
        setFavoriteBtn(true);
      } else {
        setFavoriteBtn(false);
      }
    }

    init();
  }, []);

  function setCookie(name, value, expiredays) {
    time.setDate(time.getDate() + expiredays);
    document.cookie = `${name} = ${escape(
      value
    )}; expires =${time.toUTCString()};`;
  }

  async function onDelete(e) {
    e.preventDefault();
    const ok = window.confirm("정말 삭제 하시겠습니까?");
    const locate = db.collection("post").doc(URLID);
    const storageRef = storageService.ref();
    if (ok && fileNameArr) {
      fileNameArr.map(function (item) {
        const imagesRef = storageRef.child(`${pageData.user}/${item}`);
        imagesRef.delete();
      });

      ReplyData.map((item) => locate.collection("reply").doc(item.id).delete());
      locate.delete();
      navigate("/");
      window.location.reload();
    }
  }

  function favoriteHandler(e) {
    if (e.target.checked) {
      db.collection("post")
        .doc(URLID)
        .update({
          favorite: pageData.favorite + 1,
        })
        .then(() => {
          setCookie(`${URLID}-Cookie`, "done", 1);
          setFavoriteBtn(true);
        });
    }
  }

  function ReplyGet(data) {
    setReplyData(data);
  }

  useEffect(() => {
    if (pageData.length !== 0) {
      console.log(pageData);
      setFileNameArr(pageData.fileName);
      let imgTarget = Array.from(document.getElementsByClassName("att"));
      let grid = document.getElementsByClassName("grid");
      imgTarget.map(function (a, i) {
        naturalWidths = document.getElementsByClassName("att")[i].naturalWidth;
        clientWidths = document.getElementsByClassName("att")[i].offsetWidth;
        if (naturalWidths < clientWidths)
          imgTarget[i].classList.add("natural-size");
      });
      if (imgTarget.length > 1) grid[0].classList.add("grids");
    }
  }, [pageData]);

  return user ? (
    <div className="detail_wrap">
      <div className="in_wrap">
        <section className="sub_header">
          <h1>{pageData.title}</h1>
          <div className="writer_wrap">
            <div className="left_wrap">
              <img src={pageData.profile} alt="" className="profile" />
              <p className="writer">{pageData.user}</p>
              <p className="date">{pageData.date}</p>
            </div>
            {user.uid === pageData.writer ||
            user.uid === "cylx7plFnrccO8Qv7wYXEAd1meG2" ? (
              <>
                <div className="right_wrap">
                  <Link to={"/edit"} state={{ pageData: pageData }}>
                    <button className="edit">수정</button>
                  </Link>
                  <button className="delete" onClick={onDelete}>
                    삭제
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section className="content_wrap">
          <pre className="text">{pageData.text}</pre>
          <div className="grid">
            {pageData.url
              ? pageData.url.map((value, index) => {
                  return <img src={value} className="att" alt="" key={index} />;
                })
              : null}
          </div>
          <div className="comment">
            <div className="favorite_wrap">
              <p className="com_title">게시글에 대한 댓글을 달아주세요.</p>
              <input
                type="checkbox"
                id="favorite_check"
                onClick={(e) => favoriteHandler(e)}
              />
              {!favoriteBtn ? (
                <>
                  <label htmlFor="favorite_check" className="favorite_btn">
                    <span>👍</span>추천&nbsp;{pageData.favorite}
                  </label>
                </>
              ) : (
                <div className="favorite_btn">
                  <span>👍</span>추천&nbsp;{pageData.favorite}
                </div>
              )}
            </div>
            <Reply
              db={db}
              user={user}
              ReplyGet={ReplyGet}
              useInput={useInput}
            />
          </div>
        </section>
      </div>
    </div>
  ) : null;
}

export default Detail;
