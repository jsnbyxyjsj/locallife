import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// === Components ===
import { PanelMenu } from "primereact/panelmenu";
import Modal from "react-modal";

// === Images ===
import isoLogo from "../assets/images/iso_logo.svg";
import gridIcon from "../assets/images/gridIcon.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");
function NavBar() {
  const {
    userConfiguration,
    setUserConfiguration,
    currentSection,
    setCurrentSection,
    currentPage,
    setCurrentPage,
    navBarOpened,
    setNavBarOpened,
  } = useAppContext();
  let navigate = useNavigate();
  const [editNavBar, setEditNavBar] = useState(false);
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewPageInput, setShowNewPageInput] = useState("");
  const [newPageName, setNewPageName] = useState("");
  const [newEditName, setNewEditName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    operation: "",
    element: "",
    name: "",
    section: "",
  });

  const [updateConfiguration] = useMutation(gql`
    mutation update_platform_configurations(
      $platform_configurations_id: String!
      $dashboard_configuration: String
    ) {
      update_platform_configurations(
        platform_configurations_id: $platform_configurations_id
        dashboard_configuration: $dashboard_configuration
      ) {
        platform_configurations_id
      }
    }
  `);

  const renderPage = (e: any) => {
    let icon = null;
    if (currentSection === e.section_name && currentPage === e.label) {
      icon = <img src={isoLogo}></img>;
    }
    return (
      <>
        {!editNavBar ? (
          <div
            className="NavBar__page-items"
            onClick={() => {
              navigate("/");
              setCurrentPage(e.label);
              setCurrentSection(e.section_name);
              localStorage.setItem("currentPage", e.label);
              localStorage.setItem("currentSection", e.section_name);
            }}
          >
            <label>
              {icon && icon}
              {e.label}
            </label>
          </div>
        ) : (
          <div
            className="NavBar__page-items"
            onClick={() => {
              navigate("/");
              setCurrentPage(e.label);
              setCurrentSection(e.section_name);
              localStorage.setItem("currentPage", e.label);
              localStorage.setItem("currentSection", e.section_name);
            }}
          >
            <label>
              {icon && icon}
              {e.label}
            </label>
            <i
              className="pi pi-trash"
              style={{
                color: "#ffffff",
                marginLeft: "10px",
              }}
              onClick={() => {
                setModalData({
                  operation: "delete",
                  element: "page",
                  name: e.label,
                  section: e.section_name,
                });
                setShowModal(true);
              }}
            ></i>
            <i
              className="pi pi-pencil"
              style={{
                color: "#ffffff",
                marginLeft: "10px",
              }}
              onClick={() => {
                setModalData({
                  operation: "edit",
                  element: "page",
                  name: e.label,
                  section: e.section_name,
                });
                setShowModal(true);
              }}
            ></i>
          </div>
        )}
      </>
    );
  };

  const renderSections = (section: any) => {
    let items_page = section.pages.map(function (el: any) {
      return {
        label: el.page_name,
        section_name: section.section_name,
        template: renderPage,
      };
    });
    if (editNavBar) {
      items_page.push({
        label: "Add new page",
        icon: <i className="pi pi-plus" style={{ color: "#ffffff" }}></i>,
        command: () => {
          setShowNewPageInput(
            showNewPageInput === section.section_name
              ? ""
              : section.section_name
          );
        },
      });
    }
    let items = [
      {
        label: section.section_name,
        icon: <img src={gridIcon}></img>,
        items: items_page,
        expanded: true,
      },
    ];
    return (
      <div key={section.section_name}>
        <PanelMenu model={items} />
        {showNewPageInput === section.section_name && editNavBar && (
          <div>
            <input
              autoFocus
              className="NavBar__pages-input"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
            />
            <div>
              {newPageName && (
                <div
                  className="NavBar__confirm-button"
                  style={{ marginTop: "0px" }}
                >
                  <i
                    className="pi pi-check"
                    style={{
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                    onClick={updatePages}
                  ></i>
                </div>
              )}
            </div>
          </div>
        )}
        {editNavBar && (
          <div className="NavBar__confirm-button-container">
            <div
              className="NavBar__confirm-button"
              onClick={() => {
                setModalData({
                  operation: "delete",
                  element: "section",
                  name: section.section_name,
                  section: "",
                });
                setShowModal(true);
              }}
            >
              <i
                className="pi pi-trash"
                style={{
                  color: "#ffffff",
                }}
              ></i>
            </div>
            <div
              className="NavBar__confirm-button"
              onClick={() => {
                setModalData({
                  operation: "edit",
                  element: "section",
                  name: section.section_name,
                  section: "",
                });
                setShowModal(true);
              }}
            >
              <i
                className="pi pi-pencil"
                style={{
                  color: "#ffffff",
                }}
              ></i>
            </div>
          </div>
        )}
      </div>
    );
  };

  const closeNavBar = () => {
    setNewSectionName("");
    setShowNewSectionInput(false);
    setNavBarOpened(false);
  };

  const updateSections = () => {
    if (userConfiguration) {
      let sections = [...userConfiguration.sections];
      sections.push({
        section_name: newSectionName,
        pages: [],
      });
      let userConfiguration_ = { ...userConfiguration };
      userConfiguration_.sections = sections;
      setUserConfiguration(userConfiguration_);
      setShowNewSectionInput(false);
      setNewSectionName("");
      // Remove results
      for (var i = 0; i < userConfiguration_.sections.length; i++) {
        let pages = userConfiguration_.sections[i].pages;
        for (var j = 0; j < pages.length; j++) {
          let elements = pages[j].elements;
          for (var k = 0; k < elements.length; k++) {
            userConfiguration_.sections[i].pages[j].elements[k].data = null;
          }
        }
      }
      updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
    }
  };

  const updatePages = () => {
    if (userConfiguration) {
      let sections = [...userConfiguration.sections];
      let index = sections
        .map((el) => el.section_name)
        .indexOf(showNewPageInput);
      let pages = [...sections[index].pages];
      pages.push({
        page_name: newPageName,
        elements: [],
      });
      sections[index].pages = pages;
      let userConfiguration_ = { ...userConfiguration };
      userConfiguration_.sections = sections;
      setUserConfiguration(userConfiguration_);
      setShowNewPageInput("");
      setNewPageName("");
      // Remove results
      for (var i = 0; i < userConfiguration_.sections.length; i++) {
        let pages = userConfiguration_.sections[i].pages;
        for (var j = 0; j < pages.length; j++) {
          let elements = pages[j].elements;
          for (var k = 0; k < elements.length; k++) {
            userConfiguration_.sections[i].pages[j].elements[k].data = null;
          }
        }
      }
      updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
    }
  };

  const editElement = (
    operation: string,
    element: string,
    section_name: string,
    page_name: string,
    new_name: string
  ) => {
    if (userConfiguration) {
      let userConfiguration_ = { ...userConfiguration };
      if (operation === "edit") {
        if (element === "section") {
          let sections = [...userConfiguration_.sections];
          let index = sections
            .map((el) => el.section_name)
            .indexOf(section_name);
          sections[index].section_name = new_name;
          userConfiguration_.sections = sections;
        } else if (element === "page") {
          let sections = [...userConfiguration_.sections];
          let index = sections
            .map((el) => el.section_name)
            .indexOf(section_name);
          let pages = [...sections[index].pages];
          let index_page = pages.map((el) => el.page_name).indexOf(page_name);
          pages[index_page].page_name = new_name;
          sections[index].pages = pages;
          userConfiguration_.sections = sections;
        }
      } else if (operation === "delete") {
        if (element === "section") {
          let sections = [...userConfiguration_.sections];
          let index = sections
            .map((el) => el.section_name)
            .indexOf(section_name);
          sections.splice(index, 1);
          userConfiguration_.sections = sections;
        } else if (element === "page") {
          let sections = [...userConfiguration_.sections];
          let index = sections
            .map((el) => el.section_name)
            .indexOf(section_name);
          let pages = [...sections[index].pages];
          let index_page = pages.map((el) => el.page_name).indexOf(page_name);
          pages.splice(index_page, 1);
          sections[index].pages = pages;
          userConfiguration_.sections = sections;
        }
      }
      setUserConfiguration(userConfiguration_);
      // Remove results
      for (var i = 0; i < userConfiguration_.sections.length; i++) {
        let pages = userConfiguration_.sections[i].pages;
        for (var j = 0; j < pages.length; j++) {
          let elements = pages[j].elements;
          for (var k = 0; k < elements.length; k++) {
            userConfiguration_.sections[i].pages[j].elements[k].data = null;
          }
        }
      }
      updateConfiguration({
        variables: {
          platform_configurations_id:
            userConfiguration_.platform_configurations_id,
          dashboard_configuration: JSON.stringify(userConfiguration_),
        },
      });
    }
  };

  return (
    <div className="NavBar">
      <div>
        {navBarOpened && (
          <div className="NavBar__SideBar NavBar__openBar">
            <div className="NavBar__openBar-header">
              <img
                src={isoLogo}
                onClick={() => {
                  setNavBarOpened(true);
                }}
              ></img>
            </div>
            <div
              className="NavBar__data-sources my-4"
              onClick={() => navigate("/dashboard")}
            >
              <i className="pi pi-chart-bar" style={{ marginRight: "10px" }}></i>
              <label>Dashboard</label>
            </div>
            {userConfiguration && (
              <div style={{ textAlign: "center" }}>
                {userConfiguration.sections.map(function (section) {
                  return renderSections(section);
                })}
                {editNavBar && (
                  <div>
                    <PanelMenu
                      model={[
                        {
                          label: "Add new section",
                          icon: "pi pi-plus",
                        },
                      ]}
                      onClick={() =>
                        setShowNewSectionInput(!showNewSectionInput)
                      }
                    />
                    {showNewSectionInput && (
                      <div>
                        <input
                          autoFocus
                          className="NavBar__sections-input"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                        />
                        {newSectionName && (
                          <div className="NavBar__confirm-button">
                            <i
                              className="pi pi-check"
                              style={{
                                color: "#ffffff",
                                cursor: "pointer",
                              }}
                              onClick={updateSections}
                            ></i>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div
              className="NavBar__data-sources"
              onClick={() => navigate("/dataSources")}
            >
              <i className="pi pi-database" style={{ marginRight: "10px" }}></i>
              <label>Data Sources</label>
            </div>
            <div className="NavBar__openBar-close" onClick={closeNavBar}>
              <i
                className="pi pi-chevron-left"
                style={{
                  color: "#ffffff",
                }}
              ></i>
            </div>
            <div
              className="NavBar__openBar-footer"
              onClick={() => {
                if (editNavBar) {
                  setShowModal(false);
                  setNewEditName("");
                  setModalData({
                    operation: "",
                    element: "",
                    name: "",
                    section: "",
                  });
                }
                setEditNavBar(!editNavBar);
              }}
            >
              <i
                className="pi pi-pencil"
                style={{
                  color: "#ffffff",
                }}
              ></i>
            </div>
          </div>
        )}
        {!navBarOpened && (
          <div className="NavBar__SideBar NavBar__closeBar">
            <div className="NavBar__closeBar-header">
              <img
                src={isoLogo}
                onClick={() => {
                  setNavBarOpened(true);
                }}
              ></img>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={showModal} style={customStyles}>
        {modalData.operation === "edit" && (
          <>
            {modalData.element === "section" ? (
              <div className="NavBar__modal">
                <p>
                  Ingrese el nuevo nombre para la sección{" "}
                  <strong>{modalData.name}</strong>
                </p>
                <input
                  value={newEditName}
                  onChange={(e) => setNewEditName(e.target.value)}
                ></input>
              </div>
            ) : (
              <div className="NavBar__modal">
                <p>
                  Ingrese el nuevo nombre para la página{" "}
                  <strong>{modalData.name}</strong>
                </p>
                <input
                  value={newEditName}
                  onChange={(e) => setNewEditName(e.target.value)}
                ></input>
              </div>
            )}
          </>
        )}
        {modalData.operation === "delete" && (
          <>
            {modalData.element === "section" ? (
              <div className="NavBar__modal">
                <p>
                  ¿Está seguro que quiere eliminar la sección{" "}
                  <strong>{modalData.name}</strong>
                </p>
              </div>
            ) : (
              <div>
                <p>
                  ¿Está seguro que quiere eliminar la página{" "}
                  <strong>{modalData.name}</strong>
                </p>
              </div>
            )}
          </>
        )}
        <div className="NavBar__modal-buttons">
          <button
            onClick={() => {
              setNewEditName("");
              setModalData({
                operation: "",
                element: "",
                name: "",
                section: "",
              });
              setShowModal(false);
              setEditNavBar(false);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              editElement(
                modalData.operation,
                modalData.element,
                modalData.section || modalData.name,
                modalData.name,
                newEditName
              );
              setModalData({
                operation: "",
                element: "",
                name: "",
                section: "",
              });
              setShowModal(false);
              setEditNavBar(false);
            }}
          >
            Accept
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default NavBar;
