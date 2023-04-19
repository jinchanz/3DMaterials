import { Button, Box, Dialog, Upload, Icon, Card, Tag, Tab, Form, Input } from '@alifd/next';
import React, { createElement, useCallback, useEffect, useState } from 'react';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

interface OssTOken {
  expire: string;
  policy: string;
  signature: string;
  accessid: string;
  host: string;
  callback: string;
};

interface Assets {
  id: number;
  type: number; // 1-模型，2-贴图
  name: string;
  title: string;
  url: string;
  screenshot: string;
  component: string;
  props: Record<string, any>;
};

const AssetsTypeMap = {
  1: '模型',
  2: '贴图'
};

const AssetsList = (props) => {

  const { assetsList, type = 1 } = props;

  const openUploadForm = () => {
    const dialog = Dialog.show({
      v2: true,
      title: `新增${AssetsTypeMap[type]}`,
      content: <Form>
        <Form.Item label="名称">
          <Input
            placeholder={`请输入${AssetsTypeMap[type]}名称`}
            aria-required="true"
          />
        </Form.Item>
        <Form.Item label="标题">
          <Input
            placeholder={`请输入${AssetsTypeMap[type]}标题`}
            aria-required="true"
          />
        </Form.Item>
        <Form.Item label="upload:" name="a11yUpload">
          <Upload.Card
            listType="card"
            action="https://www.easy-mock.com/mock/5b713974309d0d7d107a74a3/alifd/upload"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
            defaultValue={[]}
            limit={2}
          />
        </Form.Item>
      </Form>
    });
  }

  return assetsList?.length ?
  <div>
    <div style={{ display: 'flex', justifyContent: 'end', padding: '15px 0' }}>
      <Button type='primary' onClick={openUploadForm} >上传{AssetsTypeMap[type]}</Button>
    </div>
    <div>
      <Box spacing={20} wrap direction="row" style={{ width: '100%' }}> 
      {
        assetsList.map((item) => {
          return <Card free style={{ width: 300 }}>
            <Card.Media>
              <div style={{background: 'antiquewhite', padding: 15}}>
                <img style={{width: '100%'}} src={item.screenshot} />
              </div>
            </Card.Media>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span> 
                  {item.title}
                </span>
                <span>
                  {item.name}
                </span>
              </div>
              <Tag size='small' type="primary" color={ item.type === 1 ? 'red' : 'turquoise' }>
                { item.type === 1 ? '模型' : '纹理贴图'}
              </Tag>
            </div>
          </Card>
        })
      }
      </Box>
    </div>
  </div> :
  <div style={{ width: '100%', padding: 100, display: 'flex', justifyContent: 'center' }}>
    空空如也~
  </div>;
};

const AssetsExplore = (props) => {

  const [assetsList, setAssetsList] = useState<Assets[]>();

  const [ dialogVisible, setDialogVisible ] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      const assetsResponse = await fetch('http://localhost:7001/api/v1/assets', {
        mode: "cors"
      });
      const data = await assetsResponse.json();
      if (data?.data) {
        setAssetsList(data.data);
      }
    }
    fetchAssets();
  }, []);

  const openDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const beforeUpload = async (file, options) => {
    const tokenResponse = await fetch('http://127.0.0.1:7001/api/v1/oss/token');
    const ossToken: OssTOken = await tokenResponse.json();
    const dataFormAjaxResponse = {
      host: ossToken.host,
      domain: ossToken.host,
      OSSAccessKeyId: ossToken.accessid,
      policy: ossToken.policy,
      signature: ossToken.signature,
      key: `3d-platform/${file.name}`
    };

    const {
      host,
      OSSAccessKeyId,
      policy,
      signature,
      key,
      domain
    } = dataFormAjaxResponse;

    options.action = host;
    options.data = {
      key,
      policy,
      OSSAccessKeyId,
      signature
    };

    file.tempUrl = `${domain}/${key}`;
    return options;
  };
  const onSuccess = (file, value) => {
    
  };
  const formatter = (res, file) => ({
    success: true,
    url: file.tempUrl
  });

  const textures = [];
  const models = [];

  assetsList?.length && assetsList?.forEach?.(item => {
    if (item.type === 1) {
      models.push(item);
    } else if (item.type === 2) {
      textures.push(item);
    }
  });

  return <div>
    <span className="lc-title lc-dock has-tip only-icon" onClick={openDialog}>
      <b className="lc-title-icon">

        <Icon type="atm" />
      </b>
    </span>
    <Dialog
      v2
      style={{ width: 1200 }}
      height="800px"
      title="3D 资产管理"
      visible={dialogVisible}
      onCancel={closeDialog}
      onClose={closeDialog}
    >
      <Tab>
        <Tab.Item title="模型">
          <AssetsList assetsList={models} />
        </Tab.Item>
        <Tab.Item title="贴图">
          <AssetsList assetsList={textures} />
        </Tab.Item>
      </Tab>
    </Dialog>
  </div>;
};


const AssetsExplorePlugin = (ctx: IPublicModelPluginContext, options: any) => {
    return {
    init() {
      console.log(' in AssetsExplorePlugin');
      // 往引擎增加面板
      ctx.skeleton.add({
        // area 配置见下方说明
        area: 'leftArea',
        // type 配置见下方说明
        type: 'Widget',
        content: AssetsExplore,
        name: 'AssetsExplorePlugin',
        props: {
          align: "left",
          icon: "wenjian",
          description: "AssetsExplorePlugin",
        },
      });
      ctx.logger.log('打个日志');
    },
    destroy() {
      console.log('我被销毁了~');
    },
  };
};

AssetsExplorePlugin.pluginName = 'AssetsExplorePlugin';

export default AssetsExplorePlugin;