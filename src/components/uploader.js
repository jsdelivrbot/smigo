import React, { Component } from 'react'
import { Upload, message, Icon } from 'antd'

const Dragger = Upload.Dragger

const url = `http://${window.location.hostname}:8081/api/upload`

const props = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  action: url,
  accept: ".sgf",
  onChange(info) {
    console.log('info', info)

    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
}

class Uploader extends Component {
  render() {
    return (
      <div style={{ marginTop: 16, height: 180 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload.</p>
          <p className="ant-upload-hint">Support for a single SGF upload.</p>
        </Dragger>
      </div>
    )
  }
}

export default Uploader