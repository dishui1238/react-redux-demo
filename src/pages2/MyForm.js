import React, { Component } from "react";

function FormCreate(Cmp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.options = {};
      this.state = {};
    }

    handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    };

    getFieldDecorator = (field, options) => {
      if (options && options.rules && options.rules.required) {
        this.options[field] = options;
      }
      return (InputCmp) => (
        <div>
          {React.cloneElement(InputCmp, {
            name: field,
            value: this.state[field] || "",
            onChange: this.handleChange,
          })}
        </div>
      );
    };
    getFieldsValue = () => {
      return { ...this.state };
    };
    getFieldValue = (field) => {
      return this.state[field];
    };

    validateFields = (callback) => {
      const temp = this.state;
      const err = [];
      for (let i in this.options) {
        if (temp[i] === undefined) {
          err.push({ [i]: "error" });
        }
      }
      if (err.length > 0) {
        callback(err, temp);
      } else {
        callback(null, temp);
      }
    };
    render() {
      return (
        <div>
          <Cmp
            {...this.props}
            getFieldDecorator={this.getFieldDecorator}
            getFieldsValue={this.getFieldsValue}
            getFieldValue={this.getFieldValue}
            validateFields={this.validateFields}
          />
        </div>
      );
    }
  };
}

class MyForm extends Component {
  submit = () => {
    const { getFieldsValue, validateFields } = this.props;
    validateFields((err, values) => {
      if (err) {
        console.log(err);
      } else {
        console.log("submit:", getFieldsValue());
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props;
    return (
      <div>
        <h1>MyForm</h1>
        {getFieldDecorator("name", {
          rules: {
            required: true,
          },
        })(<input type="text" />)}
        {getFieldDecorator("passward")(<input type="passward" />)}

        <button onClick={this.submit}>提交</button>
      </div>
    );
  }
}

export default FormCreate(MyForm);
