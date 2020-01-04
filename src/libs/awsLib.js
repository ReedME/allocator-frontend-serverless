import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  // Upload the file to the user’s folder in S3 
  // using the Storage.vault.put() object.
  // Alternatively, if we were uploading publicly 
  // you can use the Storage.put() method.
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });
  console.log(stored)

  return stored.key;
}