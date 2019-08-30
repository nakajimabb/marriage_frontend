import React from "react";
import styled from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { red } from "@material-ui/core/colors";

import { VectorMap } from "react-jvectormap";

const MapContainer = styled.div`
  height: 300px;
`;

const Card = styled(MuiCard)(spacing);

class China extends React.Component {
  constructor(props) {
    super(props);

    this.options = {
      map: "ch_mill",
      regionStyle: {
        initial: {
          fill: red[500]
        }
      },
      backgroundColor: "transparent",
      containerStyle: {
        width: "100%",
        height: "100%"
      },
      zoomOnScroll: false
    };
  }

  render = () => (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          China Map
        </Typography>
        <MapContainer>
          <VectorMap {...this.options} />
        </MapContainer>
      </CardContent>
    </Card>
  );
}

export default China;
