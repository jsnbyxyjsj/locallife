import { useState } from "react";
import { Row } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";

// === Components ===
import CCTable from "../components/CCTable/CCTable";
import CCChart from "../components/CCChart/CCChart";
import CCPivotTable from "../components/CCPivotTable/CCPivotTable";
import NewComponentModal from "../components/newComponentModal";

// === Images ===
import loaderGifCC from "../assets/images/loader-cc-gray.gif";

function Dashboard() {
  const { userConfiguration, currentSection, currentPage, navBarOpened } =
    useAppContext();
  const [showModalNewComponent, setShowModalNewComponent] =
    useState<Boolean>(false);

  return (
    <>
      {userConfiguration ? (
        <div
          className={
            "Dashboard " +
            (navBarOpened ? "Dashboard__navBarOpen" : "Dashboard__navBarClose")
          }
        >
          <Row
            className="Dashboard__components-grid justify-content-center"
            key="Dashboard__components-grid"
          >
            {userConfiguration?.sections
              .find((section) => section.section_name === currentSection)
              ?.pages.find((page) => page.page_name === currentPage)
              ?.elements.map(function (component: any) {
                // Render Components
                if (component.element_type === "table") {
                  // Render Tables
                  return (
                    <div
                      className="Dashboard__component-container"
                      key={
                        "Dashboard__component-container" + "-" + component.id
                      }
                    >
                      <CCTable key={component.id} data={component}></CCTable>
                    </div>
                  );
                } else if (component.element_type === "chart") {
                  return (
                    <div
                      className="Dashboard__component-container"
                      key={
                        "Dashboard__component-container" + "-" + component.id
                      }
                    >
                      <CCChart data={component}></CCChart>
                    </div>
                  );
                } else if (component.element_type === "pivotTable") {
                  return (
                    <div
                      className="Dashboard__component-container Dashboard__component-container--noncentered"
                      key={
                        "Dashboard__component-container" + "-" + component.id
                      }
                    >
                      <CCPivotTable data={component} />
                    </div>
                  );
                }
                {
                  return null;
                }
              })}
          </Row>
          <Row className="justify-content-center" style={{ marginTop: "20px" }}>
            <button
              className="Dashboard__add-component-button"
              onClick={() => setShowModalNewComponent(true)}
            >
              <Row className="justify-content-center align-items-center">
                <div className="Dashboard__add-component-icon">
                  <i
                    className="pi pi-plus"
                    style={{
                      color: "#ffffff",
                    }}
                  ></i>
                </div>
                <span>Add new element</span>
              </Row>
            </button>
          </Row>
          <NewComponentModal
            showModal={showModalNewComponent}
            setShowModal={setShowModalNewComponent}
          ></NewComponentModal>
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

export default Dashboard;
