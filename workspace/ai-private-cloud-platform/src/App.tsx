import { useState } from 'react';
import {
  Layout, Menu, Card, Row, Col, Progress, Table, Tag, Space, Button,
  List, Timeline, Calendar, Avatar, message, Input, Select, Typography
} from 'antd';
import {
  DashboardOutlined, DatabaseOutlined, FileTextOutlined, FolderOutlined,
  CloudUploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined,
  PlusOutlined, SearchOutlined, CheckCircleOutlined, ExclamationCircleOutlined, 
  WarningOutlined, InfoCircleOutlined, ExperimentOutlined, UploadOutlined,
  BellOutlined, UserOutlined
} from '@ant-design/icons';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

// 配置
const COLORS = {
  primary: '#10B981',
  secondary: '#34D399',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  info: '#1890ff',
};

// 导航配置
const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '工作台'
  },
  {
    key: 'data-center',
    icon: <DatabaseOutlined />,
    label: '数据中心',
    children: [
      { key: 'file-management', label: '文件管理' },
      { key: 'dataset-management', label: '数据集管理' }
    ]
  }
];

// 生成模拟数据集
const generateDatasets = (count: number) => {
  const types = ['文本', '图像', '音频', '视频', '多模态'];
  const statuses = ['草稿', '进行中', '已完成', '已发布', '已锁定'];
  const permissions = ['私有', '团队共享', '公开'];
  
  return Array(count).fill(null).map((_, index) => ({
    id: `DS-${index + 1}`,
    name: `${types[index % 5]}数据集-${String(index + 1).padStart(3, '0')}`,
    type: types[index % 5],
    description: `用于训练的数据集，包含${Math.floor(Math.random() * 10000) + 1000}条数据。`,
    samples: Math.floor(Math.random() * 100000) + 1000,
    size: Math.floor(Math.random() * 500) + 1,
    status: statuses[index % 5],
    permission: permissions[index % 3],
    progress: Math.floor(Math.random() * 100),
    creator: ['张三', '李四', '王五', '赵六'][index % 4],
    createTime: new Date(2026, 3, index + 1).toLocaleDateString(),
  }));
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const datasets = generateDatasets(20);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
  };

  // 渲染工作台
  const renderDashboard = () => {
    const activities = [
      { user: '张三', action: '创建了数据集', target: '「医疗影像数据集-v2.0」', time: '10分钟前' },
      { user: '李四', action: '完成了数据集标注', target: '「文档分类数据集」', time: '25分钟前' },
      { user: '王五', action: '导出了数据集', target: '「图像分类数据集」', time: '1小时前' }
    ];

    const alerts = [
      { type: 'danger', title: '数据集导出失败', content: '2个数据集因权限不足导出失败', time: '5分钟前' },
      { type: 'warning', title: '存储空间预警', content: '存储空间使用率达85%', time: '15分钟前' },
      { type: 'success', title: '标注任务完成', content: '「文档分类数据集」标注完成', time: '30分钟前' },
    ];

    return (
      <div className="dashboard-content">
        <Row gutter={[20, 20]}>
          {[
            { title: '数据集总数', value: 128, unit: '个', trend: '+12%', icon: <DatabaseOutlined />, color: COLORS.primary },
            { title: '总文件数', value: 1523, unit: '个', trend: '+8%', icon: <FileTextOutlined />, color: COLORS.success },
            { title: '存储使用', value: 62, unit: '%', trend: '+5%', icon: <FolderOutlined />, color: COLORS.warning },
            { title: '今日上传', value: 45, unit: '个', trend: '+15%', icon: <CloudUploadOutlined />, color: COLORS.info },
          ].map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div className="overview-card">
                <div className="overview-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="overview-card-content">
                  <div className="overview-card-title">{card.title}</div>
                  <div className="overview-card-value">
                    <span className="value-number">{card.value}</span>
                    <span className="value-unit">{card.unit}</span>
                    <span className="value-trend trend-up">{card.trend}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={16}>
            <Card title="最近动态" bordered={false} className="module-card">
              <Timeline>
                {activities.map((activity, i) => (
                  <Timeline.Item key={i}>
                    <Avatar style={{ marginRight: 8 }}>{activity.user[0]}</Avatar>
                    <span>{activity.user}</span>
                    <span style={{ margin: '0 8px' }}>{activity.action}</span>
                    <span style={{ color: COLORS.primary }}>{activity.target}</span>
                    <span style={{ marginLeft: 16, color: '#999' }}>{activity.time}</span>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            <Card title="系统通知" bordered={false} className="module-card" style={{ marginTop: 20 }}>
              <List
                dataSource={alerts}
                renderItem={(alert) => (
                  <List.Item>
                    {alert.type === 'success' && <CheckCircleOutlined style={{ color: COLORS.success, marginRight: 8 }} />}
                    {alert.type === 'warning' && <WarningOutlined style={{ color: COLORS.warning, marginRight: 8 }} />}
                    {alert.type === 'danger' && <ExclamationCircleOutlined style={{ color: COLORS.danger, marginRight: 8 }} />}
                    <strong>{alert.title}</strong>: {alert.content}
                    <span style={{ marginLeft: 16, color: '#999' }}>{alert.time}</span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="资源使用" bordered={false} className="module-card">
              {[
                { name: '存储空间', used: 6.2, total: 10, unit: 'TB', color: COLORS.warning },
                { name: '文件数量', used: 1523, total: 2000, unit: '个', color: COLORS.primary },
                { name: 'CPU使用', used: 35, total: 100, unit: '%', color: COLORS.success },
                { name: '内存使用', used: 48, total: 100, unit: '%', color: COLORS.info },
              ].map((resource) => (
                <div key={resource.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{resource.name}</span>
                    <span>{resource.used}/{resource.total} {resource.unit}</span>
                  </div>
                  <Progress percent={(resource.used / resource.total) * 100} size="small" strokeColor={resource.color} />
                </div>
              ))}
            </Card>

            <Card title="快速入口" bordered={false} className="module-card" style={{ marginTop: 20 }}>
              <Row gutter={[16, 16]}>
                {[
                  { icon: <PlusOutlined />, label: '新建数据集', color: COLORS.primary },
                  { icon: <ExperimentOutlined />, label: '去标注中心', color: COLORS.success },
                  { icon: <DownloadOutlined />, label: '模板下载', color: COLORS.info },
                  { icon: <UploadOutlined />, label: '批量导入', color: COLORS.warning },
                ].map((action, i) => (
                  <Col xs={12} key={i}>
                    <div className="quick-action-item" style={{ borderLeftColor: action.color }}>
                      <div className="quick-action-icon" style={{ color: action.color }}>{action.icon}</div>
                      <div className="quick-action-label">{action.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            <Card title="日程安排" bordered={false} className="module-card" style={{ marginTop: 20 }}>
              <Calendar fullscreen={false} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染文件管理
  const renderFileManagement = () => {
    const filesData = Array(15).fill(null).map((_, index) => ({
      id: `FILE-${String(index + 1).padStart(6, '0')}`,
      name: `数据文件_${String(index + 1).padStart(3, '0')}.${['jpg', 'png', 'txt', 'csv', 'json'][index % 5]}`,
      type: ['图像', '文本', '文档'][index % 3],
      size: Math.floor(Math.random() * 1000) + 1,
      status: ['已完成', '处理中', '失败'][index % 3],
      uploadTime: new Date(2026, 3, index + 1).toLocaleString(),
      uploader: ['张三', '李四', '王五', '赵六'][index % 4],
    }));

    const getStatusColor = (status: string) => {
      const colors: Record<string, string> = { '已完成': '#10B981', '处理中': '#1677FF', '失败': '#F5222D' };
      return colors[status] || '#6B7280';
    };

    const columns = [
      { title: '文件名称', dataIndex: 'name', key: 'name', ellipsis: true },
      { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
      { title: '大小', dataIndex: 'size', key: 'size', width: 80, render: (size: number) => `${size} MB` },
      { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag> },
      { title: '上传者', dataIndex: 'uploader', key: 'uploader', width: 80 },
      { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 160 },
      {
        title: '操作', key: 'action', width: 180, fixed: 'right' as const,
        render: (_: unknown, record: typeof filesData[0]) => (
          <Space size="small">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => message.success(`预览文件：${record.name}`)}>预览</Button>
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success(`下载文件：${record.name}`)}>下载</Button>
            <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => message.warning(`删除文件：${record.name}`)}>删除</Button>
          </Space>
        )
      }
    ];

    return (
      <div className="module-page">
        <div className="module-header">
          <div className="module-icon" style={{ background: COLORS.success }}><FileTextOutlined /></div>
          <div className="module-info">
            <h1 className="module-title">文件管理</h1>
            <p className="module-desc">管理平台中的所有文件，支持上传、下载、预览、删除等操作</p>
          </div>
        </div>
        <Card title="文件列表" bordered={false} className="module-card">
          <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
            <Input placeholder="搜索文件名称" prefix={<SearchOutlined />} style={{ width: 250 }} allowClear />
            <Select placeholder="文件类型" style={{ width: 120 }} allowClear>
              <Option value="image">图像</Option>
              <Option value="text">文本</Option>
              <Option value="document">文档</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>上传文件</Button>
          </div>
          <Table dataSource={filesData} rowKey="id" columns={columns} scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />
        </Card>
      </div>
    );
  };

  // 渲染数据集管理
  const renderDatasetManagement = () => {
    const getStatusColor = (status: string) => {
      const colors: Record<string, string> = { '草稿': '#6B7280', '进行中': '#1677FF', '已完成': '#10B981', '已发布': '#52c41a', '已锁定': '#8B5CF6' };
      return colors[status] || '#6B7280';
    };

    const columns = [
      { title: '数据集名称', dataIndex: 'name', key: 'name', ellipsis: true },
      { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
      { title: '样本数', dataIndex: 'samples', key: 'samples', width: 100, render: (v: number) => v.toLocaleString() },
      { title: '大小', dataIndex: 'size', key: 'size', width: 80, render: (size: number) => `${size} GB` },
      { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag> },
      { title: '进度', dataIndex: 'progress', key: 'progress', width: 120, render: (p: number) => <Progress percent={p} size="small" /> },
      { title: '创建者', dataIndex: 'creator', key: 'creator', width: 80 },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
      {
        title: '操作', key: 'action', width: 180, fixed: 'right' as const,
        render: (_: unknown, record: typeof datasets[0]) => (
          <Space size="small">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => message.info(`查看数据集：${record.name}`)}>查看</Button>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`编辑数据集：${record.name}`)}>编辑</Button>
            <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => message.warning(`删除数据集：${record.name}`)}>删除</Button>
          </Space>
        )
      }
    ];

    return (
      <div className="module-page">
        <div className="module-header">
          <div className="module-icon" style={{ background: COLORS.primary }}><DatabaseOutlined /></div>
          <div className="module-info">
            <h1 className="module-title">数据集管理</h1>
            <p className="module-desc">管理训练数据集，支持创建、标注、版本控制等操作</p>
          </div>
        </div>
        <Card title="数据集列表" bordered={false} className="module-card">
          <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
            <Input placeholder="搜索数据集名称" prefix={<SearchOutlined />} style={{ width: 250 }} allowClear />
            <Select placeholder="数据类型" style={{ width: 120 }} allowClear>
              <Option value="text">文本</Option>
              <Option value="image">图像</Option>
              <Option value="audio">音频</Option>
              <Option value="video">视频</Option>
            </Select>
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              <Option value="draft">草稿</Option>
              <Option value="processing">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>新建数据集</Button>
          </div>
          <Table dataSource={datasets} rowKey="id" columns={columns} scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />
        </Card>
      </div>
    );
  };

  // 渲染内容
  const renderContent = () => {
    if (selectedKey === 'dashboard') return renderDashboard();
    if (selectedKey === 'file-management') return renderFileManagement();
    if (selectedKey === 'dataset-management') return renderDatasetManagement();
    return renderDashboard();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <DatabaseOutlined style={{ fontSize: 24, color: COLORS.primary }} />
          {!collapsed && <span style={{ marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>AI数据平台</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, fontWeight: 500 }}>AI私有云数据管理平台</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px - 48px)', overflow: 'auto' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
