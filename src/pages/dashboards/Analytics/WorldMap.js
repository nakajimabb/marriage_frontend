import React from "react";
import styled, { withTheme } from "styled-components";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { VectorMap } from "react-jvectormap";

import "../../../vendor/jvectormap.css";

const MapContainer = styled.div`
  height: 276px;
`;

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    this.options = {
      map: "world_mill",
      regionStyle: {
        initial: {
          fill: "#e3eaef"
        }
      },
      backgroundColor: "transparent",
      containerStyle: {
        width: "100%",
        height: "100%"
      },
      markerStyle: {
        initial: {
          r: 9,
          fill: this.props.theme.palette.secondary.main,
          "fill-opacity": 1,
          stroke: "#fff",
          "stroke-width": 7,
          "stroke-opacity": 0.4
        },
        hover: {
          stroke: "#fff",
          "fill-opacity": 1,
          "stroke-width": 1.5
        }
      },
      zoomOnScroll: false,
      markers: [
        {
          latLng: [31.230391, 121.473701],
          name: "Shanghai"
        },
        {
          latLng: [39.904202, 116.407394],
          name: "Beijing"
        },
        {
          latLng: [28.70406, 77.102493],
          name: "Delhi"
        },
        {
          latLng: [6.524379, 3.379206],
          name: "Lagos"
        },
        {
          latLng: [39.343357, 117.361649],
          name: "Tianjin"
        },
        {
          latLng: [24.860735, 67.001137],
          name: "Karachi"
        },
        {
          latLng: [41.00824, 28.978359],
          name: "Istanbul"
        },
        {
          latLng: [35.689487, 139.691711],
          name: "Tokyo"
        },
        {
          latLng: [23.12911, 113.264381],
          name: "Guangzhou"
        },
        {
          latLng: [19.075983, 72.877655],
          name: "Mumbai"
        },
        {
          latLng: [40.7127837, -74.0059413],
          name: "New York"
        },
        {
          latLng: [34.052235, -118.243683],
          name: "Los Angeles"
        },
        {
          latLng: [41.878113, -87.629799],
          name: "Chicago"
        },
        {
          latLng: [29.760427, -95.369804],
          name: "Houston"
        },
        {
          latLng: [51.507351, -0.127758],
          name: "London"
        },
        {
          latLng: [55.755825, 37.617298],
          name: "Moscow"
        },
        {
          latLng: [40.416775, -3.70379],
          name: "Madrid"
        }
      ]
    };
  }

  render = () => (
    <Card mb={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Real-Time
        </Typography>
        <MapContainer>
          <VectorMap {...this.options} />
        </MapContainer>
      </CardContent>
    </Card>
  );
}

export default withTheme(WorldMap);
