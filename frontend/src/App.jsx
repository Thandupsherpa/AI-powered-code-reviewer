import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(``);
  const [review, setReview] = useState(``);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  async function reviewCode() {
    setReviewLoading(true); 
    setReview(""); 
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("⚠️ Error fetching review. Please try again.");
    } finally {
      setReviewLoading(false); 
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading your Code Reviewer...</h2>
      </div>
    );
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code","Fira mono","Monospace"',
                fontSize: 16,
                minHeight: "100%",
                width: "100%",
                overflow: "auto",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            Review
          </div>
        </div>

        <div className="right">
          {reviewLoading ? (
            <div className="review-loading">
              <div className="dot-pulse"></div>
              <p>Getting your review...</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
