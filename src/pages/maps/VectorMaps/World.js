import React from "react";
import styled, { withTheme } from "styled-components";

import { CardContent, Card as MuiCard, Typography } from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { VectorMap } from "react-jvectormap";

const MapContainer = styled.div`
  height: 300px;
`;

const Card = styled(MuiCard)(spacing);

class World extends React.Component {
  constructor(props) {
    super(props);

    this.options = {
      map: "world_mill",
      regionStyle: {
        initial: {
          fill: this.props.theme.palette.secondary.main
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
          World Map
        </Typography>
        <MapContainer>
          <VectorMap {...this.options} />
        </MapContainer>
      </CardContent>
    </Card>
  );
}

export default withTheme(World);
