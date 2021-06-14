import ejs from "ejs"
import fs from "fs"
import { resolve } from "path"

const render = async (path: string, payload: any): Promise<string> => {
  const templatePath = resolve(path)
  return ejs.renderFile(templatePath, payload, {})
};

const main = async () => {
  const swEnv = await render("./templates/sw-env.js.ejs", {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  })
  fs.writeFileSync(resolve("./public/assets/js/sw-env.js"), swEnv)

  const firebaseMessaging = await render("./templates/firebase-messaging.js.ejs", {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  })
  fs.writeFileSync(resolve("./public/assets/js/firebase-messaging.js"), firebaseMessaging)
}

main().then(() => console.log("done")).catch(err => console.log(err));
