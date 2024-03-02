import { useEffect, useState } from "react";
import "../asset/detail.scss";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Reply from "./Reply";
import { FirebaseData } from "../module/interfaceModule";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { LoadUserHookResult } from "../query/loadUser";
import useReply from "../query/loadReply";

type detailProps = {
  data: LoadUserHookResult | undefined;
  postRefetch: any;
};

function Detail({ data, postRefetch }: detailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const URLID = location.state.pageId ? location.state.pageId : location.state;
  const loadPage = useLoadDetail(URLID);
  const pageData: FirebaseData | undefined = loadPage.data;
  const refetch = loadPage.refetch;

  const [lazyload, setLazy] = useState(false);
  const [lazyCount, setLazyCount] = useState(0);

  const reply = useReply(URLID);
  const replyData = reply.data;
  const replyRefetch = reply.refetch;

  const time = new Date();

  function setCookie(name: string, value: string, expiredays: number) {
    time.setDate(time.getDate() + expiredays);
    document.cookie = `${name}=${escape(
      value
    )}; expires=${time.toUTCString()};`;
  }

  function favoriteHandler() {
    const cookieCheck = document.cookie;
    if (data && pageData) {
      if (!cookieCheck.includes(`${data.uid}-Cookie`)) {
        db.collection("post")
          .doc(URLID)
          .update({
            favorite: pageData.favorite + 1,
          })
          .then(() => {
            refetch();
            setCookie(`${data.uid}-Cookie`, "done", 1);
          });
      }
    }
  }

  async function onDelete() {
    const ok = window.confirm("정말 삭제 하시겠습니까?");
    if (ok) {
      const locate = db.collection("post").doc(URLID);
      const storageRef = storageService.ref();
      if (pageData && pageData.fileName.length > 0) {
        pageData.fileName.forEach((item) => {
          const imagesRef = storageRef.child(`${pageData.writer}/${item}`);
          imagesRef.delete();
        });
      }
      if (replyData) {
        replyData.map((item) =>
          locate.collection("reply").doc(item.id).delete()
        );
      }
      locate.delete().then(() => {
        navigate("/");
        postRefetch();
      });
    }
  }

  function lazyfunction() {
    setLazyCount((prev) => prev + 1);
  }

  useEffect(() => {
    if (pageData) {
      if (lazyCount === pageData.url.length) {
        setLazy(true);
      } else {
        setLazy((prev) => prev);
      }
    }
  }, [lazyCount, pageData]);

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

  if (loadPage.isLoading) {
    return <div className="App" />;
  }

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
            data.uid === "MgoM64rubkOZMYOhNJjV8KFZxCV2" ? (
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
          <div
            className="grid"
            style={
              pageData.url.length > 3
                ? { gridTemplateColumns: `repeat(${pageData.url.length},1fr)` }
                : { gridTemplateColumns: `repeat(${3},1fr)` }
            }
          >
            {pageData.url && pageData.url.length > 0
              ? pageData.url.map((value, index) => {
                  return (
                    <img
                      src={value}
                      className="att"
                      alt=""
                      key={index}
                      style={lazyload ? { opacity: 1 } : { opacity: 0 }}
                      onLoad={lazyfunction}
                    />
                  );
                })
              : null}
          </div>
          <div className="comment">
            <div className="favorite_wrap">
              <p className="com_title">게시글에 대한 댓글을 달아주세요.</p>
              <button className="favorite_btn" onClick={favoriteHandler}>
                <span>👍</span>추천&nbsp;{pageData.favorite}
              </button>
            </div>
            <Reply
              data={data}
              replyData={replyData}
              replyRefetch={replyRefetch}
            />
          </div>
        </section>
      </div>
    </div>
  ) : null;
}

export default Detail;
