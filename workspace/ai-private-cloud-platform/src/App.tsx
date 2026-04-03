
import { useState, useEffect } from 'react';
import {
  Layout, Menu, Card, Row, Col, Statistic, Progress, Table, Tag, Space, Button,
  List, Timeline, Calendar, Breadcrumb, Dropdown, Avatar, Badge, message,
  Input, Select, InputNumber, Radio, Checkbox, Form, Descriptions, Steps, Modal, Upload,
  Alert, Tabs, Tooltip, Popover, Empty, Slider, Switch, Divider, Tree, TreeSelect,
  DatePicker, UploadProps, UploadFile, UploadChangeParam, Rate, notification,
  Popconfirm, Transfer, TransferProps, ConfigProvider, Typography, Spin
} from 'antd';
import {
  DashboardOutlined, DatabaseOutlined, FileTextOutlined, FolderOutlined,
  CloudUploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined,
  PlusOutlined, SearchOutlined, FilterOutlined, ReloadOutlined, CloseCircleOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined,
  WarningOutlined as WarningIcon, MoreOutlined, BellOutlined, UserOutlined, LogoutOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined, ClockCircleOutlined,
  FileSearchOutlined, TagsOutlined, ShareAltOutlined, SafetyOutlined,
  CopyOutlined, RocketOutlined, ExperimentOutlined, PlayCircleOutlined, PauseCircleOutlined,
  BarChartOutlined, TeamOutlined, KeyOutlined, FileOutlined as FileIcon,
  FolderOpenOutlined, FileTextOutlined as FileTextIcon,
  CheckCircleOutlined as CheckIcon, CloseCircleOutlined as CloseIcon,
  UploadOutlined, InboxOutlined, FileZipOutlined, HistoryOutlined,
  SettingOutlined, ExportOutlined, ImportOutlined, LockOutlined, UnlockOutlined,
  StarOutlined, StarFilled, FolderOpen, PlusSquareOutlined, MinusSquareOutlined
} from '@ant-design/icons';
import type { MenuProps, TabsProps, TreeDataNode, TransferDirection } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

// ==================== 配置 ====================
const COLORS = {
  primary: '#10B981',
  secondary: '#34D399',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  info: '#1890ff',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  bgLight: '#f3f4f6',
  border: '#e5e7eb',
  bgWhite: '#ffffff'
};

