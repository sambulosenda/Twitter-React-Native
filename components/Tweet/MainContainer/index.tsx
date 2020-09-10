import React from "react";
import { View, Text, Image } from "react-native";
import { TweetType } from "../../../types";
import tweets from "../../../data/tweets";
import styles from "./styles";
import { Entypo } from "@expo/vector-icons";
import Footer from "./Footer";
import moment from 'moment';

export type MainContainerProps = {
  tweet: TweetType;
};

const MainContainer = ({ tweet }: MainContainerProps) => (
  <View style={styles.container}>
    <View style={styles.tweetHeaderContainer}>
        <View style={styles.tweetHeaderNames}>
      <Text style={styles.name}>{tweet.user.name}</Text>
      <Text style={styles.username}>{tweet.user.username}</Text>
<Text style={styles.createdAt}>{moment(tweet.createdAt).fromNow()}</Text>
      </View>
      <View>
        <Entypo
          style={styles.moreIcon}
          name={"chevron-down"}
          size={16}
          color={"grey"}
        />
      </View>
    </View>

    <View >
      <Text style={styles.contents}>{tweet.content}</Text>
      {!!tweet.image && <Image style={styles.image} source={{ uri: tweet.image }} />}
    </View>

    <Footer tweet={tweet}/>
  </View>
);

export default MainContainer;
