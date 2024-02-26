import { ChangeEvent, useEffect, useState } from "react";
import "../asset/detail.scss";
import { useLocation, Link } from "react-router-dom";
import Reply from "./Reply";
import { FirebaseData } from "../module/interfaceModule";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { LoadUserHookResult } from "../query/loadUser";

function Detail({ data }: { data: LoadUserHookResult | undefined }) {
  const location = useLocation();
  const URLID = location.state.pageId;
  const [favoriteBtn, setFavoriteBtn] = useState(false);
  const loadPage = useLoadDetail(URLID);
  const pageData: FirebaseData | undefined = loadPage.data;
  const time = new Date();

  function setCookie(name: string, value: string, expiredays: number) {
    time.setDate(time.getDate() + expiredays);
    document.cookie = `${name} = ${escape(
      value
    )}; expires =${time.toUTCString()};`;
  }

  async function onDelete() {
    const ok = window.confirm("정말 삭제 하시겠습니까?");
    const locate = db.collection("post").doc(URLID);
    const storageRef = storageService.ref();
    if (ok && pageData) {
      pageData.fileName.map(function (item) {
        const imagesRef = storageRef.child(`${pageData.user}/${item}`);
        imagesRef.delete();
      });
    }
    const ReplyData: any[] = [];
    ReplyData.map((item) => locate.collection("reply").doc(item.id).delete());
    locate.delete();
  }

  function favoriteHandler(e: ChangeEvent) {
    const inputEl = e.target as HTMLInputElement;
    if (inputEl.checked && pageData) {
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

  useEffect(() => {
    if (pageData) {
      let imgTarget = Array.from(
        document.querySelectorAll(".att")
      ) as HTMLImageElement[];
      imgTarget.forEach((item) => {
        const naturalWidths = item.naturalWidth;
        const clientWidths = item.offsetWidth;
        if (naturalWidths < clientWidths) {
          item.classList.add("natural-size");
        }
      });
      const grid = document.querySelector(".grid");
      if (grid && imgTarget.length > 1) {
        grid.classList.add("grids");
      }
    }
  }, [pageData]);

  return pageData && data ? (
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
            {data.uid === pageData.writer ||
            data.uid === "cylx7plFnrccO8Qv7wYXEAd1meG2" ? (
              <>
                <div className="right_wrap">
                  <Link to={"/edit"} state={{ pageId: URLID }}>
                    <button className="edit">수정</button>
                  </Link>
                  <button className="delete" onClick={() => onDelete()}>
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
                onChange={(e: ChangeEvent) => favoriteHandler(e)}
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
            <Reply data={data} />
          </div>
        </section>
      </div>
    </div>
  ) : null;
}

export default Detail;
