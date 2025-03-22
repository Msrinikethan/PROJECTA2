import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userAuthorContextObj } from "../contexts/UserAuthorContext.jsx";
import { useAuth } from "@clerk/clerk-react";
// get all articles
function Articles() {
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [articleCategory, setArticleCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  async function getArticles() {
    // make authenticated req
    setLoading(true);
    try {
      const token = await getToken();
      console.log("Token retrieved:", token);
      if (!token) {
        setError("Authentication error");
        return;
      }
      const res = await axios.get("http://localhost:3000/author-api/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", res.data);
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failer to fetch");
    } finally {
      setLoading(false);
    }
  }
  // console.log(error);

  // get specific article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, [getToken]);
  function handleCategory(e) {
    // console.log(e.target.value);
    setArticleCategory(e.target.value);
  }
  if (loading) return <p>Loading articles...</p>;
  return (
    <div className="container">
      <div>
        <select defaultValue="all" id="category" onChange={handleCategory}>
          <option value="all" defaultChecked>
            --Select category--
          </option>
          <option value="programming">Programming</option>
          <option value="AI&ML">AI&ML</option>
          <option value="database">Database</option>
        </select>
      </div>
      <div>
        {error?.length !== 0 && (
          <p className="display-4 text-center mt-5 text-danger">{error}</p>
        )}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 ">
          {articles
            .filter((articleObj) =>
              articleCategory === "all"
                ? true
                : articleObj.category === articleCategory
            )
            .map((articleObj) => (
              <div className="col" key={articleObj.articleId}>
                <div className="card h-100">
                  <div className="author-details text-end">
                    <img
                      src={articleObj.authorData.profileImageUrl}
                      width="40px"
                      className="rounded-circle"
                    ></img>
                    <p>{articleObj.category}</p>
                    <p>
                      <small className="text-secondary">
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  <h5 className="card-title">{articleObj.title}</h5>
                  <p className="card-text">
                    {articleObj.content.substring(0, 80) + "...."}
                  </p>
                  <button
                    className="custom-btn btn-4"
                    onClick={() => {
                      gotoArticleById(articleObj);
                    }}
                  >
                    Read more
                  </button>
                </div>
                <div className="card-footer"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Articles;
