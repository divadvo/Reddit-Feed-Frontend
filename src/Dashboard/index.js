import React, { Component } from "react";
import { Button, Alert, Row, Col, Input, Spin, Form } from "antd";
import Feed from "../Feed";
import axios from "axios";

let API_URL;
// No tailing slash
const BACKEND_URL_DEV = "http://localhost:5001";
const BACKEND_URL_PRODUCTION = "https://reddit-feed-backend.herokuapp.com";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev
  API_URL = BACKEND_URL_DEV;
} else {
  // production
  API_URL = BACKEND_URL_PRODUCTION;
}

class App extends Component {
  state = {
    loading: false,
    feedData: [],
    errorMessage: ""
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.searchSubreddit(values.subredditName);
      }
    });
  };

  searchSubreddit = subredditName => {
    // Show loading
    this.setState({ loading: true });

    // Make API call to my server
    axios
      .get(`${API_URL}/api/subreddit/${subredditName}`)
      .then(response => {
        const responseBody = response.data;
        const actualData = responseBody.data;

        // Save response
        this.setState({
          loading: false,
          feedData: actualData,
          errorMessage: ""
        });
      })
      .catch(error => {
        // Or show error alert
        this.setState({
          loading: false,
          feedData: [],
          errorMessage: error.response.data
        });
      });
  };

  render() {
    const { loading, feedData, errorMessage } = this.state;
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const hasErrors = fieldsError =>
      Object.keys(fieldsError).some(field => fieldsError[field]);

    // Subreddit regex from reddit's github
    // https://github.com/reddit-archive/reddit/blob/da549027955c28b2e99098a22c814fc2ba729e11/r2/r2/models/subreddit.py#L114
    const subredditValidationRegex = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;

    return (
      <div>
        <Row type="flex" justify="center">
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Form onSubmit={this.handleSubmit} layout="inline">
              <Form.Item>
                {getFieldDecorator("subredditName", {
                  rules: [
                    {
                      required: true,
                      message: "Enter a subreddit"
                    },
                    {
                      pattern: subredditValidationRegex,
                      message: "Illegal subreddit format"
                    }
                  ]
                })(
                  <Input
                    placeholder="Enter subreddit name"
                    // enterButton="Go"
                    addonBefore="reddit.com/r/"
                    // size="large"
                    // onSearch={this.searchSubreddit}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  disabled={hasErrors(getFieldsError())}
                >
                  Go
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        {loading && <Spin />}
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
        <Feed data={feedData} />
      </div>
    );
  }
}

const WrappedForm = Form.create({ name: "searchbox" })(App);

export default WrappedForm;
