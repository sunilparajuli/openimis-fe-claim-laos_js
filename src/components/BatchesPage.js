import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class BatchesPage extends Component {
    render() {
        return <ProxyPage url="/ProcessBatches.aspx" />
    }
}

export { BatchesPage };