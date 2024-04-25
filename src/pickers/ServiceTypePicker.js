import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { SERVICE_TYPE } from "../constants";

class ServiceTypePicker extends Component {
  render() {
    return <ConstantBasedPicker module="claim" label="serviceType" constants={SERVICE_TYPE} {...this.props} />;
  }
}

export default ServiceTypePicker;