// ==================== 导航配置 ====================
const menuItems: MenuProps['items'] = [
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

// ==================== 模拟数据生成 ====================
const generateDatasets = (count: number) => {
  const types = ['文本', '图像', '音频', '视频', '多模态'];
  const statuses = ['草稿', '进行中', '已完成', '已发布', '已锁定'];
  const permissions = ['私有', '团队共享', '公开'];
  
  return Array(count).fill(null).map((_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `DS-${String(Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: `${type}数据集-${String(index + 1).padStart(3, '0')}`,
      type,
      description: `用于${['图像分类', '文本分类', '情感分析', '语音识别', '目标检测'][Math.floor(Math.random() * 5)]}任务的数据集，包含${Math.floor(Math.random() * 10000) + 1000}条数据。`,
      samples: Math.floor(Math.random() * 100000) + 1000,
      size: Math.floor(Math.random() * 500) + 1,
      status,
      permission: permissions[Math.floor(Math.random() * permissions.length)],
      progress: status === '草稿' ? 0 : status === '进行中' ? Math.floor(Math.random() * 80) + 10 : 100,
      accuracy: (85 + Math.random() * 14).toFixed(2) + '%',
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      creator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
      createTime: new Date(2026, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
      updateTime: new Date(2026, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
      tags: [['训练', '测试', '验证', '标注'][Math.floor(Math.random() * 4)]],
      annotationProgress: Math.floor(Math.random() * 100),
      annotationStatus: ['未开始', '标注中', '已完成', '已审核'][Math.floor(Math.random() * 4)],
      relatedTasks: Math.floor(Math.random() * 10),
      downloadCount: Math.floor(Math.random() * 100),
      versionCount: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(2026, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
      deletedAt: null
    };
  });
};

// ==================== 主组件 ====================
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['工作台']);
  
  // 数据集管理状态
  const [datasets, setDatasets] = useState<any[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<any[]>([]);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState<React.Key[]>([]);
  
  // 新建数据集向导状态
  const [wizardVisible, setWizardVisible] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    // 第一步：基础信息
    name: '',
    type: 'text',
    description: '',
    permission: 'private',
    tags: [] as string[],
    // 第二步：数据导入
    importMethod: 'upload',
    importedFiles: [] as any[],
    uploadProgress: 0,
    // 第三步：配置确认
    autoProcess: true,
    createTags: true
  });
  const [wizardForm] = Form.useForm();
  
  // 数据集详情页状态
  const [datasetDetailVisible, setDatasetDetailVisible] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<any>(null);
  const [detailTab, setDetailTab] = useState('overview');
  
  // 各种弹窗状态
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title: string;
    content: string;
    okText?: string;
    cancelText?: string;
    okType?: 'primary' | 'danger';
    onOk: () => void;
    onCancel: () => void;
  }>({ visible: false, title: '', content: '', onOk: () => {}, okText: '确定', okType: 'primary', cancelText: '取消' });
  
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    content: string;
    type: 'success' | 'warning' | 'danger' | 'info';
    showOk?: boolean;
  }>({ visible: false, title: '', content: '', type: 'info', showOk: false });
  
  const [showDraftModal, setShowDraftModal] = useState(false);
  
  // 上传相关状态
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 获取主题色
  const getThemeColor = () => {
    if (selectedKey === 'dashboard') return COLORS.primary;
    if (selectedKey.startsWith('file-')) return COLORS.success;
    if (selectedKey.startsWith('dataset-')) return COLORS.primary;
    return COLORS.primary;
  };

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

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 初始化数据
  useEffect(() => {
    const initialDatasets = generateDatasets(20);
    setDatasets(initialDatasets);
    setFilteredDatasets(initialDatasets);
  }, []);

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList: fileList,
    onChange(info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList);
      
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
      
      if (info.file.status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} 上传成功`);
      }
      
      if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} 上传失败`);
      }
    },
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 1024; // 1GB
      if (!isValidSize) {
        message.error('文件大小不能超过1GB');
      }
      return isValidSize;
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    }
  };

  // 渲染工作台
  const renderDashboard = () => {
    const activities = [
      {
        user: '张三',
        avatar: '张',
        action: '创建了数据集',
        target: '「医疗影像数据集-v2.0」',
        time: '10分钟前'
      },
      {
        user: '李四',
        avatar: '李',
        action: '完成了数据集标注',
        target: '「文档分类数据集」标注完成率100%',
        time: '25分钟前'
      },
      {
        user: '王五',
        avatar: '王',
        action: '导出了数据集',
        target: '「图像分类数据集」',
        time: '1小时前'
      }
    ];

    const alerts = [
      {
        type: 'danger',
        title: '数据集导出失败',
        content: '您批量导出的3个数据集中，2个因权限不足导出失败',
        time: '5分钟前',
        urgent: true
      },
      {
        type: 'warning',
        title: '存储空间预警',
        content: '您的存储空间使用率达85%，建议清理过期数据集或申请扩容',
        time: '15分钟前',
        urgent: false
      },
      {
        type: 'success',
        title: '标注任务完成',
        content: '「文档分类数据集」标注任务已完成，标注完成率100%',
        time: '30分钟前',
        urgent: false
      },
      {
        type: 'info',
        title: '新版本发布',
        content: '平台v2.5.0已发布，新增分布式训练支持',
        time: '2小时前',
        urgent: false
      }
    ];

    return (
      <div className="dashboard-content">
        <Row gutter={[20, 20]}>
          {[
            { 
              title: '数据集总数', 
              value: 128, 
              unit: '个', 
              trend: '+12%', 
              icon: <DatabaseOutlined />, 
              color: COLORS.primary,
              desc: '覆盖图像、文本、音频、视频等多种类型'
            },
            { 
              title: '总文件数', 
              value: 1523, 
              unit: '个', 
              trend: '+8%', 
              icon: <FileTextOutlined />, 
              color: COLORS.success,
              desc: '所有已上传的文件数量'
            },
            { 
              title: '存储使用', 
              value: 62, 
              unit: '%', 
              trend: '+5%', 
              icon: <FolderOutlined />, 
              color: COLORS.warning,
              desc: '可用存储空间：3.8TB / 10TB'
            },
            { 
              title: '今日上传', 
              value: 45, 
              unit: '个', 
              trend: '+15%', 
              icon: <CloudUploadOutlined />, 
              color: COLORS.info,
              desc: '今日新上传文件数量'
            }
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
                    <span className={`value-trend ${card.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                      {card.trend}
                    </span>
                  </div>
                  <div className="overview-card-desc">{card.desc}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={16}>
            <Card title="最近动态" bordered={false} className="module-card">
              <Timeline className="activity-timeline">
                {activities.map((activity) => (
                  <Timeline.Item key={activity.user}>
                    <div className="activity-content">
                      <Avatar className="activity-avatar">{activity.avatar}</Avatar>
                      <div className="activity-text">
                        <div className="activity-main">
                          <span className="activity-user">{activity.user}</span>
                          <span className="activity-action">{activity.action}</span>
                          <span className="activity-target">{activity.target}</span>
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            <Card title="系统通知" bordered={false} className="module-card" style={{ marginTop: 20 }}>
              <List
                dataSource={alerts}
                renderItem={(alert: any) => (
                  <List.Item className={`alert-item alert-${alert.type}`}>
                    <div className="alert-content">
                      <div className="alert-title">
                        {alert.type === 'success' && <CheckCircleOutlined />}
                        {alert.type === 'warning' && <WarningOutlined />}
                        {alert.type === 'danger' && <ExclamationCircleOutlined />}
                        {alert.type === 'info' && <InfoCircleOutlined />}
                        <strong>{alert.title}</strong>: {alert.content}
                        <span className="alert-time">{alert.time}</span>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="资源使用" bordered={false} className="module-card">
              {[
                { name: '存储空间', used: 6.2, total: 10, unit: 'TB', color: COLORS.warning },
                { name: '文件数量', used: 1523, total:  2000, unit: '个', color: COLORS.primary },
                { name: 'CPU使用', used: 35, total: 100, unit: '%', color: COLORS.success },
                { name: '内存使用', used: 48, total: 100, unit: '%', color: COLORS.info }
              ].map((resource) => (
                <div key={resource.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{resource.name}</span>
                    <span>{resource.used}/{resource.total} {resource.unit}</span>
                  </div>
                  <Progress 
                    percent={(resource.used / resource.total) * 100} 
                    size="small" 
                    strokeColor={resource.color}
                  />
                </div>
              ))}
            </Card>

            <Card title="快速入口" bordered={false} className="module-card">
              <Row gutter={[16, 16]}>
                {[
                  { icon: <PlusOutlined />, label: '新建数据集', desc: '创建新数据集', color: COLORS.primary, action: 'create' },
                  { icon: <ExperimentOutlined />, label: '去标注中心', desc: '跳转到标注', color: COLORS.success, action: 'annotation' },
                  { icon: <DownloadOutlined />, label: '模板下载', desc: '下载模板', color: COLORS.info, action: 'template' },
                  { icon: <UploadOutlined />, label: '批量导入', desc: '批量导入', color: COLORS.warning, action: 'batch-import' }
                ].map((action) => (
                  <Col xs={12} key={action.action}>
                    <div 
                      className="quick-action-item"
                      onClick={() => {
                        if (action.action === 'create') {
                          setWizardVisible(true);
                          setWizardStep(0);
                          setWizardData({
                            name: '',
                            type: 'text',
                            description: '',
                            permission: 'private'
                          });
                          wizardForm.resetFields();
                        } else if (action.action === 'annotation') {
                          message.info('正在跳转到标注中心...');
                        } else if (action.action === 'template') {
                          message.success('模板下载成功');
                        } else if (action.action === 'batch-import') {
                          message.info('打开批量导入...');
                        }
                      }}
                      style={{ borderLeftColor: action.color }}
                    >
                      <div className="quick-action-icon" style={{ color: action.color }}>
                        {action.icon}
                      </div>
                      <div className="quick-action-label">{action.label}</div>
                      <div className="quick-action-desc">{action.desc}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            <Card title="日程安排" bordered={ false} className="module-card" style={{ marginTop: 20 }}>
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
      name: `数据文件_${String(index + 1).padStart(3, '0')}.${['jpg', 'png', 'txt', 'csv', 'json', 'pdf', 'docx'][index % 7]}`,
      type: ['图像', '文本', '文档'][index % 3],
      size: Math.floor(Math.random() * 1000) + 1,
      status: ['已完成', '处理中', '失败'][index % 3],
      uploadTime: new Date(2026, 3, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toLocaleString(),
      uploader: ['张三', '李四', '王五', '赵六', '孙七'][index % 5]
    }));

    const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
        '已完成': '#10B981',
        '处理中': '#1677FF',
        '失败': '#F5222D'
      };
      return colors[status] || '#6B7280';
    };

    const handleDelete = (record: any) => {
      setConfirmModal({
        visible: true,
        title: '确认删除文件',
        content: `确定要删除文件「${record.name}」吗？此操作不可恢复。`,
        onOk: () => {
          message.success('文件删除成功');
        }
      });
    };

    return (
      <div className="module-page" style={{ '--module-color': COLORS.success } as React.CSSProperties}>
        <div className="module-header">
          <div className="module-icon" style={{ background: COLORS.success }}>
            <FileTextOutlined />
          </div>
          <div className="module-info">
            <h1 className="module-title">文件管理</h1>
            <p className="module-desc">管理平台中的所有文件，支持上传、下载、预览、删除等操作</p>
          </div>
        </div>

        <Card title="文件列表" bordered={false} className="module-card">
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Input 
              placeholder="搜索文件名称" 
              prefix={<SearchOutlined />} 
              style={{ width: 250 }} 
              allowClear 
            />
            <Select placeholder="文件类型" style={{ width: 120 }} allowClear>
              <Option value="image">图像</Option>
              <Option value="text">文本</Option>
              <Option value="document">文档</Option>
            </Select>
            <Select placeholder="处理状态" style={{ width: 120 }} allowClear>
              <Option value="completed">已完成</Option>
              <Option value="processing">处理中</Option>
              <Option value="failed">失败</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>上传文件</Button>
          </div>

          <Table
            dataSource={filesData}
            rowKey="id"
            size="middle"
            pagination={{
              total: filesData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个文件`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            columns={[
              { 
                title: '文件名称', 
                dataIndex: 'name', 
                key: 'name',
                ellipsis: true
              },
              { 
                title: '类型', 
                dataIndex: 'type', 
                key: 'type',
                width: 80
              },
              { 
                title: '大小', 
                dataIndex: 'size', 
                key: 'size', 
                width: 80,
                render: (size) => `${size} MB` 
              },
              { 
                title: '状态', 
                dataIndex: 'status', 
                key: 'status',
                width: 90,
                render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag> 
              },
              { 
                title: '上传者', 
                dataIndex: 'uploader', 
                key: 'uploader',
                width: 80 
              },
              { 
                title: '上传时间', 
                dataIndex: 'uploadTime', 
                key: 'uploadTime',
                width: 160 
              },
              {
                title: '操作',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (_, record) => (
                  <Space size="small">
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<EyeOutlined />}
                      onClick={() => message.success(`预览文件：${record.name}`)}
                    >
                      预览
                    </Button>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      onClick={() => message.success(`开始下载文件：${record.name}`)}
                    >
                      下载
                    </Button>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      danger
                      onClick={() => handleDelete(record)}
                    >
                      删除
                    </Button>
                  </Space>
                )
              }
            ]}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
    );
  };

  // 渲染数据集管理
  const renderDatasetManagement = () => {
    const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
        '草稿': '#6B7280',
        '进行中': '#1677FF',
        '已完成': '#10B981',
        '已发布': '#52c41a',
        '已锁定': '#8B5CF6'
      };
      return colors[status] || '#6B7280';
    };

    const getPermissionColor = (permission: string) => {
      const colors: Record<string, string> = {
        '私有': '#6B7280',
        '团队共享': '#1677FF',
        '公开': '#10B981'
      };
      return colors[permission] || '#6B7280';
    };

    const handleDeleteDataset = (record: any) => {
      setConfirmModal({
        visible: true,
        title: '确认删除数据集',
        content: `您已选择1个数据集「${record.name}」，删除后数据将无法恢复，且会影响关联的训练任务，是否确认删除？`,
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          message.success('数据集删除成功');
          setDatasets(datasets.filter(d => d.id !== record.id));
          setFilteredDatasets(filteredDatasets.filter(d => d.id !== record.id));
        }
      });
    };

    const handleBatchDelete = () => {
      if (selectedDatasetKeys.length === 0) {
        message.warning('请选择要删除的数据集');
        return;
      }
      
      setConfirmModal({
        visible: true,
        title: '确认批量删除数据集',
        content: `您已选择 ${selectedDatasetKeys.length} 个数据集，删除后数据将无法恢复，且会影响关联的训练任务，是否确认删除？`,
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          message.success(`已成功删除 ${selectedDatasetKeys.length} 个数据集`);
          setDatasets(datasets.filter(d => !selectedDatasetKeys.includes(d.id)));
          setFilteredDatasets(filteredDatasets.filter(d => !selectedDatasetKeys.includes(d.id)));
          setSelectedDatasetKeys([]);
        }
      });
    };

    return (
      <div className="module-page" style={{ '--module-color': COLORS.primary } as React.CSSProperties}>
        <div className="module-header">
          <div className="module-icon" style={{ background: COLORS.primary }}>
            <DatabaseOutlined />
          </div>
          <div className="module-info">
            <h1 className="module-title">数据集管理</h1>
            <p className="module-desc">创建、管理和使用数据集，为AI训练提供标准化数据底座</p>
          </div>
        </div>

        <Card 
          title="数据集列表" 
          bordered={false} 
          className="module-card"
          extra={
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setWizardVisible(true);
                setWizardStep(0);
                setWizardData({
                  name: '',
                  type: 'text',
                  description: '',
                  permission: 'private'
                });
                wizardForm.resetFields();
              }}>
                新建数据集
              </Button>
            </Space>
          }
        >
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Input 
              placeholder="搜索数据集名称" 
              prefix={<SearchOutlined />} 
              style={{ width: 250 }} 
              allowClear 
            />
            <Select placeholder="数据集类型" style={{ width: 120 }} allowClear>
              <Option value="all">全部</Option>
              <Option value="text">文本</Option>
              <Option value="image">图像</Option>
              <Option value="audio">音频</Option>
              <Option value="video">视频</Option>
              <Option value="multimodal">多模态</Option>
            </Select>
            <Select placeholder="状态" style={{ width: 120 }} allowClear>
              <Option value="all">全部</Option>
              <Option value="draft">草稿</Option>
              <Option value="processing">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="published">已发布</Option>
              <Option value="locked">已锁定</Option>
            </Select>
            <Select placeholder="权限范围" style={{ width: 120 }} allowClear>
              <Option value="all">全部</Option>
              <Option value="mine">我创建的</Option>
              <Option value="shared">共享给我的</Option>
            </Select>
          </div>

          <Table
            dataSource={filteredDatasets}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedDatasetKeys,
              onChange: (keys) => setSelectedDatasetKeys(keys as React.Key[])
            }}
            size="middle"
            pagination={{
              total: filteredDatasets.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个数据集`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            columns={[
              {
                title: '数据集名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                  <Button 
                    type="link" 
                    onClick={() => {
                      setCurrentDataset(record);
                      setDatasetDetailVisible(true);
                    }}
                  >
                    {text}
                  </Button>
                )
              },
              {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 80,
                render: (type) => {
                  const colors = {
                    '文本': COLORS.primary,
                    '图像': COLORS.warning,
                    '音频': COLORS.success,
                    '视频': COLORS.danger,
                    '多模态': COLORS.info
                  };
                  return <Tag color={colors[type as keyof typeof colors] || '#6B7280'}>{type}</Tag>;
                }
              },
              {
                title: '样本数量',
                dataIndex: 'samples',
                key: 'samples',
                width: 100,
                render: (samples) => samples.toLocaleString()
              },
              {
                title: '大小',
                dataIndex: 'size',
                key: 'size',
                width: 80,
                render: (size) => `${size} GB`
              },
              {
                title: '准确率',
                dataIndex: 'accuracy',
                key: 'accuracy',
                width: 80,
                render: (accuracy) => (
                  <span style={{ 
                    color: parseFloat(accuracy) >= 90 ? COLORS.success : parseFloat(accuracy) >= 80 ? COLORS.warning : COLORS.danger
                  }}>
                    {accuracy}
                  </span>
                )
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 90,
                render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
              },
              {
                title: '权限',
                dataIndex: 'permission',
                key: 'permission',
                width: 90,
                render: (permission) => <Tag color={getPermissionColor(permission)}>{permission}</Tag>
              },
              {
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator',
                width: 80
              },
              {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 160,
                render: (time) => new Date(time).toLocaleDateString()
              },
              {
                title: '标注进度',
                dataIndex: 'annotationProgress',
                key: 'annotationProgress',
                width: 100,
                render: (progress) => <Progress percent={progress} size="small" />
              },
              {
                title: '版本',
                dataIndex: 'version',
                key: 'version'
              },
              {
                title: '操作',
                key: 'action',
                width: 300,
                fixed: 'right',
                render: (_, record) => (
                  <Space size="small">
                    <Tooltip title="查看详情">
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => {
                          setCurrentDataset(record);
                          setDatasetDetailVisible(true);
                        }}
                      >
                        详情
                      </Button>
                    </Tooltip>
                    <Tooltip title="标注">
                      <Button 
                        type="link" 
                        size="small" 
                        icon={<BarChartOutlined />}
                        onClick={() => {
                          if (record.samples === 0) {
                            message.warning('该数据集暂无数据，无法进行标注，请先导入数据');
                            return;
                          }
                          message.info('正在跳转到标注中心...');
                        }}
                      >
                        标注
                      </Button>
                    </Tooltip>
                    <Dropdown
                      menu={{
                        items: [
                          { 
                            key: 'edit', 
                            label: '编辑', 
                            icon: <EditOutlined />,
                            onClick: () => message.info('编辑功能开发中')
                          },
                          { 
                            key: 'copy', 
                            label: '复制', 
                            icon: <CopyOutlined />,
                            onClick: () => {
                              setConfirmModal({
                                visible: true,
                                title: '确认复制数据集',
                                content: `将复制该数据集的全部数据与配置，生成新的数据集，是否确认？`,
                                onOk: () => {
                                  message.success(`数据集复制成功，新数据集名称：${record.name}_副本`);
                                }
                              });
                            }
                          },
                          { 
                            key: 'export', 
                            label: '导出', 
                            icon: <DownloadOutlined />,
                            onClick: () => message.success('数据集导出中...')
                          },
                          { 
                            key: 'share', 
                            label: '共享', 
                            icon: <ShareAltOutlined />,
                            onClick: () => message.info('共享功能开发中')
                          },
                          { 
                            type: 'divider' as const 
                          },
                          { 
                            key: 'delete', 
                            label: '删除', 
                            icon: <DeleteOutlined />, 
                            danger: true,
                            onClick: () => handleDeleteDataset(record)
                          }
                        ]
                      }}
                    >
                      <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </Space>
                )
              }
            ]}
            scroll={{ x: 1400 }}
          />
        </Card>
      </div>
    );
  };

  // 渲染数据集详情页
  const renderDatasetDetail = () => {
    if (!currentDataset) return null;

    const renderOverviewTab = () => (
      <div>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card title="数据集信息" bordered={false}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="数据集名称">{currentDataset.name}</Descriptions.Item>
                <Descriptions.Item label="数据集类型">{currentDataset.type}</Descriptions.Item>
                <Descriptions.Item label="数据集描述" span={2}>{currentDataset.description}</Descriptions.Item>
                <Descriptions.Item label="样本数量">{currentDataset.samples.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="数据大小">{currentDataset.size} GB</Descriptions.Item>
                <Descriptions.Item label="准确率">{currentDataset.accuracy}</Descriptions.Item>
                <Descriptions.Item label="标注进度">
                  <Progress percent={currentDataset.annotationProgress} size="small" />
                </Descriptions.Item>
                <Descriptions.Item label="当前版本">{currentDataset.version}</Descriptions.Item>
                <Descriptions.Item label="版本数量">{currentDataset.versionCount}</Descriptions.Item>
                <Descriptions.Item label="权限范围">
                  <Tag color={
                    currentDataset.permission === '私有' ? '#6B7280' :
                    currentDataset.permission === '团队共享' ? '#1677FF' : '#10B981'
                  }>
                    {currentDataset.permission}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建者">{currentDataset.creator}</Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {new Date(currentDataset.createTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {new Date(currentDataset.updateTime).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="版本历史" bordered={false}>
              <List
                dataSource={[
                  { version: 'v1.3.0', time: '2026-04-01', desc: '新增1000条样本', status: '当前版本' },
                  { version: 'v1.2.0', time: '2026-03-15', desc: '修正标签错误', status: '' },
                  { version: 'v1.1.0', time: '2026-02-20', desc: '添加元数据', status: '' },
                  { version: 'v1.0.0', time: '2026-01-10', desc: '初始版本', status: '' }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: COLORS.primary }}>
                          {item.version.split('.').slice(0, 2).join('.')}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong>{item.version}</Text>
                          {item.status && <Tag color={COLORS.success}>{item.status}</Tag>}
                        </Space>
                      }
                      description={`${item.time} - ${item.desc}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="关联任务" bordered={false}>
              <List
                dataSource={[
                  { name: '图像分类模型训练', status: '运行中', time: '2小时前' },
                  { name: '目标检测模型训练', status: '已完成', time: '1天前' },
                  { name: '模型微调任务', status: '等待中', time: '2天前' }
                ]}
                renderItem={(task) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: task.status === '运行中' ? COLORS.primary : COLORS.success }}>
                          {task.name[0]}
                        </Avatar>
                      }
                      title={task.name}
                      description={
                        <Space>
                          <Tag color={task.status === '运行中' ? COLORS.primary : COLORS.success}>
                            {task.status}
                          </Tag>
                          <Text type="secondary">{task.time}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );

    const renderPreviewTab = () => (
      <div>
        <Card title="数据预览" bordered={false}>
          <Table
            dataSource={Array(10).fill(null).map((_, index) => ({
              id: index + 1,
              name: `样本_${String(index + 1).padStart(3, '0')}`,
              type: currentDataset.type,
              label: ['类别1', '类别2', '类别3'][index % 3],
              confidence: (0.85 + Math.random() * 0.14).toFixed(2),
              createTime: new Date(2026, 3, Math.floor(Math.random() * 30) + 1).toISOString()
            }))}
            rowKey="id"
            size="middle"
            pagination={{
              total: 100,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
            columns={[
              { title: 'ID', dataIndex: 'id', width: 60 },
              { title: '样本名称', dataIndex: 'name' },
              { title: '类型', dataIndex: 'type', width: 100 },
              { title: '标签', dataIndex: 'label', width: 100 },
              { title: '置信度', dataIndex: 'confidence', width: 100 },
              { title: '创建时间', dataIndex: 'createTime', width: 160, render: (time) => new Date(time).toLocaleString() },
              {
                title: '操作',
                key: 'action',
                width: 150,
                render: () => (
                  <Space size="small">
                    <Button type="link" size="small">查看</Button>
                    <Button type="link" size="small">编辑</Button>
                    <Button type="link" size="small" danger>删除</Button>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </div>
    );

    const renderAnnotationTab = () => (
      <div>
        <Card title="标注中心" bordered={false}>
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="标注进度">
                <Progress percent={currentDataset.annotationProgress} strokeColor={COLORS.primary} />
                <div style={{ marginTop: 8, color: '#6b7280' }}>
                  已标注 {Math.floor(currentDataset.samples * currentDataset.annotationProgress / 100)}/{currentDataset.samples} 条数据
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="标签统计">
                <Row gutter={[8, 8]}>
                  {['类别1', '类别2', '类别3', '类别4'].map((label, index) => (
                    <Col span={12} key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span>{label}</span>
                        <span>{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary">开始标注</Button>
              <Button>保存进度</Button>
              <Button>提交审核</Button>
              <Button danger>清空标注</Button>
            </Space>

            <Alert
              message="标注说明"
              description="请根据数据集类型选择合适的标注方式。支持单人标注和多人协作标注模式。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </div>
        </Card>
      </div>
    );

    const renderVersionTab = () => (
      <div>
        <Card title="版本管理" bordered={false}>
          <Table
            dataSource={[
              { version: 'v1.3.0', time: '2026-04-01 10:30', creator: '张三', desc: '新增1000条样本', locked: false },
              { version: 'v1.2.0', time: '2026-03-15 14:20', creator: '李四', desc: '修正标签错误', locked: false },
              { version: 'v1.1.0', time: '2026-02-20 09:15', creator: '王五', desc: '添加元数据', locked: false },
              { version: 'v1.0.0', time: '2026-01-10 16:45', creator: '赵六', desc: '初始版本', locked: true }
            ]}
            rowKey="version"
            columns={[
              { title: '版本号', dataIndex: 'version', render: (text) => <Tag color={COLORS.primary}>{text}</Tag> },
              { title: '创建时间', dataIndex: 'time' },
              { title: '创建者', dataIndex: 'creator' },
              { title: '描述', dataIndex: 'desc' },
              {
                title: '状态',
                dataIndex: 'locked',
                width: 80,
                render: (locked) => locked ? <Tag color="orange">已锁定</Tag> : <Tag color="green">正常</Tag>
              },
              {
                title: '操作',
                key: 'action',
                width: 250,
                render: (_, record) => (
                  <Space size="small">
                    <Button type="link" size="small" disabled={record.locked}>回滚</Button>
                    <Button type="link" size="small">对比</Button>
                    <Button type="link" size="small">
                      {record.locked ? <UnlockOutlined /> : <LockOutlined />}
                      {record.locked ? '解锁' : '锁定'}
                    </Button>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </div>
    );

    const renderRelatedTasksTab = () => (
      <div>
        <Card title="关联任务" bordered={false}>
          <Table
            dataSource={[
              { id: 1, name: '图像分类模型训练', status: '运行中', progress: 65, time: '2026-04-03 10:00' },
              { id: 2, name: '目标检测模型训练', status: '已完成', progress: 100, time: '2026-04-02 15:30' },
              { id: 3, name: '模型微调任务', status: '等待中', progress: 0, time: '2026-04-04 09:00' }
            ]}
            rowKey="id"
            columns={[
              { title: '任务ID', dataIndex: 'id', width: 80 },
              { title: '任务名称', dataIndex: 'name' },
              {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => {
                  const colors = { '运行中': 'processing', '已完成': 'success', '等待中': 'default' };
                  return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
                }
              },
              {
                title: '进度',
                dataIndex: 'progress',
                width: 150,
                render: (progress) => <Progress percent={progress} size="small" />
              },
              { title: '创建时间', dataIndex: 'time', width: 160 },
              {
                title: '操作',
                key: 'action',
                width: 180,
                render: (_, record) => (
                  <Space size="small">
                    <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
                    {record.status === '运行中' && (
                      <Button type="link" size="small" danger icon={<PauseCircleOutlined />}>停止</Button>
                    )}
                    {record.status === '等待中' && (
                      <Button type="link" size="small" type="primary" icon={<PlayCircleOutlined />}>启动</Button>
                    )}
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </div>
    );

    const renderSettingsTab = () => (
      <div>
        <Card title="基础设置" bordered={false} style={{ marginBottom: 16 }}>
          <Form layout="vertical">
            <Form.Item label="数据集名称">
              <Input defaultValue={currentDataset.name} />
            </Form.Item>
            <Form.Item label="数据集描述">
              <TextArea rows={3} defaultValue={currentDataset.description} />
            </Form.Item>
            <Form.Item label="权限设置">
              <Radio.Group defaultValue={currentDataset.permission === '私有' ? 'private' : currentDataset.permission === '团队共享' ? 'team' : 'public'}>
                <Radio value="private">私有</Radio>
                <Radio value="team">团队共享</Radio>
                <Radio value="public">公开</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        <Card title="高级配置" bordered={false} style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>自动数据清洗</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>智能分段</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>自动创建标签</Text>
              <Switch />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>允许外部访问</Text>
              <Switch defaultChecked={currentDataset.permission !== '私有'} />
            </div>
          </Space>
        </Card>

        <Card title="危险操作" bordered={false}>
          <Space>
            <Button danger icon={<DeleteOutlined />}>删除数据集</Button>
            <Button danger icon={<LockOutlined />}>锁定数据集</Button>
          </Space>
          <Alert
            message="警告"
            description="删除或锁定数据集是不可逆操作，请谨慎操作"
            type="warning"
            showIcon
            style={{ marginTop: 12 }}
          />
        </Card>
      </div>
    );

    return (
      <div className="module-page" style={{ '--module-color': COLORS.primary } as React.CSSProperties}>
        <div className="module-header">
          <div className="module-icon" style={{ background: COLORS.primary }}>
            <DatabaseOutlined />
          </div>
          <div className="module-info">
            <h1 className="module-title">{currentDataset.name}</h1>
            <p className="module-desc">{currentDataset.description}</p>
          </div>
          <Space>
            <Button icon={<ShareAltOutlined />}>共享</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
            <Button icon={<EditOutlined />}>编辑</Button>
          </Space>
        </div>

        <Card bordered={false} className="module-card">
          <Tabs
            activeKey={detailTab}
            onChange={setDetailTab}
            items={[
              { key: 'overview', label: '数据总览', children: renderOverviewTab() },
              { key: 'preview', label: '数据预览', children: renderPreviewTab() },
              { key: 'annotation', label: '标注中心', children: renderAnnotationTab() },
              { key: 'version', label: '版本管理', children: renderVersionTab() },
              { key: 'related', label: '关联任务', children: renderRelatedTasksTab() },
              { key: 'settings', label: '设置', children: renderSettingsTab() }
            ]}
          />
        </Card>
      </div>
    );
  };

  // 渲染新建数据集向导
  const renderWizardStep1 = () => (
    <div style={{ marginTop: 32 }}>
      <Form
        form={wizardForm}
        layout="vertical"
        initialValues={{
          type: 'text',
          permission: 'private'
        }}
        onFinish={() => {
          wizardForm.validateFields().then((values) => {
            setWizardData({ ...wizardData, ...values });
            setWizardStep(1);
          });
        }}
      >
        <Form.Item
          name="name"
          label="数据集名称"
          rules={[
            { required: true, message: '请输入数据集名称' },
            { min: 2, max: 50, message: '数据集名称2-50字符' }
          ]}
          extra="名称应简洁明了，便于识别和管理"
        >
          <Input placeholder="例如：医疗影像数据集" />
        </Form.Item>

        <Form.Item
          name="type"
          label="数据集类型"
          rules={[{ required: true, message: '请选择数据集类型' }]}
        >
          <Select placeholder="请选择数据集类型">
            <Option value="text">文本数据集</Option>
            <Option value="image">图像数据集</Option>
            <Option value="audio">音频数据集</Option>
            <Option value="video">视频数据集</Option>
            <Option value="multimodal">多模态数据集</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="数据集描述"
          extra="描述数据集的用途、特点、数据来源等信息"
        >
          <TextArea rows={3} placeholder="请输入数据集描述" maxLength={500} showCount />
        </Form.Item>

        <Form.Item
          name="permission"
          label="权限设置"
          rules={[{ required: true, message: '请选择权限设置' }]}
          extra="权限设置决定了谁能访问和操作该数据集"
        >
          <Radio.Group>
            <Radio value="private">
              <div>
                <Text strong>私有</Text>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>仅您自己可以访问</div>
              </div>
            </Radio>
            <Radio value="team">
              <div>
                <Text strong>团队共享</Text>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>团队成员可以访问</div>
              </div>
            </Radio>
            <Radio value="public">
              <div>
                <Text strong>公开</Text>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>所有人都可以访问</div>
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
          extra="添加标签便于快速检索和分类"
        >
          <Select
            mode="tags"
            placeholder="输入标签名称，按回车添加"
            style={{ width: '100%' }}
          >
            <Option value="训练">训练</Option>
            <Option value="测试">测试</Option>
            <Option value="验证">验证</Option>
            <Option value="标注">标注</Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            下一步
          </Button>
        </div>
      </Form>
    </div>
  );

  const renderWizardStep2 = () => (
    <div style={{ marginTop: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <Radio.Group 
          defaultValue="upload" 
          onChange={(e) => setWizardData({ ...wizardData, importMethod: e.target.value })}
          value={wizardData.importMethod}
        >
          <Radio.Button value="upload">本地上传</Radio.Button>
          <Radio.Button value="cloud">云存储导入</Radio.Button>
          <Radio.Button value="url">URL导入</Radio.Button>
        </Radio.Group>
      </div>

      {wizardData.importMethod === 'upload' && (
        <div>
          <div 
            style={{
              marginBottom: 24,
              padding: 48,
              background: '#fafafa',
              borderRadius: 8,
              border: '2px dashed #d9d9d9',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }}>
              <InboxOutlined />
            </div>
            <Text style={{ fontSize: 14, color: '#8c8c8c' }}>
              点击或拖拽文件到此处上传
            </Text>
            <div style={{ marginTop: 8, fontSize: 12, color: '#bfbfbf' }}>
              支持单个或批量上传，文件大小不超过1GB
            </div>
          </div>

          {fileList.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>已选择 {fileList.length} 个文件</Text>
              <List
                dataSource={fileList}
                renderItem={(file) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small" danger>移除</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined />}
                      title={file.name}
                      description={`${(file.size! / 1024 / 1024).toFixed(2)} MB`}
                    />
                    {file.status === 'uploading' && <Progress percent={50} size="small" />}
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}

      {wizardData.importMethod === 'cloud' && (
        <div>
          <Form layout="vertical">
            <Form.Item label="云存储类型">
              <Select placeholder="选择云存储类型">
                <Option value="oss">阿里云OSS</Option>
                <Option value="cos">腾讯云COS</Option>
                <Option value="s3">AWS S3</Option>
                <Option value="minio">MinIO</Option>
              </Select>
            </Form.Item>
            <Form.Item label="存储桶">
              <Input placeholder="输入存储桶名称" />
            </Form.Item>
            <Form.Item label="路径前缀">
              <Input placeholder="输入文件路径前缀" />
            </Form.Item>
          </Form>
        </div>
      )}

      {wizardData.importMethod === 'url' && (
        <div>
          <Form layout="vertical">
            <Form.Item
              label="URL地址"
              rules={[{ required: true, message: '请输入URL地址' }]}
            >
              <Input placeholder="输入数据集URL地址" />
            </Form.Item>
            <Form.Item label="认证信息（可选）">
              <Input placeholder="用户名" style={{ marginBottom: 8 }} />
              <Input.Password placeholder="密码" />
            </Form.Item>
          </Form>
        </div>
      )}

      <Alert
        message="提示"
        description="上传后系统将自动进行数据清洗、格式转换、智能分段等预处理操作"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => setWizardStep(0)}>上一步</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setWizardData({ ...wizardData, importedFiles: fileList });
          setWizardStep(2);
        }}>
          下一步
        </Button>
      </div>
    </div>
  );

  const renderWizardStep3 = () => (
    <div style={{ marginTop: 32 }}>
      <Card title="配置确认" size="small" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="数据集名称">{wizardData.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="数据集类型">{wizardData.type || '-'}</Descriptions.Item>
          <Descriptions.Item label="数据集描述" span={2}>{wizardData.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="权限设置">
            {wizardData.permission === 'private' ? '私有' : 
             wizardData.permission === 'team' ? '团队共享' : '公开'}
          </Descriptions.Item>
          <Descriptions.Item label="标签">
            {(wizardData.tags || []).join(', ') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="导入方式">
            {wizardData.importMethod === 'upload' ? '本地上传' :
             wizardData.importMethod === 'cloud' ? '云存储导入' : 'URL导入'}
          </Descriptions.Item>
          <Descriptions.Item label="文件数量">
            {wizardData.importedFiles?.length || 0} 个文件
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="高级配置" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div>
              <Text strong>自动数据清洗</Text>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>自动去除重复数据、异常数据</div>
            </div>
            <Switch 
              checked={wizardData.autoProcess} 
              onChange={(checked) => setWizardData({ ...wizardData, autoProcess: checked })}
            />
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div>
              <Text strong>智能分段</Text>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>自动将长文本分段处理</div>
            </div>
            <Switch />
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div>
              <Text strong>自动创建标签</Text>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>根据数据类型自动生成标签</div>
            </div>
            <Switch 
              checked={wizardData.createTags}
              onChange={(checked) => setWizardData({ ...wizardData, createTags: checked })}
            />
          </div>
        </Space>
      </Card>

      <Alert
        message="合规声明"
        description="您确认上传的数据已获得相关授权，不涉及任何版权和隐私问题。平台将按照相关法律法规对数据进行保护。"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => setWizardStep(1)}>上一步</Button>
        <Button onClick={() => setShowDraftModal(true)}>保存草稿</Button>
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          onClick={() => {
            message.success('数据集创建成功！');
            setWizardVisible(false);
            setWizardStep(0);
            setWizardData({
              name: '',
              type: 'text',
              description: '',
              permission: 'private',
              tags: [],
              importMethod: 'upload',
              importedFiles: [],
              uploadProgress: 0,
              autoProcess: true,
              createTags: true
            });
            setFileList([]);
            wizardForm.resetFields();
          }}
        >
          立即创建
        </Button>
      </div>
    </div>
  );

  // 渲染内容区
  const renderContent = () => {
    if (datasetDetailVisible) {
      return renderDatasetDetail();
    }

    switch (selectedKey) {
      case 'dashboard':
        return renderDashboard();
      case 'file-management':
        return renderFileManagement();
      case 'dataset-management':
        return renderDatasetManagement();
      default:
        return (
          <Card bordered={false} className="module-card">
            <Empty description="功能开发中" />
          </Card>
        );
    }
  };

  return (
    <div className="app-container">
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

      <Layout className="app-main-layout">
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
                    { type: 'divider' as const },
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

        <Content className="app-content">
          {renderContent()}
        </Content>
      </Layout>

      {/* 二次确认弹窗 */}
      <Modal
        title={confirmModal.title}
        open={confirmModal.visible}
        onOk={confirmModal.onOk}
        onCancel={() => {
          setConfirmModal({ ...confirmModal, visible: false });
          confirmModal.onCancel?.();
        }}
        okText={confirmModal.okText}
        okType={confirmModal.okType}
        cancelText={confirmModal.cancelText}
      >
        <p>{confirmModal.content}</p>
      </Modal>

      {/* 告知弹窗 */}
      <Alert
        message={alertModal.title}
        description={alertModal.content}
        type={alertModal.type}
        showIcon
        showIcon
        closable
        afterClose={alertModal.onCancel}
        style={{ display: alertModal.visible ? 'block' : 'none' }}
        action={alertModal.showOk ? <Button type="primary" size="small" onClick={alertModal.onOk}>我知道了</Button> : undefined}
      />

      {/* 新建数据集向导弹窗 */}
      <Modal
        title="新建数据集"
        open={wizardVisible}
        onCancel={() => {
          if (Object.keys(wizardData).some(key => wizardData[key as keyof typeof wizardData] !== '' && wizardData[key as keyof typeof wizardData] !== [])) {
            Modal.confirm({
              title: '确认退出',
              content: '您正在创建数据集，是否确认退出？已填写内容可保存为草稿。',
              onOk: () => {
                setWizardVisible(false);
                setShowDraftModal(false);
              }
            });
          } else {
            setWizardVisible(false);
          }
        }}
        width={800}
        footer={null}
      >
        <Steps current={wizardStep}>
          <Step title="基础信息配置" icon={<DatabaseOutlined />} />
          <Step title="数据导入" icon={<CloudUploadOutlined />} />
          <Step title="配置确认与创建" icon={<CheckCircleOutlined />} />
        </Steps>

        {wizardStep === 0 && renderWizardStep1()}
        {wizardStep === 1 && renderWizardStep2()}
        {wizardStep === 2 && renderWizardStep3()}
      </Modal>

      {/* 草稿弹窗 */}
      <Modal
        title="发现未完成的草稿"
        open={showDraftModal}
        onCancel={() => setShowDraftModal(false)}
        onOk={() => {
          message.success('草稿已保存');
          setShowDraftModal(false);
        }}
      >
        <p>您有一个未完成的数据集创建草稿，是否保存？</p>
        <p style={{ color: '#9ca3af', fontSize: 12 }}>（草稿有效期7天）</p>
      </Modal>
    </div>
  );
}

export default App;
