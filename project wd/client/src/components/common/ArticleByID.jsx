import React, { useContext, useState } from "react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext";
import { useLocation } from "react-router-dom";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function ArticleByID() {
  // loading the state
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);

  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  const [comments, setComments] = useState([]);
  //testing
  console.log(currentUser);

  // function to change edit Status of article
  function enableEdit() {
    setEditArticleStatus(true);
  }

  // console.log(state);
  // console.log(currentUser);

  // to save modified article
  async function onSave(modifiedArticle) {
    console.log(modifiedArticle);
    const articleAfterChanges = { ...state, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    // add date of mod
    articleAfterChanges.dateOfModification =
      currentDate.getDate() +
      "-" +
      currentDate.getMonth() +
      "-" +
      currentDate.getFullYear();
    // make http post req
    let res = await axios.put(
      `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.message === "article modified") {
      //change edit article status to false
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, {
        state: res.data.payload,
      });
    }
  }

  // delete
  async function deleteArticle() {
    const token = await getToken();
    state.isArticleActive = false;
    let res = await axios.put(
      `http://localhost:3000/author-api/articles/${state.articleId}`,
      state,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.message === "article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }

  async function restoreArticle() {
    const token = await getToken();
    state.isArticleActive = true;
    let res = await axios.put(
      `http://localhost:3000/author-api/articles/${state.articleId}`,
      state,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.message === "article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }
  // add comments

  async function addComment(commentObj) {
    commentObj.nameOfUser = currentUser.firstName;
    console.log(commentObj);
    let res = await axios.put(
      `http://localhost:3000/user-api/comment/${currentArticle.articleId}`,
      commentObj
    );
    if (res.data.message === "comment added") {
      setCommentStatus(res.data.message);
      setComments({ commentObj, ...comments });
    }
    // commentObj.nameOfUser = currentUser.firstName;
  }
  return (
    <div className="container">
      {editArticleStatus === false ? (
        <>
          {/* display full article */}
          <div className="d-flex justify-content-between">
            <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
              <div>
                <p className="display-3 me-4">{state.title}</p>
                {/* doc and dom */}
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Created on: {state.dateOfCreation}
                  </small>
                </span>
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Modified on: {state.dateOfModification}
                  </small>
                </span>
              </div>
              {/* author Details */}
              <div className="author-details text-center">
                <img
                  src={state.authorData.profileImageUrl}
                  width="60px"
                  className="rounded-circle"
                  alt=""
                />
                <p>{state.authorData.nameOfAuthor}</p>
              </div>
            </div>

            <div>
              {currentUser.role === "author" && (
                <div className="d-flex me-3 flex-col gap-1">
                  <button className="me-2 btn btn-light" onClick={enableEdit}>
                    <FaEdit className="text-warning" />
                  </button>
                  {/* if article is active */}
                  {state.isArticleActive === true ? (
                    <div className="me-2 btn btn-light">
                      <MdDelete
                        className="text-danger"
                        onClick={deleteArticle}
                      />
                    </div>
                  ) : (
                    <div className="me-2 btn btn-light">
                      <MdRestore
                        className="text-danger"
                        onClick={restoreArticle}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <p
            className="lead mt-3 article-content "
            style={{ whiteSpace: "pre-line" }}
          >
            {state.content}
          </p>
          <div>
            <div className="comments my-4">
              {<h6>{commentStatus}</h6>}
              {currentUser.role === "user" && (
                <form onSubmit={handleSubmit(addComment)}>
                  <input
                    type="text"
                    {...register("comment")}
                    className="form-control mb-4"
                  />
                  <button className="btn btn-success">Add a comment</button>
                </form>
              )}

              {state.comments.length === 0 ? (
                <p className="display-3">No comments yet..</p>
              ) : (
                state.comments.map((commentObj) => (
                  <div key={commentObj._id}>
                    <p className="user-name">{commentObj?.nameOfUser}</p>
                    <p className="comment">{commentObj?.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              defaultValue={state.title}
              {...register("title")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue={state.category}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              rows="10"
              defaultValue={state.content}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleByID;
