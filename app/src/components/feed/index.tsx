import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import FeedItem from './item';

interface FeedsProps {
  feeds: Array<any>;
  onFeedClick?: () => void;
}
const Feeds: React.FC<FeedsProps> = ({ feeds, onFeedClick }) => {
  const renderFeeds = useCallback(
    ({ item }) => <FeedItem {...item} onPress={onFeedClick} />,
    []
  );

  return (
    <FlatList
      style={{ padding: 15 }}
      data={feeds}
      renderItem={renderFeeds}
      keyExtractor={(item) => String(item.id)}
    />
  );
};

export default Feeds;
