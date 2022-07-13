import { TaggedEncryption } from "@functionland/fula-sec";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import Photo from "../components/Photo";
import { useRef } from "react";
import { Spinner } from "@chakra-ui/react";

const SharedPhotos = ({ fulaClient, DID }) => {
  const [photos, setPhotos] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false)
  const allPhotos = useRef({});
  const subscribeQuery = async () => {
    const sharedPhotoRecords = await fulaClient.graphql(readQuery, {
      filter: {
        shareWithId: { eq: `${DID.authDID}` },
      },
    });
    console.log({sharedPhotoRecords})
    if (sharedPhotoRecords.data && sharedPhotoRecords.data.read) {
      const newPhotos = [];
      setIsDownloading(true)
      for (const record of sharedPhotoRecords?.data?.read) {
        if (allPhotos.current[record.id])
          continue;
        const encJWE = record.jwe;
        const tagged = new TaggedEncryption(DID.did);
        try {
          const jwe = await tagged.decrypt(encJWE);
          const photoFile = await fulaClient.receiveDecryptedFile(
            jwe.CID,
            Buffer.from(jwe.symetricKey.key, "base64"),
            Buffer.from(jwe.symetricKey.iv, "base64")
          );
          if (photoFile) {
            newPhotos.push({
              cid: jwe.CID,
              photoFile,
            });
            allPhotos.current[record.id] = true
            setPhotos(prev => ([{cid: jwe.CID, photoFile}, ...prev]));
          }
        } catch (e) {
          console.log(e);
          continue;
        }
      }
      setIsDownloading(false)
    }
  };
  useEffect(() => {
    if (fulaClient && DID) {
      subscribeQuery();
    }
  }, [fulaClient, DID]);
  return (
    <div className="container flex-column">
      <h1>Photos shared with you</h1>
      <div>Identity</div>
      <div>{DID?.authDID}</div>
      <div className="m-20">
        {fulaClient === null ? <div>No Box Connected!</div> : null}
        {DID === undefined ? <div>No Wallet Connected!</div> : null}
      </div>
      {isDownloading && <Spinner className="spinner" color="#149fff" />}
      {fulaClient !== null ? (
        <div>
          {photos.length > 0 &&
            photos.map((photo, index) => (
              <Photo key={`${photo?.cid}`} photo={photo.photoFile} />
            ))}
          {photos.length === 0 && !isDownloading && (
            <div className="container">
              <h1>no photo</h1>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SharedPhotos;

export const readQuery = `
  query getSharedAssets($filter:JSON){
    read(input:{
      collection:"sharedAssets",
      filter:$filter
    }){
      id,
      cid,
      filename,
      orderId,
      shareWithId,
      jwe,
      date
    }
  }
`;
