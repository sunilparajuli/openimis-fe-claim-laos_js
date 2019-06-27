import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class ReviewPage extends Component {
    render() {
        return <ProxyPage url="/ClaimOverview.aspx" />
    }
}

export { ReviewPage };