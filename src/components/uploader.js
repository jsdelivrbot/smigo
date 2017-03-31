import React, { Component } from 'react'
import { Upload, Icon } from 'antd'

const Dragger = Upload.Dragger

const url = `http://${window.location.hostname}:8081/api/upload`

class Uploader extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: url,
      accept: ".sgf",
      onChange: this.props.onChange,
    }

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
