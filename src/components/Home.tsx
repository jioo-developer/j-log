import { Link } from "react-router-dom";
import "../asset/home.scss";
import "../asset/header.scss";
import { useMyContext } from "../module/Mycontext";

function Home() {
  const { posts, data } = useMyContext();
  return (
    <div className="main">
      <div className="in_wrap">
        <section className="post_section">
          {posts
            ? posts.map(function (item, index) {
                return (
                  <Link
                    to={`/detail?id=${item.pageId}`}
                    state={{ pageId: item.pageId }}
                    key={index}
                  >
                    <div className="post" key={index}>
                      <figure className="thumbnail">
                        <img
                          src={
                            item.url && item.url.length > 0
                              ? item.url[0]
                              : "./img/no-image.jpg"
                          }
                          alt="썸네일"
                        />
                      </figure>
                      <div className="text_wrap">
                        <p className="post_title">{item.title}</p>
                        <p className="post_text">{item.text}</p>
                        <p className="post_date">{item.date}</p>
                      </div>
                      <div className="writer_wrap">
                        <div className="id writter-id">
                          <img src={item.profile} alt="" className="profile" />
                          <p className="profile_id">{item.user}</p>
                        </div>
                        <p className="favorite">❤{item.favorite}</p>
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
