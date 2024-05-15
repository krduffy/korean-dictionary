import React, { useState, useEffect } from "react";
import { useAPIFetcher } from "../useAPIFetcher";
import { ViewContext } from "../Panel.jsx";
import { LoadingMessage } from "../../LoadingMessage";
import StringWithHanja from "../StringWithHanja.jsx";

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
          {loading ? (
            <LoadingMessage />
          ) : (
            <div id="homepage-main-content">
              <div className="same-hanja-section">
                알고 계셨나요? 이 단어들은 같은 한자가 포함된다.
                <ul>
                  {homepageData &&
                    homepageData.same_hanja &&
                    Object.entries(homepageData.same_hanja).map(
                      (sameHanjaItem, id) => (
                        <li className="same-hanja-example" key={id}>
                          <span>{sameHanjaItem[0]}</span>

                          {/* first item in example. */}
                          <SameHanjaExampleWord
                            hanjaExampleData={sameHanjaItem[1][0]}
                          />

                          {/* second item in example. */}
                          <SameHanjaExampleWord
                            hanjaExampleData={sameHanjaItem[1][1]}
                          />
                        </li>
                      ),
                    )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default HomePage;

const SameHanjaExampleWord = ({ hanjaExampleData }) => {
  return (
    <div>
      <StringWithHanja string={hanjaExampleData["kw_origin"]} />
    </div>
  );
};
