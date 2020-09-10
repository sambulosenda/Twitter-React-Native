import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import tweets from "../../data/tweets";
import Tweet from "../Tweet";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listTweets } from "../../src/graphql/queries";

const Feed = () => {
  const [tweets, setweets] = useState([]);
  const [loading, setLoading] = useState(false);

 
    const fetchTweets = async () => {
      //get tweets from the backend
      setLoading(true);
      try {
        const tweetData = await API.graphql(graphqlOperation(listTweets));
        setweets(tweetData.data.listTweets.items);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    

    useEffect(() => {
        fetchTweets();
  }, []);


  return (
    <View style={{ width: "100%" }}>
      <FlatList
        data={tweets}
        renderItem={({ item }) => <Tweet tweet={item} />}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={ fetchTweets}
      />
    </View>
  );
};

export default Feed;
