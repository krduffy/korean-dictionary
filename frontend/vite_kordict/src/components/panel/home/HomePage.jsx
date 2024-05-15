import React, { useState, useEffect } from "react";
import { useAPIFetcher } from "../useAPIFetcher";
import { ViewContext } from "../Panel.jsx";
import { LoadingMessage } from "../../LoadingMessage";

const HomePage = () => {
  const [homepageData, setHomepageData] = useState();
  const { apiFetch, loading, error } = useAPIFetcher();

  useEffect(() => {
    apiFetch("http://127.0.0.1:8000/api/homepage_info/", setHomepageData);
  }, []);

  return (
    <React.Fragment>
      {localStorage.getItem("username") == null ? (
        <div className="logged-out-homepage">
          로그인 후 개인에 맞는 홈페이가 볼 수 있습니다.
        </div>
      ) : (
        <div className="logged-in-homepage">
          {loading ? <LoadingMessage /> : <div></div>}
        </div>
      )}
    </React.Fragment>
  );
};

export default HomePage;
