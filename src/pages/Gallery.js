import React, { useEffect, useState } from 'react'
import Photo from '../components/Photo'
import { TaggedEncryption } from '@functionland/fula-sec';
import { Uploader } from '../components/Uploader';
import { Buffer } from 'buffer'

const Gallery = ({ fulaClient, DID }) => {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (fulaClient && DID) {
      (async () => {
        const allData = await fulaClient.graphql(readQuery);
        if (allData && allData.data && allData.data.read) {
          setPhotos([]);
          for (const { cid, jwe, ownerId } of allData.data.read) {
            let file = null
            console.log({ cid, jwe, ownerId })
            if (jwe) {
              const tagged = new TaggedEncryption(DID.did)

              let plainObject
              try {
                plainObject = await tagged.decrypt(jwe)
              } catch (e) {
                console.log(e)
                continue
              }
              file = await fulaClient.receiveDecryptedFile(
                plainObject.CID,
                Buffer.from(plainObject.symetricKey.key, 'base64'),
                Buffer.from(plainObject.symetricKey.iv, 'base64')
              )
            } else {
              file = await fulaClient.receiveFile(cid);
            }
            if (file)
              setPhotos((prev) => [...prev, file]);
          }
        } else {
          setPhotos([])
        }
      })();
    }
  }, [fulaClient, DID]);

  const onUpload = async (selectedFile) => {
    try {
      // const cid = await fula.sendFile(selectedFile);
      // await fula.graphql(createMutation, { values: [{ cid, _id: cid }] });
      const { cid, key } = await fulaClient.sendEncryptedFile(selectedFile)
      const tagged = new TaggedEncryption(DID.did)

      let plaintext = {
        symmetricKey: key,
        CID: cid
      }
      let jwe = await tagged.encrypt(plaintext.symmetricKey, plaintext.CID, [DID.did.id])
      await fulaClient.graphql(createMutation, { values: [{ cid, _id: cid, jwe }] })
      setPhotos((prev) => [selectedFile, ...prev]);
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className='container flex-column'>
      <h1>Gallery</h1>
      <div className='m-20'>
        {fulaClient === null ? <div>No Box Connected!</div> : null}
        {DID === undefined ? <div>No Wallet Connected!</div> : null}
      </div>
      {fulaClient !== null ? <div>
        {/* <Uploader onUpload={onUpload} /> */}
        {
          photos.length > 0 && photos.map((photo, index) => (
            <div key={index} >
              <Photo photo={photo} />
            </div>
          ))
        }
        {
          photos.length === 0 && <div className="container">
            <h1>no photo</h1>
          </div>
        }
      </div> : null}
    </div>
  )
}

export default Gallery

export const readQuery = `
  query {
    read(input:{
      collection:"assetsMetas",
      filter:{}
    }){
      cid,
      symKey,
      iv,
      jwe,
      ownerId
    }

  }
`

export const createMutation = `
  mutation addImage($values:JSON){
    create(input:{
      collection:"gallery",
      values: $values
    }){
      cid
    }
  }
`;