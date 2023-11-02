"use client";

import { useState } from "react";
// import PinContainer from "../manage-accounts/pin-container";

export default function AccountPopup({
  accounts,
  setLoggedInAccount,
  signOut,
  loggedInAccount,
  setPageLoader,
}) {
  async function handlePinSubmit(value, index) {
    const res = await fetch(`/api/account/login-to-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: session?.user?.uid,
        accountId: showPinContainer.account._id,
        pin: value,
      }),
    });
    const data = await res.json();
    // console.log("data : ", data);
    if (data.success) {
      setLoggedInAccount(showPinContainer.account);
      sessionStorage.setItem(
        "loggedInAccount",
        JSON.stringify(showPinContainer.account)
      );
      router.push(pathname);
      setPageLoader(false);
    } else {
      setPageLoader(false);
      setPinError("true");
      setPin("");
    }
  }
  return (
    <div
      className="px-8  py-8 fixed top-[50px] gap-3 flex flex-col
     items-start right-[45px] bg-black opacity-[.85] z-[999]"
    >
      <div className="flex flex-col gap-3">
        {accounts && accounts.length
          ? accounts
              .filter((item) => item._id !== loggedInAccount?._id)
              .map((account) => (
                <div
                  onClick={() => {
                    setLoggedInAccount(null);
                    sessionStorage.removeItem("loggedInAccount");
                  }}
                  className="flex cursor-pointer gap-5"
                  key={account._id}
                >
                  <img
                    src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4"
                    alt="Current Profile"
                    className="max-w-[30px] rounded min-w-[20px] max-h-[30px] min-h-[20px] object-cover w-[30px] h-[30px]"
                  />
                  <p className="mb-4">{account.name}</p>
                </div>
              ))
          : null}
      </div>
      <div>
        <button
          onClick={() => {
            const loggedInAccountData =
              sessionStorage.getItem("loggedInAccount");
            console.log("loggedInAccountData:", loggedInAccountData);

            setPageLoader(true);
            signOut();
            setLoggedInAccount(null);
            sessionStorage.removeItem("loggedInAccount");
          }}
        >
          Sign out of Netflix
        </button>
      </div>
      {/* <PinContainer
        pin={pin}
        setPin={setPin}
        pinError={pinError}
        setPinError={setPinError}
        showPinContainer={showPinContainer.show}
        setShowPinContainer={setShowPinContainer}
        handlePinSubmit={handlePinSubmit}
      /> */}
    </div>
  );
}
