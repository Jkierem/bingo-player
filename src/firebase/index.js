import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"

const getEnv = (str) => process.env[`REACT_APP_${str}`]

const firebaseConfig = {
  apiKey: getEnv("API_KEY"),
  authDomain: getEnv("AUTH_DOMAIN"),
  databaseURL: getEnv("DB_URL"),
  projectId: getEnv("PROJECT_ID"),
  storageBucket: getEnv("STORAGE_BUCKET"),
  messagingSenderId: getEnv("SENDER_ID"),
  appId: getEnv("APP_ID"),
}

// firebase.initializeApp(firebaseConfig)

export const auth = {}//firebase.auth()
export const database = {}//firebase.database()