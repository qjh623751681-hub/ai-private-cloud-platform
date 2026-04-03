import React, { useState } from 'react';
import { Layout, Menu, Button, Breadcrumb, Avatar, Badge, Dropdown, Input, message } from 'antd';
import {
  DashboardOutlined, BellOutlined, UserOutlined, LogoutOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined, SettingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { COLORS } from './constants/colors';
import { menuItems } from './constants/menuItems';
import Dashboard from './components/Dashboard/Dashboard';
import FileManagement from './components/DataCenter/FileManagement';
import DatasetManagement from './components/DataCenter/DatasetManagement';
import './App.css';

const { Header, Sider, Content } = Layout;

// ==================== 主应用组件 ====================
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['工作台']);

  // 获取主题色
  const getThemeColor = () => {
    if (selectedKey === 'dashboard') return COLORS.primary;
    if (selectedKey.startsWith('file-')) return COLORS.success;
    if (selectedKey.startsWith('dataset-')) return COLORS.primary;
    return COLORS.primary;
  };

  // 处理菜单点击
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
    const breadcrumbPath: string[] = [];

    const findPath = (items: any, key: string, path: string[]): boolean => {
      for (const item of items) {
        if (item.key === key) {
          path.push(item.label);
          return true;
        }
        if (item.children) {
          path.push(item.label);
          if (findPath(item.children, key, path)) {
            return true;
          }
          path.pop();
        }
      }
      return false;
    };

    findPath(menuItems, e.key, breadcrumbPath);
    setBreadcrumb(breadcrumbPath);
  };

  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 渲染内容区
  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'file-management':
        return <FileManagement />;
      case 'dataset-management':
        return <DatasetManagement />;
      default:
        return (
          <div style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
              <div>功能开发中</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* 左侧导航栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="app-sider"
        width={240}
      >
        <div className="sider-logo">
          {collapsed ? (
            <div className="logo-icon">AI</div>
          ) : (
            <div className="logo-text">AI私有云平台</div>
          )}
        </div>
        <div className="sider-menu">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            onClick={handleMenuClick}
            items={menuItems}
          />
        </div>
        <div className="sider-footer">
          <div className="sider-user">
            <Avatar size={32} icon={<UserOutlined />} />
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">管理员</div>
                <div className="user-role">超级管理员</div>
              </div>
            )}
          </div>
        </div>
      </Sider>

      {/* 右侧内容区 */}
      <Layout className="app-main-layout">
        {/* 顶部导航栏 */}
        <Header className="app-header" style={{ borderBottomColor: getThemeColor() }}>
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
            >
              {collapsed ? '展开' : '收起'}
            </Button>
            <Breadcrumb className="header-breadcrumb">
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              {breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div className="header-right">
            <div className="header-search">
              <SearchOutlined className="search-icon" />
              <Input placeholder="搜索数据、模型、任务..." bordered={false} />
            </div>
            <div className="header-divider" />
            <div className="header-actions">
              <Badge count={3} className="header-badge">
                <Button type="text" icon={<BellOutlined />} className="header-action-btn" />
              </Badge>
              <Dropdown
                menu={{
                  items: [
                    { key: 'profile', label: '个人信息', icon: <UserOutlined /> },
                    { key: 'settings', label: '账号设置', icon: <SettingOutlined /> },
                    { type: 'divider' },
                    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: () => {
                      message.success('已退出登录');
                    }}
                  ]
                }}
                placement="bottomRight"
              >
                <div className="header-user">
                  <Avatar size={32} icon={<UserOutlined />} />
                  <span className="user-name">管理员</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        {/* 主内容区 */}
        <Content className="app-content">
          {renderContent()}
        </Content>
      </Layout>
    </div>
  );
}

export default App;
