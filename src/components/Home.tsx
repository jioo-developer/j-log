import { Link } from "react-router-dom";
import "../asset/home.scss";
import "../asset/header.scss";
import { queryProps } from "../module/interfaceModule";

function Home({ data, posts }: queryProps) {
  //체크 끝
  return (
    <div className="main">
      <div className="in_wrap">
        <section className="post_section">
          {posts
            ? posts.map(function (post, index) {
                return (
                  <Link
                    to={`/detail?id=${post.pageId}`}
                    state={{ pageId: post.pageId }}
                    key={index}
                  >
                    <div className="post" key={index}>
                      <figure className="thumbnail">
                        <img
                          src={
                            post.url.length ? post.url[0] : "./img/no-image.jpg"
                          }
                          alt=""
                        />
                      </figure>
                      <div className="text_wrap">
                        <p className="post_title">{post.title}</p>
                        <p className="post_text">{post.text}</p>
                        <p className="post_date">{post.date}</p>
                      </div>
                      <div className="writer_wrap">
                        <div className="id writter-id">
                          <img src={post.profile} alt="" className="profile" />
                          <p className="profile_id">{post.user}</p>
                        </div>
                        <p className="favorite">❤{post.favorite}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            : null}
        </section>
        {data ? (
          <button className="new-post">
            <Link to="/upload">
              <img src="./img/add.svg" alt="" />
            </Link>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
