import React, { Component } from "react";
import { Layout } from "antd";
import Dashboard from "../Dashboard";
import "./DashboardLayout.css";

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Header>
          <h2 className="headingTitle">Reddit Top Posts In Subreddit</h2>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div style={{ margin: "16px 0" }} />
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <Dashboard />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          David Stepanov - React Feed App
        </Footer>
      </Layout>
    );
  }
}

export default App;
