import React from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { SERVICE_AREA_STATUS } from "../constants";

const ServiceAreaPicker = (props) => {
  return (
    <ConstantBasedPicker
      module="claim"
      label="ServiceArea"
      constants={SERVICE_AREA_STATUS}
      {...props}
    />
  );
};

export default ServiceAreaPicker;