import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import Amplify, { Auth, API, graphqlOperation } from "aws-amplify";
import config from "./aws-exports";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

Amplify.configure(config);

import { withAuthenticator } from "aws-amplify-react-native";

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    return "https://scontent.fkiv3-1.fna.fbcdn.net/v/t31.0-8/s960x960/22256588_1932617800312085_5686197942193420542_o.jpg?_nc_cat=110&_nc_sid=85a577&_nc_ohc=svjjE7DUkc0AX9yjcdC&_nc_ht=scontent.fkiv3-1.fna&tp=7&oh=1df4116c73c45a32ebad070704ca3333&oe=5F6ECD77";
  };

  const saveUserToDatabase = async (user) => {
    console.log(user);
    await API.graphql(graphqlOperation(createUser, { input: user }));
  };

  useEffect(() => {
    const updateUser = async () => {
      //Get current authenticated user

      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        console.log(userData);

        // Check if the user exists in the database
        if (!userData.data.getUser) {
          const user = {
            id: userInfo.attributes.sub,
            username: userInfo.username,
            name: userInfo.username,
            email: userInfo.attributes.email,
            image: getRandomImage(),
          };
          await saveUserToDatabase(user);
        } else {
          console.log("user already exists");
        }
      }
    };
    updateUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
