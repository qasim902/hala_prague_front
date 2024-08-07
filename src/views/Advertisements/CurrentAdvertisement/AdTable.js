import React from "react";
import { Button, Table } from "reactstrap";

const AdTable = ({ data, deleteAd }) => {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Banner</th>
          <th>Link</th>
          <th width="10%" style={{ textAlign: "center" }}>
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map(item => (
            <tr key={item.objectId}>
              <td>
                <img
                  src={item.img.url}
                  alt="banner"
                  style={{ height: "50px" }}
                />
              </td>
              <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  View Ad
                </a>
              </td>
              <td style={{ textAlign: "center" }} align="middle">
                <Button color="danger" value={item.objectId} onClick={deleteAd}>
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td align="center" colSpan="2">
              No Ads Found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AdTable;
