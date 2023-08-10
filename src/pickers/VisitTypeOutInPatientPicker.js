import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { IN_OUT_STATUS } from "../constants";

class VisitTypeOutInPatientPicker extends Component {
  render() {
    return <ConstantBasedPicker module="claim" label="visitTypeOutInPatient" constants={IN_OUT_STATUS} {...this.props} />;
  }
}

export default VisitTypeOutInPatientPicker;
