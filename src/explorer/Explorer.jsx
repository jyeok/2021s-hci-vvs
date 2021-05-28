/* eslint-disable */

import React, { useState, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import Chonky from "explorer/Chonky";
import Preview from "container/Preview/Preview";

const queries = {
  allRecords: gql`
    query allRecords {
      allRecords {
        id
        path
        title
        size
        createdAt
        updatedAt
        tag
        memo
        isLocked
      }
    }
  `,
  recordById: gql`
    query recordById($id: Int!) {
      recordById(id: $id) {
        id
        path
        title
        size
        createdAt
        updatedAt
        tag
        memo
        isLocked
      }
    }
  `,
};

const fileManager = () => {
  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const { loading, error, data, refetch, networkStatus } = useQuery(
    queries.allRecords
  );

  const [currData, setCurrData] = useState(data);
  const [currStat, setCurrStat] = useState(networkStatus);

  useEffect(() => {
    setCurrData(data), setCurrStat(networkStatus);
  }, [data, networkStatus]);

  if (loading) return <div> Loading.. </div>;
  if (error) return <div> error! ${currStat.message}</div>;
  if (!currData || currData !== data) {
    setCurrData(data);
    setCurrStat(networkStatus);
  }

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid item xs={8}>
        <Chonky data={currData} refetchAll={refetch} />
      </Grid>
      <Grid item xs={4} style={{ height: "600px" }}>
        <Preview name="미리보기" />
      </Grid>
      <Button onClick={() => refetch()}> ㅋㅋㅋㅋ </Button>
    </Grid>
  );
};

export default fileManager;
