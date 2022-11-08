import React from "react";
import { Link } from "react-router-dom";
import "../asset/home.scss";
import "../asset/header.scss";
import Header from "./Header";
import { useSelector } from "react-redux";
function Home({ user }) {
  const posts = useSelector((state) => state.posts);
  return (
    <div className="main">
      <div className="in_wrap">
        <Header user={user} />
        <section className="post_section">
          {posts.map(function (post, i) {
            return (
              <>
                <Link
                  to={`/detail?id=${post.pageId}`}
                  state={{ pageId: post.pageId }}
                  key={i}
                >
                  <div className="post">
                    <figure className="thumbnail">
                      <img
                        src={
                          post.url.length === 0
                            ? "./img/no-image.jpg"
                            : post.url[0]
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
              </>
            );
          })}
        </section>
        <button className="new-post">
          <Link to="/upload">
            <img src="./img/add.svg" alt="" />
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Home;
