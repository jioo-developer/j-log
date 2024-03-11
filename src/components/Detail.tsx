import { useCallback, useEffect, useMemo, useState } from "react";
import "../asset/detail.scss";
import { Link } from "react-router-dom";
import Reply from "./Reply";
import { FirebaseData } from "../module/interfaceModule";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import useReply from "../query/loadReply";
import { useMyContext } from "../module/Mycontext";

function Detail() {
  const { location, data, navigate, postRefetch } = useMyContext();

  const URLID: string = useMemo(() => {
    return location.state.pageId ? location.state.pageId : location.state;
  }, [location]);

  const [imageInit, setInit] = useState(false);
  const loadPage = useLoadDetail(URLID);
  const pageData: FirebaseData | undefined = loadPage.data;
  const refetch = loadPage.refetch;

  const reply = useReply(URLID);
  const replyData = reply.data;
  const replyRefetch = reply.refetch;

  const time = new Date();

  function setCookie(name: string, value: string) {
    const time = new Date();
    const result = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      23,
      59,
      59
    );
    result.setMilliseconds(999);
    result.setHours(result.getHours() + 9);
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${result.toUTCString()};`;
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
            setCookie(`${data.uid}-Cookie`, "done");
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

  const lazyloading = useCallback(() => {
    const imgTarget = Array.from(
      document.querySelectorAll(".att")
    ) as HTMLImageElement[];
    const el = document.querySelector(".grid") as HTMLElement;
    if (el) {
      el.style.display = "grid";
      el.style.gap = "0 10px";
      if (imgTarget.length > 2) {
        el.style.gridTemplateColumns = `repeat(${imgTarget.length},1fr)`;
      } else if (imgTarget.length === 2) {
        el.style.gridTemplateColumns = `repeat(${3},1fr)`;
      } else if (imgTarget.length === 1) {
        return false;
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setInit(true);
      lazyloading();
    }, 700);
  }, []);

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
          {imageInit ? (
            <div className="grid">
              {pageData.url && pageData.url.length > 0
                ? pageData.url.map((value, index) => {
                    return (
                      <img src={value} className="att" alt="" key={index} />
                    );
                  })
                : null}
            </div>
          ) : null}
          <div className="comment">
            <div className="favorite_wrap">
              <p className="com_title">게시글에 대한 댓글을 달아주세요.</p>
              <button className="favorite_btn" onClick={favoriteHandler}>
                <span>👍</span>추천&nbsp;{pageData.favorite}
              </button>
            </div>
            <Reply
              replyData={replyData}
              replyRefetch={replyRefetch}
              URLID={URLID}
              data={data}
            />
          </div>
        </section>
      </div>
    </div>
  ) : null;
}

export default Detail;
