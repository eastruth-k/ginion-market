"use client";

import { useRef, useState } from "react";
import { createRegionAddress } from "@/app/signup/address";

const postcodeScriptUrl =
  "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function getPostcodeConstructor() {
  return window.kakao?.Postcode ?? window.daum?.Postcode;
}

export default function AddressSearch() {
  const [address, setAddress] = useState("");
  const [scriptStatus, setScriptStatus] = useState("idle");
  const [error, setError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const scriptPromiseRef = useRef(null);

  function loadPostcodeScript() {
    const loadedPostcode = getPostcodeConstructor();
    if (loadedPostcode) return Promise.resolve(loadedPostcode);

    if (!scriptPromiseRef.current) {
      scriptPromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          `script[src="${postcodeScriptUrl}"]`,
        );
        const script = existingScript ?? document.createElement("script");

        script.addEventListener("load", () => {
          const Postcode = getPostcodeConstructor();
          if (Postcode) {
            resolve(Postcode);
            return;
          }

          script.remove();
          reject(new Error("주소 검색 생성자를 찾을 수 없습니다."));
        }, { once: true });
        script.addEventListener("error", () => {
          script.remove();
          reject(new Error("주소 검색 스크립트를 불러오지 못했습니다."));
        }, { once: true });

        if (!existingScript) {
          script.src = postcodeScriptUrl;
          script.async = true;
          document.head.appendChild(script);
        }
      });
    }

    return scriptPromiseRef.current;
  }

  async function openAddressSearch() {
    setScriptStatus("loading");
    setError("");

    let Postcode;

    try {
      Postcode = await loadPostcodeScript();
      setScriptStatus("ready");
    } catch {
      scriptPromiseRef.current = null;
      setScriptStatus("error");
      setError("주소 검색 서비스를 불러오지 못했습니다. 다시 시도해주세요.");
      return;
    }

    new Postcode({
      oncomplete(data) {
        const regionAddress = createRegionAddress({
          sido: data.sido,
          sigungu: data.sigungu,
          bname: data.bname || data.bname1 || data.bname2,
        });

        if (!regionAddress) {
          setError("선택한 주소에서 거래 지역을 확인하지 못했습니다.");
          return;
        }

        setAddress(regionAddress);
        setError("");
        setSearchOpen(false);
      },
      width: "100%",
      height: "100%",
    }).embed(searchContainerRef.current);

    setSearchOpen(true);
  }

  return (
    <div className="address-field">
      <label htmlFor="signup-address">주소</label>
      <div className="address-control">
        <input
          id="signup-address"
          name="address"
          value={address}
          placeholder="주소 찾기를 이용해주세요"
          readOnly
          required
        />
        <button type="button" onClick={openAddressSearch}>
          {scriptStatus === "loading" ? "불러오는 중..." : "주소 찾기"}
        </button>
      </div>
      <small>상세주소는 저장하지 않고 시·군·구·동까지만 저장합니다.</small>
      {error && <p className="address-error" role="alert">{error}</p>}
      <div className="address-search-layer" hidden={!searchOpen}>
        <section role="dialog" aria-modal="true" aria-label="주소 검색">
          <div className="address-search-header">
            <strong>주소 검색</strong>
            <button type="button" onClick={() => setSearchOpen(false)}>닫기</button>
          </div>
          <div className="address-search-content" ref={searchContainerRef} />
        </section>
      </div>
      <small>
        {scriptStatus === "ready" && "주소 검색 준비 완료"}
        {scriptStatus === "loading" && "주소 검색 준비 중..."}
        {scriptStatus === "error" && "주소 검색을 다시 시도해주세요."}
      </small>
    </div>
  );
}
