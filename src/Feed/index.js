import React, { Component } from "react";
import { List, Icon } from "antd";
import { format } from "date-fns";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class Feed extends Component {
  render() {
    const { data } = this.props;
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 5,
          position: "both"
        }}
        dataSource={data}
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <IconText type="like-o" text={item.score} />,
              <IconText type="message" text={item.numberOfComments} />
            ]}
            extra={
              item.thumbnail && (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img width={272} alt="thumbnail" src={item.thumbnail} />
                </a>
              )
            }
          >
            <List.Item.Meta
              title={
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              }
              description={
                <a
                  href={item.linkToOriginalRedditPost}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original post in r/{item.subredditName} by u/{item.author}
                </a>
              }
            />
            Posted on{" "}
            {format(
              new Date(item.createdTimestamp * 1000),
              "dddd, MMM D YYYY hh:mm a"
            )}
          </List.Item>
        )}
      />
    );
  }
}

export default Feed;
