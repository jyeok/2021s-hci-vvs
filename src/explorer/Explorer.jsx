import React from "react";
import { Grid } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";

import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import Chonky from "explorer/Chonky";
import Preview from "container/Preview/Preview";

const fileManager = () => {
  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const QUERY = gql`
    {
      allRecords {
        id
        title
        path
      }
    }
  `;

  const { loading, data } = useQuery(QUERY);

  if (loading) return <div> 로딩 </div>;
  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid item xs={8}>
        <Chonky data={data} />
      </Grid>
      <Grid item xs={4} style={{ height: "600px" }}>
        <Preview name="미리보기" />
      </Grid>
    </Grid>
  );
};

export default fileManager;
