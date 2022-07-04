import { TaggedEncryption } from '@functionland/fula-sec';
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import Photo from '../components/Photo';

const SharedPhotos = ({ fulaClient, DID }) => {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (fulaClient && DID) {
      (async () => {
        const sharedPhotoRecords = await fulaClient.graphql(readQuery)
        setPhotos([])
        if (sharedPhotoRecords.data && sharedPhotoRecords.data.read) {
          for (const record of sharedPhotoRecords.data.read) {
            const encJWE = record.jwe
            const tagged = new TaggedEncryption(DID.did)
            
            try {
              const jwe = await tagged.decrypt(encJWE)
              const photoFile = await fulaClient.receiveDecryptedFile(
                jwe.CID,
                Buffer.from(jwe.symetricKey.key, 'base64'),
                Buffer.from(jwe.symetricKey.iv, 'base64')
              )

              if(photoFile)
                setPhotos([...photos, photoFile])

            } catch (e) {
              console.log(e)
              continue
            }
          }
        }
      })()
    }
  }, [fulaClient, DID])
  return (
    <div className='container flex-column'>
      <h1>Photos shared with you</h1>
      <div>Identity</div>
      <div>{DID.authDID}</div>
      <div className='m-20'>
        {fulaClient === null ? <div>No Box Connected!</div> : null}
        {DID === undefined ? <div>No Wallet Connected!</div> : null}
      </div>
      {fulaClient !== null ? <div>
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

export default SharedPhotos

export const readQuery = `
  query {
    read(input:{
      collection:"sharedAssets",
      filter:{}
    }){
      cid,
      filename,
      orderId,
      shareWithId,
      jwe,
      date
    }
  }
`