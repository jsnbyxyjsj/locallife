// import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";

// === Components ===
import CCPivotTable from "../components/CCPivotTable/CCPivotTable";

// === Images ===
import loaderGifCC from "../assets/images/loader-cc-gray.gif";

function GeneralDashboard() {
  const { userConfiguration, navBarOpened } = useAppContext();

  const components = [];

  return <></>

  return (
    <>
      {userConfiguration ? (
        <div
          className={
            "Dashboard " +
            (navBarOpened ? "Dashboard__navBarOpen" : "Dashboard__navBarClose")
          }
        >
          {components.map((component, index) => (
            <CCPivotTable key={"pivot-" + index} data={component} />
          ))}
        </div>
      ) : (
        <div
          className={
            "Dashboard " +
            (navBarOpened ? "Dashboard__navBarOpen" : "Dashboard__navBarClose")
          }
        >
          <Row className="justify-content-center align-items-center Dashboard__loader">
            <img src={loaderGifCC}></img>
          </Row>
        </div>
      )}
    </>
  );
}

export default GeneralDashboard;
