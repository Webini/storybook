import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'fast-deep-equal';
import { polyfill } from 'react-lifecycles-compat';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/textmate';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

const editorOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: false,
  showLineNumbers: true,
  tabSize: 2,
};

class JsonType extends Component {
  state = {
    value: {},
    failed: false, // eslint-disable-line
    json: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.knob.value && !state.json) {
      try {
        return {
          value: JSON.stringify(props.knob.value, null, 2),
          failed: false,
          json: props.knob.value,
        };
      } catch (e) {
        return { value: 'Object cannot be stringified', failed: true };
      }
    }
    return null;
  }

  handleChange = value => {
    const { value: stateValue } = this.state;
    const { knob, onChange } = this.props;
    if (value === stateValue) {
      return;
    }

    try {
      const json = JSON.parse(value.trim());
      this.setState({ value, json, failed: false }); // eslint-disable-line
      onChange(json);
    } catch (err) {
      this.setState({
        value,
        failed: true, // eslint-disable-line
      });
    }
  };

  render() {
    const { value } = this.state;
    const { knob } = this.props;

    return (
      <AceEditor
        theme="textmate"
        mode="json"
        name={knob.name}
        value={value || ''}
        onChange={this.handleChange}
        {...editorOptions}
      />
    );
  }
}

JsonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

JsonType.serialize = object => JSON.stringify(object);
JsonType.deserialize = value => (value ? JSON.parse(value) : {});

polyfill(JsonType);

export default JsonType;
