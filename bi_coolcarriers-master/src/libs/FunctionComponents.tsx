import { useEffect } from "react";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useAppContext } from "./contextLib";
import { Auth } from "aws-amplify";

// === Functions ===
import { generalDefaultConfiguration } from "../assets/resources/defaultConfiguration";

function FunctionComponents() {
  const {
    userConfiguration,
    setUserConfiguration,
    setCurrentSection,
    setCurrentPage,
    userData,
    setUserData,
    isAuthenticated,
  } = useAppContext();

  const [checkUserConfiguration] = useLazyQuery(gql`
    query list_platform_configurations($platform_users_id: String) {
      list_platform_configurations(platform_users_id: $platform_users_id) {
        platform_configurations_id
        dashboard_configuration
      }
    }
  `);

  const [getUserData] = useLazyQuery(gql`
    query list_platform_users($email: String) {
      list_platform_users(email: $email) {
        platform_users_id
        name
        last_name
        profile_image
      }
    }
  `);

  const [createUser] = useMutation(gql`
    mutation create_platform_users(
      $name: String
      $last_name: String
      $profile_image: String
      $email: String!
    ) {
      create_platform_users(
        name: $name
        last_name: $last_name
        profile_image: $profile_image
        email: $email
      ) {
        platform_users_id
      }
    }
  `);

  const [createUserConfiguration] = useMutation(gql`
    mutation create_platform_configurations(
      $platform_users_id: String!
      $dashboard_configuration: String!
    ) {
      create_platform_configurations(
        platform_users_id: $platform_users_id
        dashboard_configuration: $dashboard_configuration
      ) {
        platform_configurations_id
      }
    }
  `);

  useEffect(() => {
    const pageInit = async () => {
      if (isAuthenticated) {
        // === Check data user ===
        let user_data = localStorage.getItem("userData");
        if (user_data) {
          user_data = JSON.parse(user_data);
          setUserData(user_data);
        } else {
          let user_email = await Auth.currentUserInfo();
          user_email = user_email.attributes.email;
          let response = await getUserData({
            variables: {
              email: user_email,
            },
          });
          let user_data = response.data.list_platform_users[0];
          if (user_data) {
            let user = {
              platform_users_id: user_data.platform_users_id,
              email: user_email,
              name: user_data.name,
              last_name: user_data.last_name,
              profile_image: user_data.profile_image,
            };
            localStorage.setItem("userData", JSON.stringify(user));
            setUserData(user);
          } else {
            let user = {
              platform_users_id: "",
              email: user_email,
              name: "",
              last_name: "",
              profile_image: "",
            };
            let response = await createUser({
              variables: user,
            });
            let user_id =
              response.data.create_platform_users[0]?.platform_users_id;
            user["platform_users_id"] = user_id;
            localStorage.setItem("userData", JSON.stringify(user));
            setUserData(user);
          }
        }
      }
    };
    pageInit();
  }, [isAuthenticated]);

  useEffect(() => {
    const pageInit = async () => {
      if (
        isAuthenticated &&
        userData?.platform_users_id &&
        !userConfiguration
      ) {
        // Check user configuration
        let response = await checkUserConfiguration({
          variables: {
            platform_users_id: userData.platform_users_id,
          },
        });
        let configuration = response.data.list_platform_configurations[0];
        if (configuration) {
          // user configuration already exist
          let platform_configurations_id =
            configuration.platform_configurations_id;
          configuration = JSON.parse(configuration.dashboard_configuration);
          let current_page = localStorage.getItem("currentPage");
          if (!current_page) {
            current_page = configuration.sections[0].pages[0].page_name;
          }
          let current_section = localStorage.getItem("currentSection");
          if (!current_section) {
            current_section = configuration.sections[0].section_name;
          }
          setCurrentSection(current_section);
          setCurrentPage(current_page);
          configuration["platform_configurations_id"] =
            platform_configurations_id;
          setUserConfiguration(configuration);
        } else {
          // Setting default configuration
          let current_section =
            generalDefaultConfiguration.sections[0].section_name;
          let current_page =
            generalDefaultConfiguration.sections[0].pages[0].page_name;
          setCurrentSection(current_section);
          setCurrentPage(current_page);
          // Save in DB new configuration
          let response = await createUserConfiguration({
            variables: {
              platform_users_id: userData.platform_users_id,
              dashboard_configuration: JSON.stringify(
                generalDefaultConfiguration
              ),
            },
          });
          let platform_configurations_id =
            response.data.create_platform_configurations[0]
              ?.platform_configurations_id;
          let generalDefaultConfiguration_ = {
            ...generalDefaultConfiguration,
            platform_configurations_id: platform_configurations_id,
          };
          setUserConfiguration(generalDefaultConfiguration_);
        }
      }
    };
    pageInit();
  }, [isAuthenticated, userData]);

  return <></>;
}

export default FunctionComponents;
