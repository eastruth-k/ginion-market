"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { createRegionAddress } from "@/app/signup/address";

export default function AddressSearch() {
  const [address, setAddress] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  function openAddressSearch() {
    const Postcode = window.kakao?.Postcode ?? window.daum?.Postcode;

    if (!scriptReady || !Postcode) {
      setError("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSearchOpen(true);

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
  }

  return (
    <div className="address-field">
      <Script
        src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError("주소 검색 서비스를 불러오지 못했습니다.")}
      />
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
        <button type="button" onClick={openAddressSearch} disabled={!scriptReady}>
          주소 찾기
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
    </div>
  );
}
