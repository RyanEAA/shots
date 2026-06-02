import {
  signInAnonymously
} from "firebase/auth";

import { auth } from "./firebase";

export async function login() {
  await signInAnonymously(auth);
}