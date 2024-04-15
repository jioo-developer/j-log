import { useEffect, useMemo, useState } from "react";
import "../asset/detail.scss";
import { Link } from "react-router-dom";
import Reply from "./Reply";
import { FirebaseData } from "../module/interfaceModule";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import useReply from "../query/loadReply";
import { useMyContext } from "../module/Mycontext";
import { setCookie } from "../module/exportFunction";

function Detail() {
  const { location, data, navigate, postRefetch } = useMyContext();

  const URLID: string = useMemo(() => {
    return location.state.pageId ? location.state.pageId : location.state;
  }, [location]);

  const [imgLoadArr, setLoadArr] = useState<number[]>([]);
  const loadPage = useLoadDetail(URLID);
  const pageData: FirebaseData | undefined = loadPage.data;
  const refetch = loadPage.refetch;

  const reply = useReply(URLID);
  const replyData = reply.data;
  const replyRefetch = reply.refetch;

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
      if (replyData && replyData.length > 0) {
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

  const lazyloading = (index: number) => {
    if (imgLoadArr.length === 0) {
      setLoadArr([index]);
    } else {
      setLoadArr((prev) => [...prev, index]);
    }
  };

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
          <div className="grid">
            {pageData.url && pageData.url.length > 0
              ? pageData.url.map((value, index) => {
                  return (
                    <img
                      src={value}
                      className="att"
                      alt=""
                      key={index}
                      style={
                        pageData.url.length === imgLoadArr.length
                          ? { opacity: 1 }
                          : { opacity: 0 }
                      }
                      onLoad={() => {
                        lazyloading(index);
                      }}
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
